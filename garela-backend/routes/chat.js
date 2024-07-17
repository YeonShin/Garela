const express = require("express");
const axios = require("axios");
const authenticateJWT = require("../middleware/authenticateJWT");
const crypto = require("crypto");
const connection = require("../db"); // MySQL 연결 설정
const { htmlToText } = require('html-to-text');

const router = express.Router();

const userSessions = {};

const stopWords = [
  "대해", "설명", "해줘", "을", "그리고", "의", "가", "이", "은", "는", "에", "에서", 
  "와", "과", "도", "으로", "하지만", "또한", "뿐만", "설명해줘", "설명", "해줘", "설명해", "알려줘", "찾아줘", "관한", "왜", "때문에"
  // 여기에 더 많은 불용어를 추가하세요
];

function extractKeywords(question) {
  const words = question.split(" ");
  return words.filter(word => !stopWords.includes(word));
}

async function getPostsContent(keywords) {
  return new Promise((resolve, reject) => {
    const query = "SELECT post_id, content FROM posts";
    connection.query(query, (err, results) => {
      if (err) return reject(err);

      const filteredPosts = results.filter(row => 
        keywords.some(keyword => row.content.includes(keyword))
      );


      const content = filteredPosts.map((row) => htmlToText(row.content, {
        wordwrap: false,
        noLinkBrackets: true,
        ignoreHref: true,
        preserveNewlines: false,
        selectors: [
          { selector: 'a', format: 'skip' },
          { selector: 'img', format: 'skip' },
          { selector: 'blockquote', format: 'skip' },
          { selector: 'pre', format: 'inline' },
          { selector: 'code', format: 'inline' },
          { selector: "li", format: 'skip'},
          { selector: "ui", format: 'inline'},
          { selector: 'h1', format: 'inline'},
          { selector: 'h2', format: 'inline'},
          { selector: 'h3', format: 'inline'},
          {selector: 'strong', format: 'skip'},

        ]
      }).replace(/\n/g, ' ')).join(" ");

      const postIds = filteredPosts.map(row => row.post_id);
      resolve({ content, postIds });
    });
  });
}

async function getAnswer(question) {
  const keywords = extractKeywords(question);
  console.log(keywords);
  const { content, postIds } = await getPostsContent(keywords);

  const response = await axios.post('http://localhost:5001/generate-answer', {
    context: content,
    question: question
  });

  return { answer: response.data.answer, references: postIds };
}


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
router.post("/", authenticateJWT, async (req, res) => {
  const { userPrompt, sessionId } = req.body;
  const userId = req.user.id; // JWT에서 추출한 userId

  if (!userSessions[userId] || userSessions[userId].sessionId !== sessionId) {
    return res.status(401).json({ message: "Invalid session" });
  }

  try {
    const { answer, references } = await getAnswer(userPrompt);
    console.log({ answer, references });

    userSessions[userId].history.push({
      role: "assistant",
      content: answer,
    });

    const referenceLinks = references.map(id => `http://localhost:3000/home/board/${id}`).join("\n");


    res.status(200).json({ 
      chat: { answer: `${answer}\n`, references } 
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Internal server error" });
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
router.post("/start-session", authenticateJWT, (req, res) => {
  const userId = req.user.id; // JWT에서 추출한 userId

  const sessionId = crypto.randomBytes(16).toString("hex");
  userSessions[userId] = {
    sessionId: sessionId,
    history: [
      { role: "bot", content: "Hello! I'm Garela. How can I help you?" },
    ],
  };

  res.status(200).json({ sessionId: sessionId });
});

module.exports = router;
