# API Testing Guide

## Start the Server

In the terminal, run:
```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## Test Endpoints

You can use **Postman**, **Thunder Client** (VS Code extension), or **curl** to test these endpoints.

### A) Create a User

**POST** `http://localhost:3000/users`

**Body (JSON):**
```json
{
  "name": "John",
  "email": "john@gmail.com"
}
```

---

### B) Create a Course

**POST** `http://localhost:3000/courses`

**Body (JSON):**
```json
{
  "title": "Node + Sequelize",
  "description": "ORM course",
  "price": 499,
  "status": "published"
}
```

---

### C) Enroll User to Course

**POST** `http://localhost:3000/enrollments`

**Body (JSON):**
```json
{
  "userId": 1,
  "courseId": 1
}
```

---

### D) View a Course with Enrolled Users

**GET** `http://localhost:3000/courses/1`

---

### E) Update Enrollment Progress

**PUT** `http://localhost:3000/enrollments/1`

**Body (JSON):**
```json
{
  "progress": 60
}
```

---

### F) Delete Course

**DELETE** `http://localhost:3000/courses/1`

---

## Additional Endpoints

### Get All Users
**GET** `http://localhost:3000/users`

### Get User by ID
**GET** `http://localhost:3000/users/1`

### Update User
**PUT** `http://localhost:3000/users/1`
```json
{
  "name": "John Updated"
}
```

### Delete User
**DELETE** `http://localhost:3000/users/1`

### Get All Courses
**GET** `http://localhost:3000/courses`

### Get All Enrollments
**GET** `http://localhost:3000/enrollments`
