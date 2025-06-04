import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { profileAPI } from '../utils/api';
import { LogOut, User, Heart, Target, TrendingUp, Settings, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileStatus, setProfileStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Check for success message from profile completion
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  // Load profile status
  useEffect(() => {
    const loadProfileStatus = async () => {
      try {
        const response = await profileAPI.getProfileStatus();
        if (response.success) {
          setProfileStatus(response.data);
        }
      } catch (error) {
        console.error('Error loading profile status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileStatus();
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Heart className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Goals Achieved</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Streak Days</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Today's Plan
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Morning Workout</span>
                  <span className="text-xs text-gray-500">Pending</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Healthy Breakfast</span>
                  <span className="text-xs text-gray-500">Pending</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Water Intake</span>
                  <span className="text-xs text-gray-500">0/8 glasses</span>
                </div>
              </div>
            </div>

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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
