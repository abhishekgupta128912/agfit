import React from 'react';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import Card from '../ui/Card';
import { CardSkeleton } from '../ui/LoadingSkeleton';

const ProgressChart = ({ progressHistory, isLoading }) => {
  if (isLoading) {
    return <CardSkeleton showTitle showDescription />;
  }

  if (!progressHistory || progressHistory.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progress Overview
        </h3>
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            No progress data yet
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Start tracking your daily activities to see your progress
          </p>
        </div>
      </div>
    );
  }

  // Simple bar chart visualization
  const maxAdherence = Math.max(...progressHistory.map(p => p.metrics?.overallAdherence || 0));
  const chartHeight = 120;

  return (
    <div className="card hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Progress Overview
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Last 7 days</span>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="mb-4">
        <div className="flex items-end justify-between space-x-1" style={{ height: `${chartHeight}px` }}>
          {progressHistory.slice(-7).map((progress, index) => {
            const adherence = progress.metrics?.overallAdherence || 0;
            const height = maxAdherence > 0 ? (adherence / maxAdherence) * chartHeight : 0;
            const date = new Date(progress.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary-600 rounded-t transition-all duration-300 hover:bg-primary-700 relative group"
                  style={{ height: `${height}px`, minHeight: adherence > 0 ? '4px' : '0px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {adherence}% adherence
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600 text-center">
                  {dayName}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Y-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(progressHistory.reduce((sum, p) => sum + (p.metrics?.overallAdherence || 0), 0) / progressHistory.length) || 0}%
          </div>
          <div className="text-xs text-gray-600">Avg Adherence</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {progressHistory.reduce((sum, p) => sum + (p.metrics?.goalsCompleted || 0), 0)}
          </div>
          <div className="text-xs text-gray-600">Goals Hit</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {progressHistory.filter(p => p.metrics?.streakDay).length}
          </div>
          <div className="text-xs text-gray-600">Streak Days</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
