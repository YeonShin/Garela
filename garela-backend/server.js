const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const connection = require('./db'); // MySQL connection file
const { swaggerUi, swaggerDocs } = require('./swagger'); // Import Swagger configuration
const usersRouter = require('./routes/users'); // Users router

const app = express();
app.use(bodyParser.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use the users router
app.use('/users', usersRouter);

// Define routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
