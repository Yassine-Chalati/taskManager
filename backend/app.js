// app.js
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./utils/errorHandler');
const checkJwt = require('./middlewares/keycloakMiddleware'); // Import JWT verification middleware
const cors = require('cors'); // Import the CORS middleware


dotenv.config();

const app = express();

// Create a write stream with dynamic log file based on date and hour
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory); // Create the logs directory if it doesn't exist
}

// Get the current date and hour
const now = new Date();
const date = now.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
const hour = now.getHours().toString().padStart(2, '0'); // Get the current hour (e.g., '12' for 12 PM)

// Create dynamic log file name with date and hour
const logFileName = `access-${date}-${hour}.log`;

// Define the full path to the log file
const logFilePath = path.join(logDirectory, logFileName);

// Create a write stream to log requests to a file
const accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Use Morgan to log to both the terminal and the file
app.use(morgan('dev'));  // Log to the terminal with 'dev' format (concise, colorized)
app.use(morgan('combined', { stream: accessLogStream }));  // Log to file with 'combined' format

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from your frontend (adjust if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow headers like Content-Type and Authorization
}));

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes for tasks
app.use('/api/tasks', checkJwt, taskRoutes);

// Error handler middleware
app.use(errorHandler);

// Export app for use in tests
module.exports = app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
