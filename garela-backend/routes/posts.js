const express = require('express');
const router = express.Router();
const connection = require('../db');
const authenticateJWT = require('../middleware/authenticateJWT');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
const fs = require('fs');


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

// // AWS S3 설정
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Multer 설정
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'public/uploads');
//   },
//   filename(req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//   },
// });

// const upload = multer({ storage: storage });

// router.post('/upload-image', upload.single('image'), async (req, res) => {
//   const file = req.file;
//   if (!file) return res.status(400).send('No file uploaded.');

//   try {
//     const uploadParams = {
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: `images/${Date.now().toString()}${path.extname(file.originalname)}`,
//       Body: fs.createReadStream(file.path),
//     };

//     const upload = new Upload({
//       client: s3,
//       params: uploadParams,
//     });

//     const result = await upload.done();
//     fs.unlinkSync(file.path); // 로컬 저장소에서 파일 삭제
//     const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

//     res.status(200).json({ url: imageUrl });
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 게시글 관련 API 입니다.
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: 게시글 리스트 조회
 *     description: 게시글 리스트를 조회합니다.
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: 게시글 리스트 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postId:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   thumbnailImg:
 *                     type: string
 *                   userId:
 *                     type: integer
 *                   userName:
 *                     type: string
 *                   userImg:
 *                     type: string
 *                   category:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   comments:
 *                     type: integer
 *                   views:
 *                     type: integer
 *                   likes:
 *                     type: integer
 *                   subscribed:
 *                     type: boolean
 *       500:
 *         description: Internal server error
 */
router.get('/', (req, res) => {
  const userId = req.user ? req.user.userId : null;

  const query = `
    SELECT 
      p.post_id AS postId, 
      p.title, 
      p.summary AS summary, 
      p.thumbnail_img AS thumbnailImg, 
      p.user_id AS userId,
      u.name AS userName, 
      u.profile_img AS userImg, 
      p.category, 
      p.created_at AS createdAt, 
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comments,
      p.views, 
      p.likes,
      EXISTS (
        SELECT 1 
        FROM follows f 
        WHERE f.follower_id = ? 
          AND f.following_id = p.user_id
      ) AS subscribed
    FROM posts p
    JOIN users u ON p.user_id = u.user_id
    ORDER BY p.created_at DESC`;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    
    // Convert 1/0 to true/false for 'subscribed'
    results.forEach(post => {
      post.subscribed = post.subscribed === 1;
    });
    
    res.status(200).json(results);
  });
});

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: 게시글 상세 정보 조회
 *     description: 특정 게시글의 상세 정보를 조회합니다.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 상세 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postId:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 userName:
 *                   type: string
 *                 userImg:
 *                   type: string
 *                 userInfo:
 *                   type: string
 *                 category:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 comments:
 *                   type: integer
 *                 views:
 *                   type: integer
 *                 likes:
 *                   type: integer
 *                 myPost:
 *                   type: boolean
 *                 liked:
 *                   type: boolean
 *                 followed:
 *                   type: boolean
 *                 commentList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       commentId:
 *                         type: integer
 *                       userImg:
 *                         type: string
 *                       userName:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       content:
 *                         type: string
 *                       myComment:
 *                         type: boolean
 *       404:
 *         description: 게시글을 찾을 수 없음
 *       500:
 *         description: Internal server error
 */
router.get('/:postId', (req, res) => {
  const userId = req.user ? req.user.userId : null;
  const postId = req.params.postId;

  const updateViewsQuery = 'UPDATE posts SET views = views + 1 WHERE post_id = ?';

  connection.beginTransaction((err) => {
    if (err) return res.status(500).send(err);

    connection.query(updateViewsQuery, [postId], (err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send(err);
        });
      }

      const query = `
        SELECT 
          p.post_id AS postId, 
          p.title, 
          p.content, 
          p.user_id AS userId,
          u.name AS userName, 
          u.profile_img AS userImg, 
          u.info AS userInfo, 
          p.category, 
          p.created_at AS createdAt, 
          p.views, 
          p.likes,
          p.user_id = ? AS myPost,
          EXISTS (
            SELECT 1 
            FROM likes l 
            WHERE l.user_id = ? 
              AND l.post_id = p.post_id
          ) AS liked,
          EXISTS (
            SELECT 1 
            FROM follows f 
            WHERE f.follower_id = ? 
              AND f.following_id = p.user_id
          ) AS followed,
          (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comments,
          (SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'commentId', c.comment_id,
            'userImg', u2.profile_img,
            'userName', u2.name,
            'createdAt', c.created_at,
            'content', c.content,
            'myComment', IF(c.user_id = ?, true, false)
          )) FROM comments c 
          JOIN users u2 ON c.user_id = u2.user_id 
          WHERE c.post_id = p.post_id ORDER BY c.created_at ASC) AS commentList
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.post_id = ?`;

      connection.query(query, [userId, userId, userId, userId, postId], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send(err);
          });
        }

        if (results.length > 0) {
          let post = results[0];
          post.myPost = post.myPost === 1;
          post.liked = post.liked === 1;
          post.followed = post.followed === 1;

          // commentList가 null인 경우 빈 배열로 설정
          if (!post.commentList) {
            post.commentList = [];
          }

          res.status(200).json(post);
        } else {
          res.status(404).send('Post not found');
        }
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).send(err);
            });
          }
        });
      });
    });
  });
});







/**
 * @swagger
 * /posts:
 *   post:
 *     summary: 게시글 작성
 *     description: 게시글을 작성합니다.
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *               - summary
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               summary:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 게시글 작성 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postId:
 *                   type: integer
 *       400:
 *         description: 필수 입력 항목이 누락됨
 *       500:
 *         description: 서버 오류
 */
