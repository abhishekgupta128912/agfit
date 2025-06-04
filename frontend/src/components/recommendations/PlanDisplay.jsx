import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import NutritionPlan from './NutritionPlan';
import WorkoutPlan from './WorkoutPlan';
import WellnessPlan from './WellnessPlan';

const PlanDisplay = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [generatingType, setGeneratingType] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ai/recommendations');
      setRecommendations(response.data.data.recommendations);
    } catch (error) {
      setError('Failed to fetch recommendations');
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async (type) => {
    try {
      setGeneratingType(type);
      setError('');
      
      const endpoint = type === 'comprehensive' ? '/ai/comprehensive' : `/ai/${type}`;
      const response = await api.post(endpoint);
      
      // Refresh recommendations list
      await fetchRecommendations();
      
      // Show success message
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} plan generated successfully!`);
    } catch (error) {
      setError(error.response?.data?.message || `Failed to generate ${type} plan`);
      console.error(`Error generating ${type} plan:`, error);
    } finally {
      setGeneratingType(null);
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (activeTab === 'all') return true;
    return rec.type === activeTab;
  });

  const renderRecommendation = (recommendation) => {
    switch (recommendation.type) {
      case 'nutrition':
        return <NutritionPlan key={recommendation._id} recommendation={recommendation} />;
      case 'workout':
        return <WorkoutPlan key={recommendation._id} recommendation={recommendation} />;
      case 'wellness':
        return <WellnessPlan key={recommendation._id} recommendation={recommendation} />;
      case 'comprehensive':
        return (
          <div key={recommendation._id} className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Comprehensive Health Plan</h3>
              <p className="text-blue-100">Generated on {new Date(recommendation.createdAt).toLocaleDateString()}</p>
            </div>
            <NutritionPlan recommendation={recommendation} showTitle={false} />
            <WorkoutPlan recommendation={recommendation} showTitle={false} />
            <WellnessPlan recommendation={recommendation} showTitle={false} />
          </div>
        );
      default:
        return (
          <div key={recommendation._id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{recommendation.title}</h3>
            <p className="text-gray-600">{recommendation.content.summary}</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Recommendations</h1>
        <p className="text-gray-600">Personalized plans powered by artificial intelligence</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Generate New Plans */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate New Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => generatePlan('nutrition')}
            disabled={generatingType === 'nutrition'}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {generatingType === 'nutrition' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              '🥗 Nutrition Plan'
            )}
          </button>

          <button
            onClick={() => generatePlan('workout')}
            disabled={generatingType === 'workout'}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {generatingType === 'workout' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              '💪 Workout Plan'
            )}
          </button>

          <button
            onClick={() => generatePlan('wellness')}
            disabled={generatingType === 'wellness'}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {generatingType === 'wellness' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              '🧘 Wellness Plan'
            )}
          </button>

          <button
            onClick={() => generatePlan('comprehensive')}
            disabled={generatingType === 'comprehensive'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-300 disabled:to-purple-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {generatingType === 'comprehensive' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              '🎯 Complete Plan'
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {['all', 'nutrition', 'workout', 'wellness', 'comprehensive'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading recommendations...</span>
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations yet</h3>
          <p className="text-gray-600 mb-6">Generate your first AI-powered health plan to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRecommendations.map(renderRecommendation)}
        </div>
      )}
    </div>
  );
};

export default PlanDisplay;
