# DEPLOYMENT GUIDE - EduAI

Complete step-by-step deployment guide for EduAI on Vercel (frontend) and Render (backend).

---

## 🎯 Prerequisites

Before deployment, ensure you have:
- ✅ MongoDB Atlas database set up
- ✅ Groq API key (free from https://console.groq.com)
- ✅ GitHub account
- ✅ Vercel account (https://vercel.com)
- ✅ Render account (https://render.com)

---

## 📦 PART 1: Backend Deployment on Render

### Step 1: Prepare MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Create a free cluster (if not already)
3. Click "Database Access" → Add new user:
   - Username: `eduai_user`
   - Password: Generate a strong password (save it!)
4. Click "Network Access" → Add IP Address:
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Database" → "Connect" → "Connect your application"
6. Copy the connection string, it looks like:
   ```
   mongodb+srv://eduai_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password
8. Add database name at the end:
   ```
   mongodb+srv://eduai_user:YourPassword@cluster0.xxxxx.mongodb.net/eduai?retryWrites=true&w=majority
   ```

### Step 2: Get Groq API Key

1. Go to https://console.groq.com
2. Sign up/Login
3. Navigate to "API Keys"
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)

### Step 3: Push Code to GitHub

```bash
cd /Users/sanath/Desktop/Eduai
git init
git add .
git commit -m "Initial commit - EduAI project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eduai.git
git push -u origin main
```

### Step 4: Deploy Backend on Render

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `eduai-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Click "Advanced" → Add Environment Variables:
   ```
   DATABASE_URL = mongodb+srv://eduai_user:YourPassword@cluster0.xxxxx.mongodb.net/eduai?retryWrites=true&w=majority
   JWT_SECRET = your_super_secret_random_string_min_32_chars
   GROQ_API_KEY = gsk_your_groq_api_key_here
   NODE_ENV = production
   PORT = 5000
   FRONTEND_URL = https://edu-ai-rho-hazel.vercel.app
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://eduai-zy69.onrender.com`)

### Step 5: Initialize Database

After deployment completes:
1. Go to your Render service dashboard
2. Click "Shell" tab
3. Run:
   ```bash
   npx prisma db push
   ```

---

## 🌐 PART 2: Frontend Deployment on Vercel

### Step 1: Update Frontend Configuration

1. Update `frontend/EduAi/.env`:
   ```env
   VITE_API_URL=https://eduai-zy69.onrender.com/api
   ```
   (Replace with your actual Render URL)

2. Commit changes:
   ```bash
   git add frontend/EduAi/.env
   git commit -m "Update API URL for production"
   git push
   ```

### Step 2: Deploy on Vercel

#### Option A: Using Vercel CLI

```bash
cd frontend/EduAi
npm install -g vercel
vercel login
vercel --prod
```

Follow prompts:
- Setup and deploy: Yes
- Which scope: Your account
- Link to existing project: No
- Project name: eduai-frontend
- Directory: ./
- Build command: npm run build
- Output directory: dist

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/EduAi`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
5. Add Environment Variable:
   ```
   VITE_API_URL = https://eduai-zy69.onrender.com/api
   ```
   (Replace with your actual Render backend URL)

6. Click "Deploy"
7. Wait 2-3 minutes
8. Copy your Vercel URL (e.g., `https://edu-ai-rho-hazel.vercel.app`)

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Go to your backend service → Environment
3. Update `FRONTEND_URL` variable:
   ```
   FRONTEND_URL = https://edu-ai-rho-hazel.vercel.app
   ```
   (Replace with your actual Vercel URL)

4. Click "Save Changes"
5. Render will automatically redeploy

---

## ✅ PART 3: Testing Deployment

### 1. Test Backend

Visit: `https://eduai-zy69.onrender.com/api/courses/all`

You should see:
```json
{
  "courses": [],
  "totalPages": 0,
  "currentPage": 1,
  "totalCourses": 0
}
```

### 2. Test Frontend

1. Visit your Vercel URL: `https://edu-ai-rho-hazel.vercel.app`
2. Click "Sign Up"
3. Create a test account
4. Login
5. Create a new AI-generated course
6. Wait 10-20 seconds for generation
7. Verify course appears on dashboard

---

## 🔧 PART 4: Troubleshooting

### Backend Issues

**Error: "Cannot connect to database"**
- Check MongoDB Atlas connection string
- Ensure IP whitelist includes 0.0.0.0/0
- Verify username/password are correct

**Error: "Groq API error"**
- Verify GROQ_API_KEY is correct
- Check you haven't exceeded free tier limits
- Get a new key from https://console.groq.com

**Backend starts but crashes**
- Check logs in Render dashboard
- Ensure all environment variables are set
- Run `npx prisma db push` in Render shell

### Frontend Issues

**Error: "Network Error" or API calls fail**
- Check VITE_API_URL points to correct backend
- Verify backend is running (visit backend URL)
- Check browser console for CORS errors

**Page shows blank after deployment**
- Ensure `vercel.json` has correct rewrite rules
- Check build logs in Vercel
- Verify all dependencies are in package.json

**Environment variables not working**
- Variables must start with `VITE_` in Vite
- Redeploy after changing environment variables
- Clear browser cache

---

## 🚀 PART 5: Post-Deployment

### Update Backend Environment for Production

In Render, ensure these are set:
```env
NODE_ENV=production
FRONTEND_URL=https://your-vercel-url.vercel.app
```

### Monitor Your Application

1. **Render Dashboard**:
   - Monitor backend logs
   - Check memory/CPU usage
   - View deployment history

2. **Vercel Dashboard**:
   - Monitor frontend deployments
   - Check analytics
   - View function logs

### Enable Auto-Deploy

Both Render and Vercel auto-deploy on git push by default:
- Push to `main` branch
- Wait 2-5 minutes
- Changes go live automatically

---

## 📊 PART 6: Database Management

### View Data with Prisma Studio

Locally:
```bash
cd backend
npx prisma studio
```

Opens at http://localhost:5555

### Backup Database

MongoDB Atlas:
1. Go to Clusters
2. Click "..." → "Backup"
3. Configure backup schedule

### Reset Database (⚠️ Deletes all data)

```bash
cd backend
npx prisma db push --force-reset
```

---

## 🔐 PART 7: Security Checklist

- ✅ JWT_SECRET is a strong random string (min 32 characters)
- ✅ MongoDB user has strong password
- ✅ Environment variables are not committed to Git
- ✅ CORS is configured correctly
- ✅ API keys are kept secret

---

## 📝 Environment Variables Quick Reference

### Backend (Render)
```env
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/eduai
JWT_SECRET=random_secret_min_32_chars
GROQ_API_KEY=gsk_your_key_here
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-vercel-url.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-render-url.onrender.com/api
```

---

## 🎉 Success!

Your EduAI application should now be live at:
- **Frontend**: https://edu-ai-rho-hazel.vercel.app
- **Backend**: https://eduai-zy69.onrender.com

Test all features:
1. Sign up / Login
2. Create AI course
3. Take quiz
4. View dashboard
5. Update profile

---

## 📞 Need Help?

Common deployment issues and solutions are in the Troubleshooting section above.

For MongoDB issues: https://www.mongodb.com/docs/atlas/
For Render issues: https://render.com/docs
For Vercel issues: https://vercel.com/docs
