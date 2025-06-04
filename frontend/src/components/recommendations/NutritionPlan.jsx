import React, { useState } from 'react';
import api from '../../utils/api';

const NutritionPlan = ({ recommendation, showTitle = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedback, setFeedback] = useState({
    rating: 0,
    helpful: null,
    comments: ''
  });
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeedback = async () => {
    try {
      await api.post(`/ai/recommendations/${recommendation._id}/feedback`, feedback);
      alert('Feedback submitted successfully!');
      setShowFeedback(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  const markAsFollowed = async () => {
    try {
      await api.put(`/ai/recommendations/${recommendation._id}/follow`);
      alert('Plan marked as followed!');
    } catch (error) {
      console.error('Error marking as followed:', error);
      alert('Failed to update plan status');
    }
  };

  const renderStructuredContent = () => {
    if (!recommendation.content.structured || !recommendation.content.parsedData) {
      return (
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
            {recommendation.content.rawContent}
          </pre>
        </div>
      );
    }

    const data = recommendation.content.parsedData;
    
    return (
      <div className="space-y-6">
        {/* Daily Calories */}
        {data.dailyCalories && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Daily Calorie Target</h4>
            <p className="text-2xl font-bold text-green-600">{data.dailyCalories} calories</p>
          </div>
        )}

        {/* Macronutrients */}
        {data.macros && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">Macronutrient Breakdown</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{data.macros.protein}g</p>
                <p className="text-sm text-blue-700">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{data.macros.carbs}g</p>
                <p className="text-sm text-blue-700">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">{data.macros.fats}g</p>
                <p className="text-sm text-blue-700">Fats</p>
              </div>
            </div>
          </div>
        )}

        {/* Meal Plan */}
        {data.meals && data.meals.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Daily Meal Plan</h4>
            <div className="space-y-3">
              {data.meals.map((meal, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">{meal.name}</h5>
                    <div className="text-right">
                      {meal.time && <p className="text-sm text-gray-500">{meal.time}</p>}
                      {meal.calories && <p className="text-sm font-medium text-green-600">{meal.calories} cal</p>}
                    </div>
                  </div>
                  {meal.foods && meal.foods.length > 0 && (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {meal.foods.map((food, foodIndex) => (
                        <li key={foodIndex} className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          {food}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hydration */}
        {data.hydration && (
          <div className="bg-cyan-50 p-4 rounded-lg">
            <h4 className="font-semibold text-cyan-800 mb-2">💧 Hydration</h4>
            <p className="text-cyan-700">{data.hydration}</p>
          </div>
        )}

        {/* Supplements */}
        {data.supplements && data.supplements.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">💊 Supplements</h4>
            <ul className="text-yellow-700 space-y-1">
              {data.supplements.map((supplement, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                  {supplement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Notes */}
        {data.safetyNotes && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">⚠️ Important Notes</h4>
            <p className="text-red-700 text-sm">{data.safetyNotes}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      {showTitle && (
        <div className="bg-green-500 text-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1">🥗 Nutrition Plan</h3>
              <p className="text-green-100 text-sm">
                Generated on {new Date(recommendation.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm">
                {recommendation.daysUntilExpiry > 0 
                  ? `Expires in ${recommendation.daysUntilExpiry} days`
                  : 'Expired'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Summary */}
        <div className="mb-4">
          <p className="text-gray-600">{recommendation.content.summary}</p>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-600 hover:text-green-700 font-medium mb-4 flex items-center"
        >
          {isExpanded ? '▼' : '▶'} {isExpanded ? 'Hide Details' : 'Show Full Plan'}
        </button>

        {/* Detailed Content */}
        {isExpanded && (
          <div className="border-t pt-4">
            {renderStructuredContent()}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
          <button
            onClick={markAsFollowed}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ✓ Mark as Followed
          </button>
          
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            💬 Give Feedback
          </button>
        </div>

        {/* Feedback Form */}
        {showFeedback && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Share Your Feedback</h4>
            
            {/* Rating */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedback({...feedback, rating: star})}
                    className={`text-2xl ${
                      star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Helpful */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Was this helpful?</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setFeedback({...feedback, helpful: true})}
                  className={`px-3 py-1 rounded text-sm ${
                    feedback.helpful === true ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => setFeedback({...feedback, helpful: false})}
                  className={`px-3 py-1 rounded text-sm ${
                    feedback.helpful === false ? 'bg-red-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  👎 No
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments (optional)</label>
              <textarea
                value={feedback.comments}
                onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="3"
                placeholder="Share your thoughts about this nutrition plan..."
              />
            </div>

            {/* Submit */}
            <div className="flex space-x-2">
              <button
                onClick={handleFeedback}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowFeedback(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPlan;
