# 🚀 BEFORE YOU START - Critical Setup Steps

## ⚠️ IMPORTANT: Required Before Running

Your EduAI project is **100% code complete**, but you need to configure **3 essential credentials** before it can run.

---

## 📝 Step-by-Step Setup (5 minutes)

### 1️⃣ Get MongoDB Database (FREE)

**What**: Cloud database for storing users, courses, quizzes, and progress

**How to get it:**

1. Go to: **https://cloud.mongodb.com**
2. Click "Try Free" → Sign up with Google/Email
3. Choose **FREE tier** (M0 Sandbox - 512MB)
4. Select cloud provider (AWS/Google/Azure - any is fine)
5. Select region closest to you
6. Click "Create Cluster" (takes 3-5 minutes)

Once created:
7. Click "Database Access" (left sidebar)
8. Click "Add New Database User"
   - Username: `eduai_user`
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Built-in Role: Read and write to any database
   - Click "Add User"

9. Click "Network Access" (left sidebar)
10. Click "Add IP Address"
    - Click "Allow Access from Anywhere"
    - Confirm (0.0.0.0/0)
    - Click "Confirm"

11. Click "Database" → "Connect" → "Connect your application"
12. Copy the connection string (looks like):
    ```
    mongodb+srv://eduai_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```

13. **IMPORTANT**: Replace `<password>` with the password you saved
14. **IMPORTANT**: Add `/eduai` before the `?`:
    ```
    mongodb+srv://eduai_user:YourPassword@cluster0.xxxxx.mongodb.net/eduai?retryWrites=true&w=majority
    ```

✅ **Save this complete connection string!**

---

### 2️⃣ Get Groq API Key (FREE - No Credit Card)

**What**: AI engine that generates course content and quizzes

**How to get it:**

1. Go to: **https://console.groq.com**
2. Sign up with Google/Email (100% FREE, no credit card needed)
3. Click "API Keys" in left sidebar
4. Click "Create API Key"
5. Give it a name: `EduAI`
6. Click "Submit"
7. **COPY THE KEY** (starts with `gsk_`)
   - ⚠️ You can only see it once!
   - If you lose it, create a new one

✅ **Save this API key!**

---

### 3️⃣ Generate JWT Secret

**What**: Secret key for securing user authentication

**How to generate:**

**Option A: Online Generator (easiest)**
1. Go to: **https://randomkeygen.com/**
2. Copy any "CodeIgniter Encryption Keys" (256-bit key)
3. Example: `7f4d8c9e2a1b5f3d6e8c0a2b4d6e8f0a1c3e5d7f9b1d3f5a7c`

**Option B: In Terminal**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

✅ **Save this secret key!**

---

## 🔧 Configure Your Project

### Update Backend Environment

Open: `/Users/sanath/Desktop/Eduai/backend/.env`

Replace with your credentials:

```env
# Database (from Step 1)
DATABASE_URL="mongodb+srv://eduai_user:YourPassword@cluster0.xxxxx.mongodb.net/eduai?retryWrites=true&w=majority"

# JWT Secret (from Step 3)
JWT_SECRET=7f4d8c9e2a1b5f3d6e8c0a2b4d6e8f0a1c3e5d7f9b1d3f5a7c

# Groq API (from Step 2)
GROQ_API_KEY=gsk_your_actual_api_key_here

# Server Config (keep as is)
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Save the file!**

---

## ✅ You're Ready! Start the App

### Terminal 1 - Backend
```bash
cd /Users/sanath/Desktop/Eduai/backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

✅ Should see:
```
🚀 Server running on port 3000
📦 Environment: development
✅ Prisma connected to MongoDB
```

### Terminal 2 - Frontend
```bash
cd /Users/sanath/Desktop/Eduai/frontend/EduAi
npm install
npm run dev
```

✅ Should see:
```
  VITE v5.x ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### Open Browser
Go to: **http://localhost:5173**

---

## 🎯 First-Time Usage

1. Click **"Sign Up"**
2. Create account:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `test123`

3. Click **"Create Course"**
4. Enter topic: `React Hooks`
5. Check ✅ **"Use AI to generate course content"**
6. Click **"Create Course"**
7. Wait 10-20 seconds for AI generation
8. **Enjoy your AI-generated course!** 🎉

---

## ❓ Troubleshooting

### "Cannot connect to MongoDB"
- ✅ Check DATABASE_URL has your password (not `<password>`)
- ✅ Check you added `/eduai` before the `?`
- ✅ Check MongoDB Atlas allows access from anywhere (0.0.0.0/0)

### "Groq API error"
- ✅ Check GROQ_API_KEY is correct
- ✅ Ensure you copied the full key (starts with `gsk_`)
- ✅ Try creating a new API key

### "Port 3000 already in use"
- ✅ Kill existing process: `lsof -ti:3000 | xargs kill -9`
- ✅ Or change PORT in `.env` to `5000`

### "Prisma Client not generated"
- ✅ Run: `cd backend && npx prisma generate`
- ✅ Restart backend server

---

## 📞 Need Help?

All credentials are:
- ✅ **100% FREE**
- ✅ **No credit card required**
- ✅ **No limits for learning**

Links:
- MongoDB: https://cloud.mongodb.com
- Groq API: https://console.groq.com
- Random Key Generator: https://randomkeygen.com

---

## 🎉 That's It!

Once you have those **3 credentials** in `backend/.env`:
1. MongoDB connection string
2. Groq API key  
3. JWT secret

You're ready to run the complete EduAI platform! 🚀
