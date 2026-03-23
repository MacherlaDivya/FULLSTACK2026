# Social Media API - Testing Guide

This document provides examples of how to test the Social Media API using cURL, Postman, or any HTTP client.

## Prerequisites

- Server running on `http://localhost:3000`
- MongoDB running on `mongodb://127.0.0.1:27017`

---

## Test Cases

### Test 1: Health Check - API Status
Verify that the API is running and accessible.

**Request:**
```bash
curl -X GET http://localhost:3000/
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Social Media API is running",
  "version": "1.0.0",
  "endpoints": {
    "POST /posts": "Create a new post",
    "GET /posts": "Retrieve all posts",
    "GET /posts/:id": "Retrieve a specific post by ID",
    "POST /posts/:id/like": "Increment likes for a specific post"
  }
}
```

---

### Test 2: Create First Post
Create a new post with username and content.

**Request:**
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice_wonder",
    "content": "Just launched my new project! Excited to share it with everyone."
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "65c7a1b2f5e8d9c1a2b3c4d5",
    "username": "alice_wonder",
    "content": "Just launched my new project! Excited to share it with everyone.",
    "likes": 0,
    "createdAt": "2024-02-23T12:30:00.000Z",
    "updatedAt": "2024-02-23T12:30:00.000Z",
    "__v": 0
  }
}
```

**Note:** Save the `_id` value from the response for later tests.

---

### Test 3: Create Second Post
Create another post from a different user.

**Request:**
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bob_builder",
    "content": "Beautiful day for coding!"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "65c7a1b2f5e8d9c1a2b3c4d6",
    "username": "bob_builder",
    "content": "Beautiful day for coding!",
    "likes": 0,
    "createdAt": "2024-02-23T12:35:00.000Z",
    "updatedAt": "2024-02-23T12:35:00.000Z",
    "__v": 0
  }
}
```

---

### Test 4: Create Third Post
Create a third post.

**Request:**
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "username": "charlie_dev",
    "content": "Working on an amazing API project with Node.js and MongoDB!"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "65c7a1b2f5e8d9c1a2b3c4d7",
    "username": "charlie_dev",
    "content": "Working on an amazing API project with Node.js and MongoDB!",
    "likes": 0,
    "createdAt": "2024-02-23T12:40:00.000Z",
    "updatedAt": "2024-02-23T12:40:00.000Z",
    "__v": 0
  }
}
```

---

### Test 5: Retrieve All Posts
Get all posts from the database.

**Request:**
```bash
curl -X GET http://localhost:3000/posts
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "count": 3,
  "data": [
    {
      "_id": "65c7a1b2f5e8d9c1a2b3c4d7",
      "username": "charlie_dev",
      "content": "Working on an amazing API project with Node.js and MongoDB!",
      "likes": 0,
      "createdAt": "2024-02-23T12:40:00.000Z",
      "updatedAt": "2024-02-23T12:40:00.000Z",
      "__v": 0
    },
    {
      "_id": "65c7a1b2f5e8d9c1a2b3c4d6",
      "username": "bob_builder",
      "content": "Beautiful day for coding!",
      "likes": 0,
      "createdAt": "2024-02-23T12:35:00.000Z",
      "updatedAt": "2024-02-23T12:35:00.000Z",
      "__v": 0
    },
    {
      "_id": "65c7a1b2f5e8d9c1a2b3c4d5",
      "username": "alice_wonder",
      "content": "Just launched my new project! Excited to share it with everyone.",
      "likes": 0,
      "createdAt": "2024-02-23T12:30:00.000Z",
      "updatedAt": "2024-02-23T12:30:00.000Z",
      "__v": 0
    }
  ]
}
```

---

### Test 6: Retrieve Specific Post
Get a specific post by its ID.

**Request:**
Replace `POST_ID` with the actual `_id` from Test 2 (alice_wonder's post).

```bash
curl -X GET http://localhost:3000/posts/65c7a1b2f5e8d9c1a2b3c4d5
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "_id": "65c7a1b2f5e8d9c1a2b3c4d5",
    "username": "alice_wonder",
    "content": "Just launched my new project! Excited to share it with everyone.",
    "likes": 0,
    "createdAt": "2024-02-23T12:30:00.000Z",
    "updatedAt": "2024-02-23T12:30:00.000Z",
    "__v": 0
  }
}
```

---

### Test 7: Like a Post
Increment the likes count of a specific post.

**Request:**
```bash
curl -X POST http://localhost:3000/posts/65c7a1b2f5e8d9c1a2b3c4d5/like
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "_id": "65c7a1b2f5e8d9c1a2b3c4d5",
    "username": "alice_wonder",
    "content": "Just launched my new project! Excited to share it with everyone.",
    "likes": 1,
    "createdAt": "2024-02-23T12:30:00.000Z",
    "updatedAt": "2024-02-23T12:30:45.000Z",
    "__v": 0
  }
}
```

---

### Test 8: Like Same Post Multiple Times
Like the same post again to verify the counter increments.

**Request:**
```bash
curl -X POST http://localhost:3000/posts/65c7a1b2f5e8d9c1a2b3c4d5/like
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "_id": "65c7a1b2f5e8d9c1a2b3c4d5",
    "username": "alice_wonder",
    "content": "Just launched my new project! Excited to share it with everyone.",
    "likes": 2,
    "createdAt": "2024-02-23T12:30:00.000Z",
    "updatedAt": "2024-02-23T12:30:50.000Z",
    "__v": 0
  }
}
```

---

### Test 9: Error Test - Missing Required Field
Try to create a post without username (should fail).

**Request:**
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This should fail"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Username and content are required fields"
}
```

