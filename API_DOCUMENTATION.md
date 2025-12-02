# EduAI API Documentation

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "692e7cb2fee4a61a9c9396ee",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "692e7cb2fee4a61a9c9396ee",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "692e7cb2fee4a61a9c9396ee",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2024-12-02T10:00:00.000Z"
}
```

---

### Update Profile
```http
PUT /api/auth/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "john_updated",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "message": "Profile updated",
  "user": {
    "id": "692e7cb2fee4a61a9c9396ee",
    "username": "john_updated",
    "email": "newemail@example.com"
  }
}
```

---

### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## 📚 Course Endpoints

### Create Course (Manual)
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to JavaScript",
  "description": "Learn JavaScript from scratch",
  "useAI": false
}
```

---

### Create Course (AI-Generated)
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "Machine Learning Basics",
  "useAI": true
}
```

**Response (201):**
```json
{
  "_id": "692e7d8afee4a61a9c9396f0",
  "title": "Mastering Machine Learning Basics",
  "description": "A comprehensive guide to machine learning...",
  "instructor": "692e7cb2fee4a61a9c9396ee",
  "generatedByAI": true,
  "learningOutcomes": [
    "Understand ML fundamentals",
    "Apply algorithms to real problems",
    "Build ML models"
  ],
  "estimatedDuration": "6 weeks",
  "content": [
    {
      "moduleTitle": "Introduction to ML",
      "level": "Beginner",
      "moduleOverview": "Getting started with machine learning",
      "lessons": [
        {
          "lessonTitle": "What is Machine Learning?",
          "explanation": "Machine learning is...",
          "examples": ["Example 1", "Example 2"],
          "analogies": ["Think of ML like..."],
          "realWorldApplications": ["Recommendation systems", "Image recognition"],
          "quickPractice": ["Question 1", "Question 2"],
          "resources": {
            "youtube": [{"title": "ML Intro", "url": "https://..."}],
            "blogs": [{"title": "ML Guide", "url": "https://..."}]
          }
        }
      ]
    }
  ],
  "createdAt": "2024-12-02T10:30:00.000Z"
}
```

---

### Get User's Courses (with Filters)
```http
GET /api/courses?search=javascript&generatedByAI=true&sort=newest&page=1&limit=6
Authorization: Bearer <token>
```

**Query Parameters:**
- `search` (string): Search in course titles
- `generatedByAI` (boolean): Filter by AI-generated or custom
- `sort` (string): `newest`, `oldest`, or `title`
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response (200):**
```json
{
  "courses": [
    {
      "_id": "692e7d8afee4a61a9c9396f0",
      "title": "JavaScript Fundamentals",
      "description": "Learn JS basics",
      "instructor": {
        "_id": "692e7cb2fee4a61a9c9396ee",
        "username": "johndoe"
      },
      "generatedByAI": true,
      "content": [...],
      "createdAt": "2024-12-02T10:30:00.000Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "totalCourses": 15
}
```

---

### Get All Public Courses
```http
GET /api/courses/all?search=python&page=1&limit=10
```

**Response:** Same structure as user courses

---

### Get Course by ID
```http
GET /api/courses/692e7d8afee4a61a9c9396f0
```

**Response (200):**
```json
{
  "_id": "692e7d8afee4a61a9c9396f0",
  "title": "JavaScript Fundamentals",
  "description": "Learn JS basics",
  "instructor": {
    "_id": "692e7cb2fee4a61a9c9396ee",
    "username": "johndoe"
  },
  "generatedByAI": true,
  "learningOutcomes": [...],
  "estimatedDuration": "4 weeks",
  "content": [...],
  "createdAt": "2024-12-02T10:30:00.000Z"
}
```

---

### Update Course
```http
PUT /api/courses/692e7d8afee4a61a9c9396f0
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced JavaScript",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "_id": "692e7d8afee4a61a9c9396f0",
  "title": "Advanced JavaScript",
  "description": "Updated description",
  ...
}
```

---

### Delete Course
```http
DELETE /api/courses/692e7d8afee4a61a9c9396f0
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Course and associated quizzes removed"
}
```

---

## 📝 Quiz Endpoints

### Create Quiz
```http
POST /api/quizzes
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "692e7d8afee4a61a9c9396f0",
  "title": "JavaScript Quiz",
  "questions": [
    {
      "question": "What is a closure?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "A closure is..."
    }
  ]
}
```

**Response (201):**
```json
{
  "_id": "692e7e1cfee4a61a9c9396f2",
  "courseId": "692e7d8afee4a61a9c9396f0",
  "title": "JavaScript Quiz",
  "questions": [...],
  "createdAt": "2024-12-02T11:00:00.000Z"
}
```

---

### Get Quiz by ID
```http
GET /api/quizzes/692e7e1cfee4a61a9c9396f2
```

**Response (200):**
```json
{
  "_id": "692e7e1cfee4a61a9c9396f2",
  "courseId": "692e7d8afee4a61a9c9396f0",
  "title": "JavaScript Quiz",
  "questions": [
    {
      "question": "What is a closure?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "A closure is a function that..."
    }
  ]
}
```

---

### Get Course Quizzes
```http
GET /api/quizzes/course/692e7d8afee4a61a9c9396f0
```

**Response (200):**
```json
[
  {
    "_id": "692e7e1cfee4a61a9c9396f2",
    "courseId": "692e7d8afee4a61a9c9396f0",
    "title": "JavaScript Quiz",
    "questions": [...]
  }
]
```

---

## 📊 Progress Endpoints

### Update Progress
```http
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "692e7d8afee4a61a9c9396f0",
  "completedModuleId": "0-1",
  "quizId": "692e7e1cfee4a61a9c9396f2",
  "quizScore": 85
}
```

**Response (200):**
```json
{
  "_id": "692e7e8efee4a61a9c9396f4",
  "userId": "692e7cb2fee4a61a9c9396ee",
  "courseId": "692e7d8afee4a61a9c9396f0",
  "completedModules": ["0-0", "0-1"],
  "quizScores": [
    {
      "quizId": "692e7e1cfee4a61a9c9396f2",
      "score": 85,
      "completedAt": "2024-12-02T11:30:00.000Z"
    }
  ]
}
```

---

### Get Course Progress
```http
GET /api/progress/692e7d8afee4a61a9c9396f0
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "692e7e8efee4a61a9c9396f4",
  "userId": "692e7cb2fee4a61a9c9396ee",
  "courseId": "692e7d8afee4a61a9c9396f0",
  "completedModules": ["0-0", "0-1", "1-0"],
  "quizScores": [
    {
      "quizId": "692e7e1cfee4a61a9c9396f2",
      "score": 85,
      "completedAt": "2024-12-02T11:30:00.000Z"
    }
  ]
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid credentials"
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

