const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postsRoutes = require('./routes/posts');

// Initialize Express app
const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/socialMediaDB';

// Middleware
// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
// Parse JSON bodies with a size limit of 10mb
app.use(bodyParser.json({ limit: '10mb' }));
// Parse URL-encoded bodies with extended mode
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// Serve static files from public directory
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✓ Connected to MongoDB successfully');
    console.log(`✓ Database: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.error('✗ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Routes
app.use('/posts', postsRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Social Media API is running',
    version: '1.0.0',
    endpoints: {
      'POST /posts': 'Create a new post',
      'GET /posts': 'Retrieve all posts',
      'GET /posts/:id': 'Retrieve a specific post by ID',
      'POST /posts/:id/like': 'Increment likes for a specific post'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`✓ Social Media API Server is running on port ${PORT}`);
  console.log(`✓ API URL: http://localhost:${PORT}`);
  console.log(`========================================\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  mongoose.disconnect().then(() => {
    console.log('✓ MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;