---

### Test 10: Error Test - Invalid Post ID
Try to retrieve a post with an invalid ID format.

**Request:**
```bash
curl -X GET http://localhost:3000/posts/invalid-id-format
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid post ID format"
}
```

---

### Test 11: Error Test - Non-existent Post
Try to retrieve a post with a valid ID format but that doesn't exist.

**Request:**
```bash
curl -X GET http://localhost:3000/posts/65c7a1b2f5e8d9c1a2b3c4ff
```

**Expected Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Post not found"
}
```

---

### Test 12: Error Test - Like Non-existent Post
Try to like a post that doesn't exist.

**Request:**
```bash
curl -X POST http://localhost:3000/posts/65c7a1b2f5e8d9c1a2b3c4ff/like
```

**Expected Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Post not found"
}
```

---

### Test 13: Error Test - Invalid Route
Try to access a non-existent endpoint.

**Request:**
```bash
curl -X GET http://localhost:3000/invalid-route
```

**Expected Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Route not found",
  "path": "/invalid-route",
  "method": "GET"
}
```

---

## Testing with Postman

### Postman Setup

1. Open Postman
2. Create a new collection called "Social Media API"
3. Create the following requests:

#### Request 1: Health Check
- **Method:** GET
- **URL:** `http://localhost:3000/`

#### Request 2: Create Post
- **Method:** POST
- **URL:** `http://localhost:3000/posts`
- **Body (JSON):**
```json
{
  "username": "your_username",
  "content": "Your post content"
}
```

#### Request 3: Get All Posts
- **Method:** GET
- **URL:** `http://localhost:3000/posts`

#### Request 4: Get Specific Post
- **Method:** GET
- **URL:** `http://localhost:3000/posts/INSERT_POST_ID_HERE`

#### Request 5: Like Post
- **Method:** POST
- **URL:** `http://localhost:3000/posts/INSERT_POST_ID_HERE/like`

---

## Response Status Codes

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 200 | OK | Successfully retrieved or updated |
| 201 | Created | Post created successfully |
| 400 | Bad Request | Missing required fields |
| 404 | Not Found | Post doesn't exist |
| 500 | Internal Server Error | Server error |

---

## Performance Testing

To test the API with multiple requests:

```bash
# Create 10 posts in a loop
for i in {1..10}; do
  curl -X POST http://localhost:3000/posts \
    -H "Content-Type: application/json" \
    -d "{\"username\": \"user_$i\", \"content\": \"Post number $i\"}"
  echo ""
done
```

---

## Notes

- Always replace `POST_ID` with actual post IDs from your responses
- Timestamps are in UTC format (ISO 8601)
- The `__v` field is Mongoose's version field (internal use)
- Posts are returned in descending order by creation date (newest first)
