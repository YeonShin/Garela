const express = require('express');
const OpenAI = require("openai");
const authenticateJWT = require('../middleware/authenticateJWT');
const path = require('path');
const router = express.Router();
const crypto = require('crypto');

const openai = new OpenAI({
  apikey: process.env.OPENAI_API_KEY
});

// In-memory store for user sessions (for demonstration purposes)
// In production, consider using a more robust solution like Redis
const userSessions = {};

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: 챗봇 관련 API 입니다.
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: 챗봇 응답 조회
 *     description: GPT 챗봇의 응답을 받습니다.
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userPrompt
 *               - sessionId
 *             properties:
 *               userPrompt:
 *                 type: string
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 채팅 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chat:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateJWT, async (req, res) => {
  const { userPrompt, sessionId } = req.body;
  const userId = req.user.id; // JWT에서 추출한 userId
  console.log(userPrompt);

  if (!userSessions[userId] || userSessions[userId].sessionId !== sessionId) {
    return res.status(401).json({ message: 'Invalid session' });
  }

  const messages = userSessions[userId].history.concat([{ role: "user", content: userPrompt }]);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 100
    });

    const botMessage = response.choices[0].message.content;
    console.log(botMessage);

    userSessions[userId].history.push({ role: "assistant", content: botMessage });

    res.status(200).json({ chat: botMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /chat/start-session:
 *   post:
 *     summary: 새로운 채팅 세션 시작
 *     description: 유저의 새로운 채팅 세션을 시작합니다.
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: 세션 시작 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post('/start-session', authenticateJWT, (req, res) => {
  const userId = req.user.id; // JWT에서 추출한 userId

  const sessionId = crypto.randomBytes(16).toString('hex');
  userSessions[userId] = {
    sessionId: sessionId,
    history: [{ role: "assistant", content: "Hello! I'm Garela. How can I help you?" }]
  };

  res.status(200).json({ sessionId: sessionId });
});

module.exports = router;
