const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// POST /posts - Create a new post
router.post('/', async (req, res) => {
  try {
    const { username, content } = req.body;

    // Validation
    if (!username || !content) {
      return res.status(400).json({
        success: false,
        message: 'Username and content are required fields'
      });
    }

    // Create new post
    const newPost = new Post({
      username,
      content,
      likes: 0
    });

    // Save to database
    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: savedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
});

// GET /posts - Retrieve all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No posts found',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving posts',
      error: error.message
    });
  }
});

// GET /posts/:id - Retrieve a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving post',
      error: error.message
    });
  }
});

// POST /posts/:id/like - Increment likes count for a specific post
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }

    // Find post and increment likes by 1
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Post liked successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking post',
      error: error.message
    });
  }
});

module.exports = router;
