import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { profileAPI, progressAPI } from '../../utils/api';
import {
  Target,
  CheckCircle,
  Flame,
  Award
} from 'lucide-react';

// Import new UI components
import Navbar from '../layout/Navbar';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { DashboardSkeleton } from '../ui/LoadingSkeleton';

// Import dashboard components
import StatsCard from './StatsCard';
import DailyCheckin from './DailyCheckin';
import ProgressChart from './ProgressChart';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Load all dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Load profile status
        const profileResponse = await profileAPI.getProfileStatus();
        if (profileResponse.success) {
          setProfileStatus(profileResponse.data);
        }

        // Load today's progress
        const todayResponse = await progressAPI.getTodayProgress();
        if (todayResponse.success) {
          setTodayProgress(todayResponse.data);
        }

        // Load progress history (last 7 days)
        const historyResponse = await progressAPI.getProgressHistory({ days: 7 });
        if (historyResponse.success) {
          setProgressHistory(historyResponse.data);
        }

        // Load user statistics
        const statsResponse = await progressAPI.getUserStats();
        if (statsResponse.success) {
          setUserStats(statsResponse.data);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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

  // Show loading skeleton while data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <DashboardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="mt-6 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <ProgressChart
              progressHistory={progressHistory}
              isLoading={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
