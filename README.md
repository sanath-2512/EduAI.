# EduAI - AI-Powered Learning Assistant

Full-stack AI-powered learning platform with course generation, interactive quizzes, and progress tracking.

## 🚀 Live Demo

- **Frontend**: https://edu-ai-rho-hazel.vercel.app/
- **Backend**: https://eduai-zy69.onrender.com

## 🏗️ Technology Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Vanilla CSS (custom utility classes)
- Axios for API calls
- Context API for state management

### Backend
- Node.js + Express.js
- Prisma ORM with MongoDB
- JWT Authentication
- Groq AI for course & quiz generation
- RESTful API architecture

### Database
- MongoDB Atlas with Prisma Client

---

## 📦 Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Groq API key (free at https://console.groq.com)

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection String
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/eduai?retryWrites=true&w=majority"

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Groq API Key (get from https://console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**How to get your MongoDB connection string:**
1. Go to https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

**How to get Groq API key:**
1. Go to https://console.groq.com
2. Sign up for free
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env`

### 4. Initialize Prisma & Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to MongoDB (creates collections)
npx prisma db push
```

### 5. Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend should now be running on `http://localhost:5000`

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend/EduAi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `frontend/EduAi` directory:

```env
# For local development
VITE_API_URL=http://localhost:5000/api

# For production (use deployed backend URL)
# VITE_API_URL=https://eduai-zy69.onrender.com/api
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

Frontend should now be running on `http://localhost:5173`

---

## 🎯 Testing the Application

### 1. Create an Account
- Go to http://localhost:5173
- Click "Sign Up"
- Create a new account with username, email, and password

### 2. Generate AI Course
- Click "Create Course"
- Enter a topic (e.g., "React Hooks", "Machine Learning", "Data Structures")
- Check "Use AI to generate course content"
- Click "Create Course"
- Wait 10-20 seconds for AI to generate comprehensive course

### 3. Take Quiz
- Open the generated course
- Navigate to the quiz section
- Take the AI-generated quiz

### 4. Track Progress
- View your progress on the dashboard
- See course completion and quiz scores

---

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the `backend` directory
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

3. **Add Environment Variables** in Render dashboard:
   ```
   DATABASE_URL=mongodb+srv://...
   JWT_SECRET=your_secret_key
   GROQ_API_KEY=your_groq_key
   NODE_ENV=production
   FRONTEND_URL=https://edu-ai-rho-hazel.vercel.app
   ```

4. **Deploy** - Render will automatically deploy your backend

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   cd frontend/EduAi
   vercel --prod
   ```

3. **Or use Vercel Dashboard**:
   - Go to https://vercel.com
   - Import your repository
   - Select `frontend/EduAi` as root directory
   - Add environment variable:
     ```
     VITE_API_URL=https://eduai-zy69.onrender.com/api
     ```
   - Deploy

4. **Vercel Configuration** (already included in `vercel.json`):
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Courses
- `POST /api/courses` - Create course (with AI generation)
- `GET /api/courses` - Get user's courses
- `GET /api/courses/all` - Get all public courses
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Quizzes
- `POST /api/quizzes` - Create quiz (with AI generation)
- `GET /api/quizzes` - Get all user's quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `DELETE /api/quizzes/:id` - Delete quiz

### Progress
- `POST /api/progress` - Update progress
- `GET /api/progress` - Get user progress
- `GET /api/progress/stats` - Get user statistics

---

## 🗂️ Project Structure

```
EduAI/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── quizController.js
│   │   └── progressController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── quizRoutes.js
│   │   └── progressRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── utils/
│   │   └── ai.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── frontend/EduAi/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateCourse.jsx
    │   │   ├── CourseDetails.jsx
    │   │   ├── TakeQuiz.jsx
    │   │   ├── Profile.jsx
    │   │   └── Settings.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vercel.json
    └── .env
```

---

## 🔧 Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Format schema file
npx prisma format

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "Cannot connect to MongoDB"**
- Check your `DATABASE_URL` in `.env`
- Ensure MongoDB Atlas allows connections from your IP
- Verify username/password are correct

**Error: "Prisma Client not generated"**
- Run `npx prisma generate`
- Restart your backend server

**Error: "Groq API key invalid"**
- Get a new API key from https://console.groq.com
- Update `GROQ_API_KEY` in `.env`

### Frontend Issues

**Error: "Network Error" or "Cannot connect to backend"**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend

**Error: "Page not found" after refresh**
- Ensure `vercel.json` includes rewrites configuration
- For local dev, this is handled by Vite automatically

---

## 📝 Environment Variables Summary

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key_here` |
| `GROQ_API_KEY` | Groq API key | `gsk_...` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 🎓 Features

✅ User Authentication (Register/Login with JWT)  
✅ AI-Powered Course Generation (using Groq)  
✅ AI-Powered Quiz Generation  
✅ Course Management (Create, Read, Update, Delete)  
✅ Interactive Quizzes with Explanations  
✅ Progress Tracking  
✅ User Dashboard with Statistics  
✅ Responsive Design  
✅ Search & Filter Courses  
✅ User Profile Management  

---

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

## 📄 License

MIT License - feel free to use this project for learning or production!

---

## 🙏 Credits

- Built with React, Express, Prisma, and MongoDB
- AI powered by Groq (LLaMA 3.3 70B Versatile)
- Deployed on Vercel (frontend) and Render (backend)
