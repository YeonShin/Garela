require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { swaggerUi, swaggerDocs } = require('./swagger');
const usersRouter = require('./routes/users'); // Users router
const postsRouter = require('./routes/posts'); // Posts router
const templatesRouter = require('./routes/templates'); // Templates router

const app = express();
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/templates', templatesRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
