import React, { useState } from 'react';
import api from '../../utils/api';

const WellnessPlan = ({ recommendation, showTitle = true }) => {
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

  const renderWellnessSection = (title, items, icon, bgColor, textColor) => {
    if (!items || items.length === 0) return null;

    return (
      <div className={`${bgColor} p-4 rounded-lg`}>
        <h4 className={`font-semibold ${textColor} mb-3`}>{icon} {title}</h4>
        <ul className={`${textColor} space-y-2`}>
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className={`w-2 h-2 ${textColor.replace('text-', 'bg-').replace('-800', '-400')} rounded-full mr-3 mt-2 flex-shrink-0`}></span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
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
        {/* Sleep Recommendations */}
        {renderWellnessSection(
          'Sleep Optimization',
          data.sleepRecommendations,
          '😴',
          'bg-indigo-50',
          'text-indigo-800'
        )}

        {/* Stress Management */}
        {renderWellnessSection(
          'Stress Management',
          data.stressManagement,
          '🧘‍♀️',
          'bg-green-50',
          'text-green-800'
        )}

        {/* Mental Health */}
        {renderWellnessSection(
          'Mental Health',
          data.mentalHealth,
          '🧠',
          'bg-blue-50',
          'text-blue-800'
        )}

        {/* Mindfulness */}
        {renderWellnessSection(
          'Mindfulness Practices',
          data.mindfulness,
          '🕯️',
          'bg-purple-50',
          'text-purple-800'
        )}

        {/* Social Wellness */}
        {renderWellnessSection(
          'Social Wellness',
          data.socialWellness,
          '👥',
          'bg-pink-50',
          'text-pink-800'
        )}

        {/* Habit Formation */}
        {renderWellnessSection(
          'Habit Formation',
          data.habitFormation,
          '🎯',
          'bg-yellow-50',
          'text-yellow-800'
        )}

        {/* Work-Life Balance */}
        {data.workLifeBalance && data.workLifeBalance.length > 0 && renderWellnessSection(
          'Work-Life Balance',
          data.workLifeBalance,
          '⚖️',
          'bg-teal-50',
          'text-teal-800'
        )}

        {/* Daily Practices */}
        {data.dailyPractices && data.dailyPractices.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-3">📅 Daily Wellness Practices</h4>
            <div className="grid gap-3">
              {data.dailyPractices.map((practice, index) => (
                <div key={index} className="bg-white p-3 rounded border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-purple-700">{practice.time || 'Anytime'}</span>
                    <span className="text-sm text-purple-600">{practice.duration || '5-10 min'}</span>
                  </div>
                  <p className="text-purple-800 mt-1">{practice.activity}</p>
                  {practice.benefits && (
                    <p className="text-sm text-purple-600 mt-1 italic">Benefits: {practice.benefits}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Goals */}
        {data.weeklyGoals && data.weeklyGoals.length > 0 && (
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-3">🎯 Weekly Wellness Goals</h4>
            <div className="space-y-2">
              {data.weeklyGoals.map((goal, index) => (
                <div key={index} className="flex items-center">
                  <input type="checkbox" className="mr-3 h-4 w-4 text-orange-600" />
                  <span className="text-orange-700">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      {showTitle && (
        <div className="bg-purple-500 text-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1">🧘 Wellness Plan</h3>
              <p className="text-purple-100 text-sm">
                Generated on {new Date(recommendation.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-purple-100 text-sm">
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
          className="text-purple-600 hover:text-purple-700 font-medium mb-4 flex items-center"
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
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                placeholder="Share your thoughts about this wellness plan..."
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

export default WellnessPlan;
