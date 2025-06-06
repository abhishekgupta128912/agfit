# AgFit - AI-Powered Health & Wellness Platform

A comprehensive health and wellness platform that leverages artificial intelligence to provide personalized fitness recommendations, nutrition planning, and progress tracking.

## Features

- **User Authentication** - Secure registration and login system
- **Health Profile Management** - Comprehensive health assessment
- **AI-Powered Recommendations** - Personalized nutrition, workout, and wellness plans
- **Progress Tracking** - Daily logging of meals, exercises, and wellness activities
- **Analytics Dashboard** - Visual progress tracking with charts and statistics
- **Mobile-Optimized** - Responsive design for all devices

## Technology Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- Axios for API communication
- Lucide React for icons

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- OpenAI API integration

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/agfit.git
   cd agfit
   ```

2. Install dependencies
   ```bash
   npm run install:all
   ```

3. Set up environment variables

   **Backend** (`backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secure-jwt-secret
   OPENAI_API_KEY=your-openai-api-key
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=AgFit
   VITE_APP_VERSION=1.0.0
   ```

4. Start development servers
   ```bash
   npm run dev
   ```

5. Open your browser
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Project Structure

```
agfit/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── services/          # Business logic services
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── package.json           # Root package configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Health Profile
- `GET /api/profile` - Get user profile
- `POST /api/profile` - Create/update profile
- `GET /api/profile/status` - Get profile completion status

### AI Recommendations
- `POST /api/ai/nutrition` - Generate nutrition plan
- `POST /api/ai/workout` - Generate workout plan
- `POST /api/ai/wellness` - Generate wellness plan
- `GET /api/ai/recommendations` - Get user recommendations

### Progress Tracking
- `GET /api/progress/today` - Get today's progress
- `POST /api/progress/meal` - Log a meal
- `POST /api/progress/water` - Log water intake
- `POST /api/progress/exercise` - Log an exercise
- `GET /api/progress/history` - Get progress history

## Deployment

### Backend (Render)
The backend is configured for deployment on Render. See `render.yaml` for configuration.

### Frontend (GitHub Pages)
The frontend automatically deploys to GitHub Pages via GitHub Actions.

### Quick Deploy
```bash
npm run deploy
```

## Testing

```bash
# Run all tests
npm test

# Test deployment readiness
npm run test:deployment
```

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