or

```json
{
  "message": "Token is not valid"
}
```

or

```json
{
  "message": "Not authorized"
}
```

### 404 Not Found
```json
{
  "message": "Course not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Detailed error message"
}
```

---

## 🔍 Advanced Query Examples

### Search + Filter + Sort + Paginate
```http
GET /api/courses?search=python&generatedByAI=true&sort=title&page=2&limit=5
Authorization: Bearer <token>
```

### Get Recent AI Courses
```http
GET /api/courses/all?generatedByAI=true&sort=newest&limit=10
```

### Search All Public Courses
```http
GET /api/courses/all?search=machine%20learning&page=1&limit=20
```

---

## 📌 Notes

1. **JWT Token Expiration**: Tokens expire after 1 hour. Users need to login again.
2. **Password Requirements**: Minimum 6 characters (can be enhanced with validation)
3. **Course Ownership**: Only course creators can update/delete their courses
4. **AI Generation**: Requires valid GEMINI_API_KEY in backend environment
5. **Pagination**: Default limit is 10, maximum recommended is 50
6. **CORS**: Configured to allow requests from localhost in development

---

## 🧪 Testing with cURL

### Complete Flow Example:

```bash
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}' \
  | jq -r '.token')

# 2. Create AI Course
COURSE_ID=$(curl -s -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"topic":"Python Programming","useAI":true}' \
  | jq -r '._id')

# 3. Get Course
curl -X GET "http://localhost:3000/api/courses/$COURSE_ID" \
  -H "Authorization: Bearer $TOKEN"

# 4. Get User Courses
curl -X GET "http://localhost:3000/api/courses?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

---

**For more details, see `FEATURES_AND_DEPLOYMENT.md`**
