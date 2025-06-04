import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  unit = '', 
  icon: Icon, 
  trend = null, 
  trendValue = null,
  color = 'primary',
  isLoading = false 
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-100',
      icon: 'text-primary-600',
      text: 'text-primary-600'
    },
    green: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      text: 'text-green-600'
    },
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      text: 'text-blue-600'
    },
    orange: {
      bg: 'bg-orange-100',
      icon: 'text-orange-600',
      text: 'text-orange-600'
    },
    purple: {
      bg: 'bg-purple-100',
      icon: 'text-purple-600',
      text: 'text-purple-600'
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center">
          <div className={`p-2 ${colorClasses[color].bg} rounded-lg`}>
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 ${colorClasses[color].bg} rounded-lg`}>
            <Icon className={`h-6 w-6 ${colorClasses[color].icon}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">
                {value}
                {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
              </p>
            </div>
          </div>
        </div>
        
        {trend && trendValue && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
