# AI-Powered Health & Wellness Platform

## 🎯 Project Overview
A personalized health and wellness platform that uses AI to provide customized nutrition and fitness recommendations based on user profiles and goals.

## 🏗️ Architecture
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **AI:** OpenAI GPT-4 API
- **Auth:** JWT-based authentication

## 📅 7-Day Development Plan

### Day 1: Project Setup & Planning
- [x] Initialize MERN stack project
- [x] Setup MongoDB connection
- [x] Configure OpenAI API
- [x] Create project structure

### Day 2: Authentication System
- [x] Implement user registration/login
- [x] JWT token management
- [x] Protected routes
- [x] Error handling

### Day 3: User Profile & Health Input
- [x] Health profile form
- [x] Data validation
- [x] Profile storage
- [x] Edit profile functionality

### Day 4: AI Recommendation Engine
- [x] OpenAI API integration
- [x] Prompt engineering for health recommendations
- [x] Store AI responses
- [x] Display personalized plans

### Day 5: Dashboard & Progress Tracking
- [ ] User dashboard
- [ ] Progress tracking system
- [ ] Analytics display
- [ ] Mark activities as complete

### Day 6: UI/UX Polish
- [ ] Responsive design
- [ ] Tailwind CSS styling
- [ ] Component optimization
- [ ] Mobile-first approach

### Day 7: Testing & Deployment
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] Deploy to production
- [ ] Performance optimization

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- OpenAI API key

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Setup environment variables
cp .env.example .env
# Add your MongoDB URI and OpenAI API key

# Start development servers
npm run dev
```

## 📁 Project Structure
```
agfit/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── public/
└── README.md
```

## 🔧 Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 📱 Features
- User authentication and profiles
- AI-powered health recommendations
- Personalized nutrition plans
- Custom workout routines
- Progress tracking
- Responsive design

## 🎯 MVP Goals
- User can register and create health profile
- AI generates personalized diet and fitness plans
- Users can track daily progress
- Clean, responsive UI
- Deployed and accessible online

## 🔮 Future Enhancements
- Payment integration for premium features
- Wearable device integration
- Social features and community
- Advanced analytics
- Mobile app
