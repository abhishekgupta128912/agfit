# 🚀 Quick Start Guide - AgFit Platform

## ⚡ **Immediate Setup (5 minutes)**

### **1. Environment Setup**
```bash
# Backend setup
cd backend
cp .env.example .env
# Edit .env with your credentials:
# - MongoDB URI from MongoDB Atlas
# - OpenAI API key
# - JWT secret (any random string)

# Frontend setup  
cd ../frontend
# No additional env needed for now
```

### **2. Install Dependencies & Start**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Server will start on http://localhost:5000

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
# App will start on http://localhost:3000
```

### **3. Verify Setup**
- Backend: Visit http://localhost:5000 - should show "AgFit API Server is running!"
- Frontend: Visit http://localhost:3000 - should show React app

## 📋 **Required API Keys**

### **MongoDB Atlas (Free)**
1. Go to https://cloud.mongodb.com
2. Create free account
3. Create new cluster
4. Get connection string
5. Add to backend/.env as MONGODB_URI

### **OpenAI API Key**
1. Go to https://platform.openai.com
2. Create account / login
3. Go to API Keys section
4. Create new API key
5. Add to backend/.env as OPENAI_API_KEY

## 🎯 **Day 1 Status: COMPLETED ✅**

### **What's Working:**
- ✅ MERN stack project structure
- ✅ Backend server with Express.js
- ✅ Frontend with React + Vite + Tailwind
- ✅ MongoDB connection ready
- ✅ Environment configuration
- ✅ Basic API health check

### **What's Next (Day 2):**
- 🔄 User authentication system
- 🔄 JWT token management
- 🔄 Login/Register UI components
- 🔄 Protected routes

## 📁 **Current Project Structure**
```
agfit/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── README.md
├── 7-DAY-PLAN.md
└── QUICK-START.md
```

## 🔧 **Development Commands**

### **Backend:**
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
```

### **Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🐛 **Common Issues & Solutions**

### **Backend won't start:**
- Check if MongoDB URI is correct in .env
- Ensure port 5000 is not in use
- Verify all dependencies installed

### **Frontend styling issues:**
- Ensure Tailwind CSS is properly configured
- Check if PostCSS config is correct
- Restart dev server after config changes

### **API connection issues:**
- Verify backend is running on port 5000
- Check CORS configuration
- Ensure frontend is making requests to correct URL

## 📞 **Support**
If you encounter issues:
1. Check the error messages in terminal
2. Verify environment variables are set
3. Ensure all dependencies are installed
4. Restart both servers

## 🎯 **Success Metrics for Day 1**
- [x] Both servers start without errors
- [x] Can access backend health check endpoint
- [x] Frontend loads with Tailwind styling
- [x] No console errors in browser
- [x] Project structure is organized

**Ready for Day 2? Let's build the authentication system! 🚀**
