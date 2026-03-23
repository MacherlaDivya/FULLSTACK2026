# Social Media API

A simple yet powerful Social Media API built with Node.js, Express, MongoDB, and Mongoose. This API allows you to create, retrieve, and interact with social media posts.

## Features

- ✓ Create new posts with username and content
- ✓ Retrieve all posts with timestamps
- ✓ Retrieve specific posts by ID
- ✓ Like posts (increment likes count)
- ✓ MongoDB integration with Mongoose
- ✓ Comprehensive error handling
- ✓ JSON responses
- ✓ Input validation
- ✓ RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (v4.4 or higher) running locally on `mongodb://127.0.0.1:27017`

## Installation

1. Navigate to the project directory:
```bash
cd social-media-api
```

2. Install dependencies:
```bash
npm install
```

This will install:
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **body-parser**: Middleware for parsing request bodies

## Running the Server

Start the development server:
```bash
npm start
```

Expected output:
```
========================================
✓ Social Media API Server is running on port 3000
✓ API URL: http://localhost:3000
========================================

✓ Connected to MongoDB successfully
✓ Database: mongodb://127.0.0.1:27017/socialMediaDB
```

## API Endpoints

### 1. Create a New Post
**Request:**
```http
POST /posts
Content-Type: application/json

{
  "username": "john_doe",
  "content": "This is my first post!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "65c7a1b2f5e8d9c1a2b3c4d5",
    "username": "john_doe",
    "content": "This is my first post!",
    "likes": 0,
    "createdAt": "2024-02-12T10:30:00.000Z",
    "updatedAt": "2024-02-12T10:30:00.000Z",
    "__v": 0
  }
}
```

### 2. Retrieve All Posts
**Request:**
```http
GET /posts
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "65c7a1b2f5e8d9c1a2b3c4d5",
      "username": "john_doe",
      "content": "This is my first post!",
      "likes": 5,
      "createdAt": "2024-02-12T10:30:00.000Z",
      "updatedAt": "2024-02-12T10:35:00.000Z",
      "__v": 0
    },
    {
      "_id": "65c7a1b2f5e8d9c1a2b3c4d6",
      "username": "jane_smith",
      "content": "Hello World!",
      "likes": 3,
      "createdAt": "2024-02-12T10:25:00.000Z",
      "updatedAt": "2024-02-12T10:28:00.000Z",
      "__v": 0
    }
  ]
}
```

### 3. Retrieve a Specific Post by ID
**Request:**
```http
GET /posts/{postId}
```

**Example:**
```http
GET /posts/65c7a1b2f5e8d9c1a2b3c4d5
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "_id": "65c7a1b2f5e8d9c1a2b3c4d5",
    "username": "john_doe",
    "content": "This is my first post!",
    "likes": 5,
    "createdAt": "2024-02-12T10:30:00.000Z",
    "updatedAt": "2024-02-12T10:35:00.000Z",
    "__v": 0
  }
}
```

### 4. Like a Post (Increment Likes)
**Request:**
```http
POST /posts/{postId}/like
```

**Example:**
```http
POST /posts/65c7a1b2f5e8d9c1a2b3c4d5/like
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "_id": "65c7a1b2f5e8d9c1a2b3c4d5",
    "username": "john_doe",
    "content": "This is my first post!",
    "likes": 6,
    "createdAt": "2024-02-12T10:30:00.000Z",
    "updatedAt": "2024-02-12T10:36:00.000Z",
    "__v": 0
  }
}
```

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Username and content are required fields"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Post not found"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Error creating post",
  "error": "error details"
}
```

## Database Schema

### Post Model

```javascript
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

## Testing with cURL or Postman

### Create a Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","content":"This is my first post!"}'
```

### Get All Posts
```bash
curl http://localhost:3000/posts
```

### Get Specific Post
```bash
curl http://localhost:3000/posts/{postId}
```

### Like a Post
```bash
curl -X POST http://localhost:3000/posts/{postId}/like
```

## Project Structure

```
social-media-api/
├── server.js              # Main server file
├── package.json           # Project dependencies
├── models/
│   └── Post.js           # Mongoose Post schema
├── routes/
│   └── posts.js          # API route handlers
└── README.md             # This file
```

## Configuration

### MongoDB Connection
The application connects to MongoDB at: `mongodb://127.0.0.1:27017/socialMediaDB`

To change the database URL, modify the `MONGODB_URI` variable in `server.js`

### Server Port
The server runs on port `3000` by default.

To change the port, modify the `PORT` variable in `server.js`

## Error Handling

The application includes comprehensive error handling:
- Input validation for required fields
- MongoDB connection error handling
- Valid MongoDB ObjectId format validation
- Global error handling middleware
- Graceful shutdown on SIGINT (Ctrl+C)

## Key Features

1. **Body Parser Middleware**: Handles JSON and URL-encoded request bodies
2. **Mongoose Models**: Strongly-typed schema for posts
3. **MongoDB Timestamps**: Automatic `createdAt` and `updatedAt` fields
4. **Atomic Operations**: Uses MongoDB's `$inc` operator for safe likes increment
5. **Input Validation**: Validates required fields and data types
6. **Consistent Response Format**: All responses follow a standard JSON structure
7. **REST Conventions**: Proper HTTP methods and status codes

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally
- Check if the MongoDB service is active
- Verify the connection string in `server.js`

### Port Already in Use
- Change the `PORT` variable in `server.js`
- Or kill the process using port 3000

### Invalid Post ID Error
- MongoDB ObjectIds must be 24 hexadecimal characters
- Copy the full `_id` from the post response

## Future Enhancements

- Add authentication and authorization
- Implement post update and delete functionality
- Add pagination for listing posts
- Add comments on posts
- Add user profiles
- Add post search and filtering
- Add rate limiting

## License

ISC

## Author

Created as a demonstration of Node.js, Express, and MongoDB integration.
