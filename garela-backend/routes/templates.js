const express = require('express');
const router = express.Router();
const connection = require('../db');
const authenticateJWT = require('../middleware/authenticateJWT');

/**
 * @swagger
 * tags:
 *   name: Templates
 *   description: 템플릿 관련 API 입니다.
 */

/**
 * @swagger
 * /templates:
 *   get:
 *     summary: 템플릿 리스트 조회
 *     description: 템플릿 리스트를 조회합니다.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 템플릿 리스트 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   templateId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   thumbnailImg:
 *                     type: string
 *                   userImg:
 *                     type: string
 *                   category:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   views:
 *                     type: integer
 *                   likes:
 *                     type: integer
 *                   subscribed:
 *                     type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT 
      t.template_id AS templateId, 
      t.user_id AS userId,
      t.title, 
      t.thumbnail_img AS thumbnailImg, 
      u.profile_img AS userImg, 
      t.category, 
      t.created_at AS createdAt, 
      t.views, 
      t.likes,
      EXISTS (
        SELECT 1 
        FROM follows f 
        WHERE f.follower_id = ? 
          AND f.following_id = t.user_id
      ) AS subscribed
    FROM templates t
    JOIN users u ON t.user_id = u.user_id
    ORDER BY t.created_at DESC`;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    // Convert 1/0 to true/false for 'subscribed'
    results.forEach(template => {
      template.subscribed = template.subscribed === 1;
    });
    res.status(200).json(results);
  });
});

/**
 * @swagger
 * /templates/{templateId}:
 *   get:
 *     summary: 템플릿 상세 정보 조회
 *     description: 특정 템플릿의 상세 정보를 조회합니다.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 템플릿 상세 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 templateId:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 userName:
 *                   type: string
 *                 userImg:
 *                   type: string
 *                 category:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 views:
 *                   type: integer
 *                 likes:
 *                   type: integer
 *                 myTemplate:
 *                   type: boolean
 *                 liked:
 *                   type: boolean
 *                 followed:
 *                   type: boolean
 *                 added:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: 템플릿을 찾을 수 없음
 *       500:
 *         description: Internal server error
 */
router.get('/:templateId', authenticateJWT, (req, res) => {
  const userId = req.user.userId;
  const templateId = req.params.templateId;

  const updateViewsQuery = 'UPDATE templates SET views = views + 1 WHERE template_id = ?';

  connection.beginTransaction((err) => {
    if (err) return res.status(500).send(err);

    connection.query(updateViewsQuery, [templateId], (err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).send(err);
        });
      }

      const query = `
        SELECT 
          t.template_id AS templateId, 
          t.user_id AS userId,
          t.title, 
          t.content, 
          u.name AS userName, 
          u.profile_img AS userImg, 
          t.category, 
          t.created_at AS createdAt, 
          t.views, 
          t.likes,
          t.user_id = ? AS myTemplate,
          EXISTS (
            SELECT 1 
            FROM likes l 
            WHERE l.user_id = ? 
              AND l.template_id = t.template_id
          ) AS liked,
          EXISTS (
            SELECT 1 
            FROM follows f 
            WHERE f.follower_id = ? 
              AND f.following_id = t.user_id
          ) AS followed,
          EXISTS (
            SELECT 1 
            FROM template_library tl 
            WHERE tl.user_id = ? 
              AND tl.template_id = t.template_id
          ) AS added
        FROM templates t
        JOIN users u ON t.user_id = u.user_id
        WHERE t.template_id = ?`;

      connection.query(query, [userId, userId, userId, userId, templateId], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).send(err);
          });
        }

        if (results.length > 0) {
          let template = results[0];
          template.myTemplate = template.myTemplate === 1;
          template.liked = template.liked === 1;
          template.followed = template.followed === 1;
          template.added = template.added === 1;

          res.status(200).json(template);
        } else {
          res.status(404).send('Template not found');
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
 * /templates:
 *   post:
 *     summary: 템플릿 작성
 *     description: 템플릿을 작성합니다.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: 템플릿 작성 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 templateId:
 *                   type: integer
 *       400:
 *         description: 필수 입력 항목이 누락됨
 *       500:
 *         description: 서버 오류
 */
router.post('/', authenticateJWT, (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).send('Missing required fields');
  }

  const userId = req.user.userId;
  const query = 'INSERT INTO templates (user_id, title, content, category) VALUES (?, ?, ?, ?)';

  connection.query(query, [userId, title, content, category], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).json({ templateId: result.insertId });
  });
});

/**
 * @swagger
 * /templates/{templateId}:
 *   put:
 *     summary: 템플릿 수정
 *     description: 템플릿을 수정합니다.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: templateId
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
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: 템플릿 수정 완료
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
router.put('/:templateId', authenticateJWT, (req, res) => {
  const { templateId } = req.params;
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).send('Missing required fields');
  }

  const userId = req.user.userId;

  // Check if the user is the owner of the template
  const checkOwnershipQuery = 'SELECT user_id FROM templates WHERE template_id = ?';
  connection.query(checkOwnershipQuery, [templateId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Template not found');
    if (results[0].user_id !== userId) return res.status(403).send('Unauthorized');

    // Update the template
    const updateQuery = 'UPDATE templates SET title = ?, content = ?, category = ? WHERE template_id = ?';
    connection.query(updateQuery, [title, content, category, templateId], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({ result: 'OK' });
    });
  });
});

/**
 * @swagger
 * /templates/{templateId}:
 *   delete:
 *     summary: 템플릿 삭제
 *     description: 템플릿을 삭제합니다.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 템플릿 삭제 완료
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
router.delete('/:templateId', authenticateJWT, (req, res) => {
  const { templateId } = req.params;
  const userId = req.user.userId;

  // Check if the user is the owner of the template
  const checkOwnershipQuery = 'SELECT user_id FROM templates WHERE template_id = ?';
  connection.query(checkOwnershipQuery, [templateId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Template not found');
    if (results[0].user_id !== userId) return res.status(403).send('Unauthorized');

    // Delete the template
    const deleteQuery = 'DELETE FROM templates WHERE template_id = ?';
    connection.query(deleteQuery, [templateId], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({ result: 'OK' });
    });
  });
});

module.exports = router;
