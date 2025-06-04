# 🚀 AgFit Deployment Checklist

## ✅ Pre-Deployment Checklist

### Code Preparation
- [x] Demo version removed from AI service
- [x] Environment variables configured for production
- [x] Frontend API URL uses environment variable
- [x] All dependencies installed and working
- [x] Build scripts configured correctly

### Database Setup
- [x] MongoDB Atlas cluster created
- [x] Database user configured
- [x] Network access configured (0.0.0.0/0)
- [x] Connection string working

## 🖥️ Backend Deployment (Railway)

### Step 1: Create Railway Project
1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your AgFit repository
6. Select `backend` folder as root directory

### Step 2: Configure Environment Variables
Add these in Railway dashboard → Variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://guptaa1289:ABHI1289%40agfit@agfit.cn0ofra.mongodb.net/agfit?retryWrites=true&w=majority
JWT_SECRET=agfit_super_secret_jwt_key_for_health_wellness_platform_2024_secure
OPENAI_API_KEY=your-openai-api-key-here
FRONTEND_URL=https://your-frontend.vercel.app
```

### Step 3: Deploy and Test
- [ ] Deployment successful
- [ ] Backend URL accessible
- [ ] Health check endpoint working
- [ ] Database connection working

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Project
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your AgFit repository
5. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 2: Configure Environment Variables
Add these in Vercel dashboard → Environment Variables:

```
VITE_API_URL=https://your-backend.railway.app
VITE_APP_NAME=AgFit
VITE_APP_VERSION=1.0.0
```

### Step 3: Deploy and Test
- [ ] Build successful
- [ ] Frontend URL accessible
- [ ] API calls working
- [ ] All features functional

## 🔧 Post-Deployment Configuration

### Update CORS Settings
1. Get your Vercel frontend URL
2. Update FRONTEND_URL in Railway backend environment
3. Redeploy backend if needed

### Final Testing
- [ ] User registration works
- [ ] User login works
- [ ] Profile creation works
- [ ] AI recommendations work (if OpenAI quota available)
- [ ] Progress tracking works
- [ ] All pages load correctly
- [ ] Mobile responsiveness works

## 🎯 Deployment URLs

### Backend (Railway)
- URL: `https://your-backend.railway.app`
- Health Check: `https://your-backend.railway.app/api/ai/health`

### Frontend (Vercel)
- URL: `https://your-frontend.vercel.app`
- Dashboard: `https://your-frontend.vercel.app/dashboard`

## 🆘 Troubleshooting

### Common Issues
1. **CORS Errors**: Update FRONTEND_URL in backend environment
2. **Build Failures**: Check environment variables and dependencies
3. **API Connection**: Verify VITE_API_URL in frontend environment
4. **Database Issues**: Check MongoDB Atlas network access and credentials

### Support Resources
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

## 🎉 Success!

Once all checkboxes are completed, your AgFit application will be live and ready for users!

**Next Steps:**
- Set up custom domain (optional)
- Configure monitoring and analytics
- Plan for user feedback and iterations
- Scale as needed
