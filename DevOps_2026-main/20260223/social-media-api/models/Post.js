const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
