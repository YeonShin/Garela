require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { swaggerUi, swaggerDocs } = require('./swagger');
const usersRouter = require('./routes/users'); // Users router
const postsRouter = require('./routes/posts'); // Posts router
const templatesRouter = require('./routes/templates'); // Templates router
const uploadRouter = require('./routes/upload'); // 이미지 업로드 라우터
const chatbotRouter = require('./routes/chat');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public/uploads'))); // 정적 파일 위치 설정
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/templates', templatesRouter);
app.use('/chat', chatbotRouter);
app.use('/upload', uploadRouter); // 이미지 업로드 라우터 추가


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
