# 🚀 AgFit Free Deployment Guide

## 📋 **Free Deployment Strategy**

Since Railway has limitations, we'll use these free alternatives:
- **Frontend**: GitHub Pages (completely free)
- **Backend**: Render (free tier with 750 hours/month)
- **Database**: MongoDB Atlas (free tier - already configured)

---

## 🌐 **Step 1: Deploy Frontend to GitHub Pages**

### **1.1 Enable GitHub Pages**
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Source: **GitHub Actions**
4. Save the configuration

### **1.2 Configure Repository Secrets**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secret:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com` (we'll get this in step 2)

### **1.3 Deploy**
1. Push your code to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Your site will be available at: `https://yourusername.github.io/agfit/`

---

## 🖥️ **Step 2: Deploy Backend to Render**

### **2.1 Create Render Account**
1. Go to https://render.com
2. Sign up with GitHub
3. Connect your GitHub account

### **2.2 Create Web Service**
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `agfit-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### **2.3 Configure Environment Variables**
Add these in Render dashboard:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://guptaa1289:ABHI1289%40agfit@agfit.cn0ofra.mongodb.net/agfit?retryWrites=true&w=majority
JWT_SECRET=agfit_super_secret_jwt_key_for_health_wellness_platform_2024_secure
OPENAI_API_KEY=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
FRONTEND_URL=https://yourusername.github.io
```

### **2.4 Deploy**
1. Click **Create Web Service**
2. Wait for deployment to complete
3. Your backend will be available at: `https://agfit-backend.onrender.com`

---

## 🔧 **Step 3: Update Frontend Configuration**

### **3.1 Update GitHub Secret**
1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Update `VITE_API_URL` with your Render backend URL:
   - Value: `https://agfit-backend.onrender.com/api`

### **3.2 Update Backend CORS**
1. Go to Render dashboard
2. Update `FRONTEND_URL` environment variable:
   - Value: `https://yourusername.github.io`
3. Redeploy the service

---

## ✅ **Step 4: Testing**

### **4.1 Test Backend**
Visit: `https://agfit-backend.onrender.com`
Should see: "AgFit API Server is running!"

### **4.2 Test Frontend**
Visit: `https://yourusername.github.io/agfit/`
- Test user registration
- Test user login
- Verify API calls work

---

## 🎯 **Alternative: Vercel for Both**

If you prefer Vercel for everything:

### **Frontend on Vercel**
1. Go to https://vercel.com
2. Import GitHub repository
3. Set root directory to `frontend`
4. Add environment variables

### **Backend on Vercel (Serverless)**
1. Create new Vercel project
2. Set root directory to `backend`
3. Add `vercel.json` configuration
4. Deploy as serverless functions

---

## 📊 **Free Tier Limitations**

### **GitHub Pages**
- ✅ Unlimited bandwidth
- ✅ Custom domains supported
- ✅ HTTPS included
- ⚠️ Static sites only

### **Render Free Tier**
- ✅ 750 hours/month (enough for most apps)
- ✅ Custom domains
- ✅ HTTPS included
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ Cold start delays

### **MongoDB Atlas Free Tier**
- ✅ 512 MB storage
- ✅ Shared clusters
- ✅ No time limits
- ⚠️ Limited to 3 clusters

---

## 🚀 **Quick Start Commands**

```bash
# 1. Push to GitHub (triggers frontend deployment)
git add .
git commit -m "Deploy to production"
git push origin main

# 2. Check deployment status
# GitHub: Actions tab in your repository
# Render: Dashboard → Services → agfit-backend

# 3. Access your app
# Frontend: https://yourusername.github.io/agfit/
# Backend: https://agfit-backend.onrender.com
```

---

## 🆘 **Troubleshooting**

### **Common Issues**
1. **GitHub Pages not working**: Check Actions tab for build errors
2. **Render deployment fails**: Check build logs in dashboard
3. **CORS errors**: Verify FRONTEND_URL in Render environment
4. **API not connecting**: Check VITE_API_URL in GitHub secrets

### **Support Resources**
- GitHub Pages: https://docs.github.com/en/pages
- Render: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

## 🎉 **Success!**

Your AgFit application will be live at:
- **Frontend**: `https://yourusername.github.io/agfit/`
- **Backend**: `https://agfit-backend.onrender.com`

**Total Cost**: $0/month! 🎊