router.post('/', authenticateJWT, upload.single('image'), async (req, res) => {
  const { title, content, category, summary } = req.body;
  const image = req.file; // 이미지 파일
  if (!title || !content || !category || !summary || !image) {
    return res.status(400).send('Missing required fields');
  }

  const userId = req.user.userId;
  
  try {
    // S3에 파일 업로드
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `images/${Date.now().toString()}${path.extname(image.originalname)}`,
      Body: image.buffer,
    };

    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    const result = await upload.done();
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

    const postQuery = 'INSERT INTO posts (user_id, title, content, category, summary, thumbnail_img) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(postQuery, [userId, title, content, category, summary, imageUrl], (err, result) => {
      if (err) return res.status(500).send(err);
      const postId = result.insertId;
      const postListQuery = 'INSERT INTO post_lists (user_id, post_id) VALUES (?, ?)';
      
      connection.query(postListQuery, [userId, postId], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ postId });
      });
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: 게시글 수정
 *     description: 게시글을 수정합니다.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *               - summary
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               summary:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 게시글 수정 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       400:
 *         description: 필수 입력 항목이 누락됨
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */
router.put('/:postId', authenticateJWT, upload.single('image'), async (req, res) => {
  const { postId } = req.params;
  const { title, content, category, summary } = req.body;
  const image = req.file; // 이미지 파일

  if (!title || !content || !category || !summary || !image) {
    return res.status(400).send('Missing required fields');
  }

  const userId = req.user.userId;

  // Check if the user is the owner of the post
  const checkOwnershipQuery = 'SELECT user_id FROM posts WHERE post_id = ?';
  connection.query(checkOwnershipQuery, [postId], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Post not found');
    if (results[0].user_id !== userId) return res.status(403).send('Unauthorized');

    try {
      // S3에 파일 업로드
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `images/${Date.now().toString()}${path.extname(image.originalname)}`,
        Body: image.buffer,
      };

      const upload = new Upload({
        client: s3,
        params: uploadParams,
      });

      const result = await upload.done();
      const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

      // Update the post
      const updateQuery = 'UPDATE posts SET title = ?, content = ?, category = ?, summary = ?, thumbnail_img = ? WHERE post_id = ?';
      connection.query(updateQuery, [title, content, category, summary, imageUrl, postId], (err) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ result: 'OK' });
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });
});

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: 게시글 삭제
 *     description: 게시글을 삭제합니다.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 삭제 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/:postId', authenticateJWT, (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  // Check if the user is the owner of the post
  const checkOwnershipQuery = 'SELECT user_id FROM posts WHERE post_id = ?';
  connection.query(checkOwnershipQuery, [postId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Post not found');
    if (results[0].user_id !== userId) return res.status(403).send('Unauthorized');

    // Delete the post
    const deleteQuery = 'DELETE FROM posts WHERE post_id = ?';
    connection.query(deleteQuery, [postId], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({ result: 'OK' });
    });
  });
});

/**
 * @swagger
 * /posts/like/{postId}:
 *   put:
 *     summary: 게시글 좋아요
 *     description: 게시글에 좋아요를 누릅니다. 한 번 더 누르면 좋아요가 취소됩니다.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 좋아요 상태 변경 완료
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
router.put('/like/:postId', authenticateJWT, (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  // Check if the user has already liked the post
  const checkLikeQuery = 'SELECT * FROM likes WHERE user_id = ? AND post_id = ?';
  connection.query(checkLikeQuery, [userId, postId], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      // If the like exists, remove it (unlike)
      const unlikeQuery = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
      connection.query(unlikeQuery, [userId, postId], (err) => {
        if (err) return res.status(500).send(err);

        // Decrease the like count on the post
        const decreaseLikeCountQuery = 'UPDATE posts SET likes = likes - 1 WHERE post_id = ?';
        connection.query(decreaseLikeCountQuery, [postId], (err) => {
          if (err) return res.status(500).send(err);
          res.status(200).json({ result: 'OK' });
        });
      });
    } else {
      // If the like does not exist, add it (like)
      const likeQuery = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)';
      connection.query(likeQuery, [userId, postId], (err) => {
        if (err) return res.status(500).send(err);

        // Increase the like count on the post
        const increaseLikeCountQuery = 'UPDATE posts SET likes = likes + 1 WHERE post_id = ?';
        connection.query(increaseLikeCountQuery, [postId], (err) => {
          if (err) return res.status(500).send(err);
          res.status(200).json({ result: 'OK' });
        });
      });
    }
  });
});

/**
 * @swagger
 * /posts/comment/{postId}:
 *   post:
 *     summary: 댓글 작성
 *     description: 게시글에 댓글을 작성합니다.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 댓글 작성 완료
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
router.post('/comment/:postId', authenticateJWT, (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  if (!postId || !content) {
    return res.status(400).send('Missing required fields');
  }

  const query = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
  connection.query(query, [postId, userId, content], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ result: 'OK' });
  });
});

/**
 * @swagger
 * /posts/comment/{commentId}:
 *   delete:
 *     summary: 댓글 삭제
 *     description: 특정 댓글을 삭제합니다.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 삭제 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */
router.delete('/comment/:commentId', authenticateJWT, (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;

  // Check if the user is the owner of the comment
  const checkOwnershipQuery = 'SELECT user_id FROM comments WHERE comment_id = ?';
  connection.query(checkOwnershipQuery, [commentId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Comment not found');
    if (results[0].user_id !== userId) return res.status(403).send('Unauthorized');

    // Delete the comment
    const deleteQuery = 'DELETE FROM comments WHERE comment_id = ?';
    connection.query(deleteQuery, [commentId], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({ result: 'OK' });
    });
  });
});


module.exports = router;
