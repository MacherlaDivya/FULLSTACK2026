# Quick Start Guide - Social Media API

Get the Social Media API up and running in 5 minutes!

## Step 1: Prerequisites Check

Make sure you have the following installed:

```bash
# Check Node.js version (should be v14 or higher)
node --version

# Check npm version
npm --version

# Verify MongoDB is running
# MongoDB should be accessible at: mongodb://127.0.0.1:27017
# You can test the connection using MongoDB CLI:
# mongosh mongodb://127.0.0.1:27017
```

## Step 2: Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd social-media-api
npm install
```

This command will install:
- Express.js
- Mongoose
- Body-Parser

Wait for the installation to complete. You should see a `node_modules` folder created with all dependencies.

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if MongoDB is installed as a service)
# It should be running automatically

# Or manually start MongoDB:
# mongod --dbpath "C:\path\to\your\data\directory"

# On macOS/Linux:
# mongod
```

Verify MongoDB is running by checking if you can connect:
```bash
# Open another terminal and run:
mongosh mongodb://127.0.0.1:27017
```

## Step 4: Run the Server

Start the API server:

```bash
npm start
```

You should see output like:

```
========================================
✓ Social Media API Server is running on port 3000
✓ API URL: http://localhost:3000
========================================

✓ Connected to MongoDB successfully
✓ Database: mongodb://127.0.0.1:27017/socialMediaDB
```

If you see this message, congratulations! Your API is running successfully! 🎉

## Step 5: Test the API

Open a new terminal and test the API with these quick commands:

### 5.1 Check API Status
```bash
curl http://localhost:3000/
```

Expected: A JSON response showing the API is running.

### 5.2 Create a Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","content":"Hello World!"}'
```

Expected: A JSON response with your new post including an `_id` field.

### 5.3 Get All Posts
```bash
curl http://localhost:3000/posts
```

Expected: A JSON array of all posts created.

### 5.4 Get a Specific Post
Replace `POST_ID` with the `_id` from step 5.2:

```bash
curl http://localhost:3000/posts/POST_ID
```

Expected: The specific post details.

### 5.5 Like a Post
Replace `POST_ID` with the `_id` from step 5.2:

```bash
curl -X POST http://localhost:3000/posts/POST_ID/like
```

Expected: The post with likes incremented by 1.

## Troubleshooting

### Issue: MongoDB Connection Error
```
✗ Failed to connect to MongoDB: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Ensure MongoDB is installed and running
- Check that MongoDB is listening on port 27017
- Try starting MongoDB manually: `mongod`

### Issue: Port 3000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
- Kill the process using port 3000:
  - On Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
  - On macOS/Linux: `lsof -i :3000` then `kill -9 <PID>`
- Or change the port in `server.js`

### Issue: npm install Fails
- Delete `node_modules` folder and `package-lock.json`
- Run `npm cache clean --force`
- Try `npm install` again

---

## Next Steps

1. **Read the Full Documentation**: Check [README.md](README.md) for detailed information
2. **Explore API Endpoints**: See [API_TESTING.md](API_TESTING.md) for comprehensive endpoint documentation
3. **Use Postman**: Import the API endpoints into Postman for easier testing
4. **Add More Features**: Extend the API with authentication, validation, etc.

---

## Project Structure

```
social-media-api/
├── server.js              # Main application file
├── package.json           # Project configuration
├── models/
│   └── Post.js           # MongoDB schema definition
├── routes/
│   └── posts.js          # API route handlers
├── README.md             # Full documentation
├── API_TESTING.md        # Testing guide with examples
├── QUICK_START.md        # This file
├── .env.example          # Environment configuration example
└── .gitignore            # Git ignore file
```

---

## Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/posts` | POST | Create a new post |
| `/posts` | GET | Get all posts |
| `/posts/:id` | GET | Get a specific post |
| `/posts/:id/like` | POST | Like a post (+1 to likes) |

---

## Tips

- Always send `Content-Type: application/json` header for POST requests
- Copy the full `_id` value when referencing posts
- Posts are returned sorted by newest first
- The `likes` field can be incremented multiple times per user

---

## Support

If you encounter any issues:
1. Check the MongoDB connection
2. Ensure all dependencies are installed
3. Review the error message in the console
4. Check [API_TESTING.md](API_TESTING.md) for expected responses

Happy coding! 🚀
