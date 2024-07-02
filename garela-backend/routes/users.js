const express = require('express');
const router = express.Router();
const connection = require('../db');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middleware/authenticateJWT');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User 관련 API 입니다.
 */

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


module.exports = router;
