import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { profileAPI, progressAPI } from '../../utils/api';
import {
  Target,
  CheckCircle,
  Flame,
  Award,
  TrendingUp,
  Users,
  Brain,
  Star
} from 'lucide-react';

// Import new UI components
import MobileLayout from '../layout/MobileLayout';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { DashboardSkeleton } from '../ui/LoadingSkeleton';
import LoginPromptModal from '../ui/LoginPromptModal';

// Import dashboard components
import StatsCard from './StatsCard';
import DailyCheckin from './DailyCheckin';
import ProgressChart from './ProgressChart';

// Import hooks
import { useLoginPrompt } from '../../hooks/useLoginPrompt';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoginPromptOpen, promptFeature, requireAuth, closeLoginPrompt } = useLoginPrompt();

  // State management
  const [profileStatus, setProfileStatus] = useState(null);
  const [todayProgress, setTodayProgress] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Check for success message from profile completion
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  // Load all dashboard data (only when authenticated)
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Load profile status
        const profileResponse = await profileAPI.getProfileStatus();
        if (profileResponse.success) {
          setProfileStatus(profileResponse.data);
        }

        // Load today's progress
        const todayResponse = await progressAPI.getTodayProgress();
        if (todayResponse.data.success) {
          setTodayProgress(todayResponse.data.data);
        }

        // Load progress history (last 7 days)
        const historyResponse = await progressAPI.getProgressHistory({ days: 7 });
        if (historyResponse.data.success) {
          setProgressHistory(historyResponse.data.data);
        }

        // Load user statistics
        const statsResponse = await progressAPI.getUserStats();
        if (statsResponse.data.success) {
          setUserStats(statsResponse.data.data);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated]);

  // Handle progress updates
  const handleProgressUpdate = async (type, data) => {
    try {
      let response;
      
      switch (type) {
        case 'meal':
          response = await progressAPI.logMeal(data);
          break;
        case 'water':
          response = await progressAPI.logWater(data);
          break;
        case 'exercise':
          response = await progressAPI.completeExercise(data);
          break;
        default:
          response = await progressAPI.updateTodayProgress(data);
      }

      if (response.data.success) {
        setTodayProgress(response.data.data);
        
        // Refresh stats after update
        const statsResponse = await progressAPI.getUserStats();
        if (statsResponse.data.success) {
          setUserStats(statsResponse.data.data);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Show loading skeleton while data is loading (only for authenticated users)
  if (isLoading && isAuthenticated) {
    return (
      <MobileLayout>
        <div className="px-4 py-6 sm:px-0">
          <DashboardSkeleton />
        </div>
      </MobileLayout>
    );
  }

  // Public Dashboard View (when not authenticated)
  if (!isAuthenticated) {
    return (
      <MobileLayout hideBottomNav={true} className="bg-gradient-to-br from-primary-50 via-white to-primary-100">
        {/* Hero Section */}
        <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
            {/* Welcome Hero */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="mx-auto h-20 w-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Welcome to <span className="text-primary-600">AgFit</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Your AI-powered health and wellness companion. Track your progress, get personalized recommendations, and achieve your fitness goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="hover-lift"
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="hover-lift"
                >
                  Sign In
                </Button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card
                className="text-center p-8 hover-lift animate-slide-in-up cursor-pointer"
                style={{ animationDelay: '0.1s' }}
                onClick={() => requireAuth(null, 'daily progress tracking')}
              >
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Tracking</h3>
                <p className="text-gray-600">
                  Log your meals, exercises, and wellness activities with our intuitive interface.
                </p>
              </Card>

              <Card
                className="text-center p-8 hover-lift animate-slide-in-up cursor-pointer"
                style={{ animationDelay: '0.2s' }}
                onClick={() => requireAuth(null, 'AI-powered recommendations')}
              >
                <div className="mx-auto h-16 w-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Recommendations</h3>
                <p className="text-gray-600">
                  Get personalized health and fitness recommendations powered by advanced AI.
                </p>
              </Card>

              <Card
                className="text-center p-8 hover-lift animate-slide-in-up cursor-pointer"
                style={{ animationDelay: '0.3s' }}
                onClick={() => requireAuth(null, 'progress analytics')}
              >
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Analytics</h3>
                <p className="text-gray-600">
                  Visualize your progress with detailed charts and insights to stay motivated.
                </p>
              </Card>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 animate-scale-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Thousands of Users</h2>
                <p className="text-gray-600">Start your health journey with AgFit today</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
                  <div className="text-gray-600">Workouts Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
                  <div className="text-gray-600">User Satisfaction</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Health?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join AgFit today and start your personalized wellness journey
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
                className="hover-lift"
              >
                Start Your Free Journey
              </Button>
            </div>
        </div>

        {/* Login Prompt Modal */}
        <LoginPromptModal
          isOpen={isLoginPromptOpen}
          onClose={closeLoginPrompt}
          feature={promptFeature}
        />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout className="animate-fade-in">
      <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8 animate-slide-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-600">
              Ready to continue your health and wellness journey?
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <Card variant="success" className="mb-6 animate-slide-in-down">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </Card>
          )}

          {/* Profile Status */}
          {!isLoading && profileStatus && (
            <>
              {!profileStatus.isComplete ? (
                <Card variant="warning" className="mb-6 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-yellow-600 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                          Complete Your Health Profile
                        </h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          {profileStatus.exists
                            ? `${profileStatus.completionPercentage}% complete - Get personalized AI recommendations`
                            : 'Get personalized AI recommendations by completing your health profile'
                          }
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => navigate('/profile')}
                    >
                      {profileStatus.exists ? 'Continue Profile' : 'Start Profile'}
                    </Button>
                  </div>
                  {profileStatus.exists && (
                    <div className="mt-3">
                      <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${profileStatus.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              ) : (
                <Card variant="success" className="mb-6 animate-scale-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800">
                          Health Profile Complete
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          {profileStatus.bmi && (
                            <>BMI: {profileStatus.bmi} ({profileStatus.bmiCategory}) • </>
                          )}
                          Ready for AI recommendations
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/profile')}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
            <div className="animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <StatsCard
                title="Current Streak"
                value={userStats?.currentStreak || 0}
                unit="days"
                icon={Flame}
                color="orange"
                isLoading={false}
              />
            </div>

            <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <StatsCard
                title="Today's Adherence"
                value={todayProgress?.metrics?.overallAdherence || 0}
                unit="%"
                icon={Target}
                color="primary"
                isLoading={false}
              />
            </div>

            <div className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
              <StatsCard
                title="Goals Completed"
                value={todayProgress?.metrics?.goalsCompleted || 0}
                unit={`/${todayProgress?.metrics?.totalGoals || 0}`}
                icon={Award}
                color="green"
                isLoading={false}
              />
            </div>

            <div className="animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              <StatsCard
                title="Weekly Average"
                value={Math.round(userStats?.weeklyStats?.avgAdherence || 0)}
                unit="%"
                icon={Target}
                color="blue"
                isLoading={false}
              />
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Daily Check-in */}
            <div className="lg:col-span-2">
              <DailyCheckin
                progress={todayProgress}
                onUpdate={handleProgressUpdate}
                isLoading={isLoading}
              />
            </div>

            {/* AI Recommendations */}
            <Card className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                AI Recommendations
              </h3>
              {profileStatus?.isComplete ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-float">
                    <span className="text-white text-xl">🤖</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Your health profile is complete! Generate personalized AI recommendations.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/recommendations')}
                    className="hover-lift"
                  >
                    Get Started
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm mb-4">
                    Complete your health profile to get personalized AI recommendations
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/profile')}
                    className="hover-lift"
                  >
                    Complete Profile
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Progress Chart */}
          <div className="mt-4 md:mt-6 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <ProgressChart
              progressHistory={progressHistory}
              isLoading={false}
            />
          </div>
      </div>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={isLoginPromptOpen}
        onClose={closeLoginPrompt}
        feature={promptFeature}
      />
    </MobileLayout>
  );
};

export default Dashboard;
