import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { profileAPI, progressAPI } from '../../utils/api';
import { 
  LogOut, 
  User, 
  Heart, 
  Target, 
  TrendingUp, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Flame,
  Calendar,
  Award
} from 'lucide-react';

// Import new dashboard components
import StatsCard from './StatsCard';
import DailyCheckin from './DailyCheckin';
import ProgressChart from './ProgressChart';

const Dashboard = () => {
  const { user, logout } = useAuth();
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

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">AgFit</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-600">
              Ready to continue your health and wellness journey?
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Profile Status */}
          {!isLoading && profileStatus && (
            <>
              {!profileStatus.isComplete ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
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
                    <button
                      onClick={() => navigate('/profile')}
                      className="btn-primary text-sm"
                    >
                      {profileStatus.exists ? 'Continue Profile' : 'Start Profile'}
                    </button>
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
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
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
                    <button
                      onClick={() => navigate('/profile')}
                      className="btn-secondary text-sm flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Current Streak"
              value={userStats?.currentStreak || 0}
              unit="days"
              icon={Flame}
              color="orange"
              isLoading={isLoading}
            />
            
            <StatsCard
              title="Today's Adherence"
              value={todayProgress?.metrics?.overallAdherence || 0}
              unit="%"
              icon={Target}
              color="primary"
              isLoading={isLoading}
            />
            
            <StatsCard
              title="Goals Completed"
              value={todayProgress?.metrics?.goalsCompleted || 0}
              unit={`/${todayProgress?.metrics?.totalGoals || 0}`}
              icon={Award}
              color="green"
              isLoading={isLoading}
            />
            
            <StatsCard
              title="Weekly Average"
              value={Math.round(userStats?.weeklyStats?.avgAdherence || 0)}
              unit="%"
              icon={TrendingUp}
              color="blue"
              isLoading={isLoading}
            />
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
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                AI Recommendations
              </h3>
              {!isLoading && profileStatus?.isComplete ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-xl">🤖</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Your health profile is complete! Generate personalized AI recommendations.
                  </p>
                  <button
                    onClick={() => navigate('/recommendations')}
                    className="btn-primary mt-4"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm mb-4">
                    Complete your health profile to get personalized AI recommendations
                  </p>
                  <button
                    onClick={() => navigate('/profile')}
                    className="btn-primary mt-4"
                  >
                    Complete Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="mt-6">
            <ProgressChart
              progressHistory={progressHistory}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
