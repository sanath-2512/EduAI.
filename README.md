# EduAI - AI-Powered Learning Platform

A full-stack web application that uses AI to generate personalized courses and quizzes.

## Features

- 🤖 **AI Course Generation**: Create complete course outlines with modules and lessons using Google Gemini AI
- 📝 **AI Quiz Generator**: Automatically generate quizzes based on course topics
- 📊 **Progress Tracking**: Track completed modules and quiz scores
- 🔐 **Secure Authentication**: JWT-based user authentication
- 🎨 **Modern UI**: Clean, responsive design with smooth animations

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios (with JWT interceptor)
- Framer Motion (animations)
- Lucide React (icons)
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Google Gemini AI API
- bcryptjs

## Project Structure

```
EduAI/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── quizController.js
│   │   └── progressController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Quiz.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── quizRoutes.js
│   │   └── progressRoutes.js
│   ├── utils/
│   │   └── ai.js
│   ├── .env
│   ├── index.js
│   └── package.json
└── frontend/EduAi/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateCourse.jsx
    │   │   ├── CourseDetails.jsx
    │   │   ├── TakeQuiz.jsx
    │   │   └── Profile.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── vercel.json
    └── package.json
```

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API Key

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend/EduAi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Courses
- `POST /api/courses` - Create course (protected)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `DELETE /api/courses/:id` - Delete course (protected)

### Quizzes
- `POST /api/quizzes` - Create quiz (protected)
- `GET /api/quizzes/course/:courseId` - Get quizzes by course
- `GET /api/quizzes/:id` - Get quiz by ID

### Progress
- `POST /api/progress` - Update progress (protected)
- `GET /api/progress/:courseId` - Get progress by course (protected)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Backend: Render/Railway
- Frontend: Vercel

## Environment Variables

### Backend
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - Google Gemini API key
- `PORT` - Server port (default: 5000)

### Frontend
- `VITE_API_URL` - Backend API URL

## AI Integration

The application uses Google Gemini AI to:
1. Generate course outlines with structured modules and lessons
2. Create quiz questions with multiple choice options
3. Provide intelligent content based on user-specified topics

## License

MIT

## Author

Built with ❤️ using React and Node.js
