const express = require('express');
const OpenAI = require("openai");
const authenticateJWT = require('../middleware/authenticateJWT');
const path = require('path');
const router = express.Router();


const openai = new OpenAI({
  apikey: process.env.OPENAI_API_KEY
});


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
 *             properties:
 *               userPrompt:
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
 *         description: Invalid Request
 *       500:
 *         description: Internal server error
 */
router.post('/', async(req, res) => {
  const userPrompt = req.body.userPrompt;
  console.log(userPrompt);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{"role":"user","content":userPrompt}],
      max_tokens:100
    });
    console.log(response.choices[0].message.content);
    res.status(200).json({ chat: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }


});



module.exports = router;