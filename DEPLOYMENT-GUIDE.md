# 🚀 AgFit Deployment Guide

## 📋 **Deployment Overview**

This guide will help you deploy the AgFit platform to production using:
- **Frontend**: Vercel (recommended) or Netlify
- **Backend**: Railway (recommended) or Render
- **Database**: MongoDB Atlas (cloud database)

---

## 🗄️ **Step 1: Database Setup (MongoDB Atlas)**

### **1.1 Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier available)

### **1.2 Configure Database**
1. **Create Database User**:
   - Go to Database Access
   - Add new database user
   - Choose password authentication
   - Save username and password

2. **Configure Network Access**:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add specific IPs for better security

3. **Get Connection String**:
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

---

## 🖥️ **Step 2: Backend Deployment (Railway)**

### **2.1 Prepare Backend for Deployment**
1. **Update package.json** (already configured):
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Environment Variables** (set in Railway dashboard):
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agfit
   JWT_SECRET=your-super-secure-64-character-jwt-secret
   OPENAI_API_KEY=sk-your-openai-api-key
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

### **2.2 Deploy to Railway**
1. **Create Railway Account**:
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**:
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your AgFit repository
   - Choose the `backend` folder as root directory

3. **Configure Environment Variables**:
   - Go to your project → Variables
   - Add all environment variables from above
   - Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

4. **Custom Start Command** (if needed):
   - Go to Settings → Deploy
   - Set start command: `npm start`

---

## 🌐 **Step 3: Frontend Deployment (Vercel)**

### **3.1 Prepare Frontend for Deployment**
1. **Update Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend.railway.app
   VITE_APP_NAME=AgFit
   VITE_APP_VERSION=1.0.0
   ```

2. **Build Configuration** (already configured in vercel.json)

### **3.2 Deploy to Vercel**
1. **Create Vercel Account**:
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**:
   - Click "New Project"
   - Import your AgFit repository
   - Choose the `frontend` folder as root directory
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.railway.app`
   - Add: `VITE_APP_NAME` = `AgFit`
   - Add: `VITE_APP_VERSION` = `1.0.0`

---

## 🔧 **Step 4: Configuration & Testing**

### **4.1 Update CORS Settings**
Update backend CORS configuration with your frontend URL:
```javascript
// In backend/server.js
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};
```

### **4.2 Test Deployment**
1. **Backend Health Check**:
   - Visit: `https://your-backend.railway.app`
   - Should see: "AgFit API Server is running!"

2. **Frontend Application**:
   - Visit: `https://your-frontend.vercel.app`
   - Test registration and login
   - Verify API calls work

3. **Database Connection**:
   - Register a new user
   - Check MongoDB Atlas → Collections
   - Verify data is being saved

---

## 🔒 **Step 5: Security & Performance**

### **5.1 Security Checklist**
- ✅ Environment variables properly set
- ✅ JWT secret is 64+ characters
- ✅ Database user has minimal permissions
- ✅ CORS configured for specific domain
- ✅ HTTPS enabled (automatic on Vercel/Railway)

### **5.2 Performance Optimization**
- ✅ Frontend build optimized (Vite handles this)
- ✅ Backend compression enabled
- ✅ Database indexes created (if needed)
- ✅ CDN enabled (Vercel provides this)

---

## 📊 **Step 6: Monitoring & Maintenance**

### **6.1 Monitoring Setup**
1. **Railway Monitoring**:
   - Check deployment logs
   - Monitor resource usage
   - Set up alerts

2. **Vercel Analytics**:
   - Enable Vercel Analytics
   - Monitor page performance
   - Track user engagement

### **6.2 Backup Strategy**
1. **Database Backups**:
   - MongoDB Atlas provides automatic backups
   - Configure backup retention policy

2. **Code Backups**:
   - GitHub repository serves as code backup
   - Tag releases for version control

---

## 🎯 **Quick Deployment Checklist**

### **Database (MongoDB Atlas)**
- [ ] Cluster created
- [ ] Database user configured
- [ ] Network access configured
- [ ] Connection string obtained

### **Backend (Railway)**
- [ ] Project created and connected to GitHub
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] Health check passing

### **Frontend (Vercel)**
- [ ] Project created and connected to GitHub
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Application accessible

### **Integration Testing**
- [ ] Frontend can reach backend API
- [ ] User registration works
- [ ] User login works
- [ ] Data persists to database
- [ ] All features functional

---

## 🆘 **Troubleshooting**

### **Common Issues**
1. **CORS Errors**: Check FRONTEND_URL in backend environment
2. **Database Connection**: Verify MongoDB URI and network access
3. **Build Failures**: Check environment variables and dependencies
4. **API Errors**: Check backend logs in Railway dashboard

### **Support Resources**
- Railway Documentation: https://docs.railway.app
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com

---

## 🎉 **Deployment Complete!**

Your AgFit platform is now live and ready for users! 🚀

**Next Steps**:
- Set up custom domain (optional)
- Configure analytics and monitoring
- Plan for scaling and updates
- Gather user feedback and iterate
