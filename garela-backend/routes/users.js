const express = require('express');
const router = express.Router();
const connection = require('../db');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authenticateJWT');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');

// AWS S3 설정
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: 회원가입
 *     description: 회원가입을 합니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - info
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               info:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/register', (req, res) => {
  const { email, password, name, info } = req.body;
  if (!email || !password || !name || !info) {
    return res.status(400).send('Missing required fields');
  }
  const query = 'INSERT INTO users (email, password, name, info) VALUES (?, ?, ?, ?)';
  connection.query(query, [email, password, name, info], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ result: 'User registered', user_id: result.insertId });
  });
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: 로그인
 *     description: 로그인을 합니다. 이메일과 비밀번호를 json으로 넘기면, json으로 토큰을 제공합니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Missing required fields');
  }
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 유저 정보 조회
 *     description: 유저 정보를 조회합니다.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 유저 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 profile_img:
 *                   type: string
 *                 name:
 *                   type: string
 *                 info:
 *                   type: string
 *                 template_list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       template_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                 post_list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       post_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                 follow_list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       profile_img:
 *                         type: string
 *                       info:
 *                         type: string
 *                 template_library:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       template_id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       category:
 *                         type: string
 *                       thumbnail_img:
 *                         type: string
 *                       is_my_template:
 *                         type: boolean
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.userId;  // JWT에서 userId 추출
  const query = `
    SELECT u.user_id AS userId, u.email, u.profile_img AS profileImg, u.name, u.info,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('templateId', t.template_id, 'title', t.title, 'thumbnailImg', t.thumbnail_img, 'userImg', u.profile_img, 'category', t.category, 'createdAt', t.created_at, 'views', t.views, 'likes', t.likes)) FROM templates t WHERE t.user_id = u.user_id) AS myTemplates,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('postId', p.post_id, 'title', p.title, 'summary', p.content, 'thumbnailImg', p.thumbnail_img, 'userName', u.name, 'userImg', u.profile_img, 'category', p.category, 'createdAt', p.created_at, 'comments', (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id), 'views', p.views, 'likes', p.likes)) FROM posts p WHERE p.user_id = u.user_id) AS myPosts,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('userId', f.following_id, 'name', u2.name, 'profileImg', u2.profile_img, 'info', u2.info)) FROM follows f JOIN users u2 ON f.following_id = u2.user_id WHERE f.follower_id = u.user_id) AS followingUsers,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('templateId', tl.template_id, 'title', t2.title, 'category', t2.category, 'thumbnailImg', t2.thumbnail_img, 'isMyTemplate', IF(t2.user_id = ?, true, false))) FROM template_library tl JOIN templates t2 ON tl.template_id = t2.template_id WHERE tl.user_id = ?) AS templateLibrary
    FROM users u
    WHERE u.user_id = ?`;
  connection.query(query, [userId, userId, userId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('User not found');
    }
  });
});

/**
 * @swagger
 * /users:
 *   put:
 *     summary: 유저 정보 수정
 *     description: 유저 정보를 수정합니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               info:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.put('/', authenticateJWT, upload.single('photo'), async (req, res) => {
  const userId = req.user.userId; // JWT에서 userId 추출
  const { name, info } = req.body;
  let profile_img;
  if (req.file) {
    try {
      // S3에 파일 업로드
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `profile_images/${Date.now().toString()}${path.extname(req.file.originalname)}`,
        Body: req.file.buffer,
      };

      const upload = new Upload({
        client: s3,
        params: uploadParams,
      });

      const result = await upload.done();
      profile_img = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  const fields = [];
  const values = [];
  if (name) {
    fields.push('name = ?');
    values.push(name);
  }
  if (info) {
    fields.push('info = ?');
    values.push(info);
  }
  if (profile_img) {
    fields.push('profile_img = ?');
    values.push(profile_img);
  }
  values.push(userId);

  if (fields.length === 0) {
    return res.status(400).send('No fields to update');
  }

  const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
  connection.query(query, values, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ result: 'User updated' });
  });
});

/**
 * @swagger
 * /users/follow/{userId}:
 *   put:
 *     summary: 유저 팔로우
 *     description: 유저를 팔로우하거나 팔로우를 취소합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 팔로우 상태 변경 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.put('/follow/:userId', authenticateJWT, (req, res) => {
  const { userId } = req.params;  // 팔로우 대상 사용자 ID
  const followerId = req.user.userId;  // JWT에서 추출한 현재 사용자 ID

  // Check if the user is already following the target user
  const checkFollowQuery = 'SELECT * FROM follows WHERE follower_id = ? AND following_id = ?';
  connection.query(checkFollowQuery, [followerId, userId], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      // If the follow exists, remove it (unfollow)
      const unfollowQuery = 'DELETE FROM follows WHERE follower_id = ? AND following_id = ?';
      connection.query(unfollowQuery, [followerId, userId], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ result: 'OK' });
      });
    } else {
      // If the follow does not exist, add it (follow)
      const followQuery = 'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)';
      connection.query(followQuery, [followerId, userId], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ result: 'OK' });
      });
    }
  });
});

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: 회원 탈퇴
 *     description: 회원 탈퇴를 합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 회원 탈퇴 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       500:
 *         description: 서버 오류
 */
router.delete('/', authenticateJWT, (req, res) => {
  const userId = req.user.userId;

  const deleteQuery = 'DELETE FROM users WHERE user_id = ?';
  connection.query(deleteQuery, [userId], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ result: 'OK' });
  });
});

/**
 * @swagger
 * /users/email:
 *   get:
 *     summary: 이메일 중복 확인
 *     description: 이메일이 이미 가입된 이메일인지 확인합니다.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 이메일 중복 확인 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.get('/email', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).send('Missing email parameter');
  }

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ result: results.length > 0 });
  });
});


module.exports = router;
