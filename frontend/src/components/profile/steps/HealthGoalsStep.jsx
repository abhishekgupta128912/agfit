import React from 'react';
import { AlertCircle, Target, TrendingDown, TrendingUp, Zap, Heart, Shield } from 'lucide-react';

const HealthGoalsStep = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleSecondaryGoalToggle = (goal) => {
    const currentSecondary = data.secondary || [];
    const isSelected = currentSecondary.includes(goal);
    
    if (isSelected) {
      handleChange('secondary', currentSecondary.filter(g => g !== goal));
    } else {
      handleChange('secondary', [...currentSecondary, goal]);
    }
  };

  const primaryGoals = [
    {
      value: 'weight_loss',
      label: 'Weight Loss',
      icon: TrendingDown,
      description: 'Lose weight and reduce body fat',
      color: 'text-red-600'
    },
    {
      value: 'weight_gain',
      label: 'Weight Gain',
      icon: TrendingUp,
      description: 'Gain healthy weight',
      color: 'text-blue-600'
    },
    {
      value: 'muscle_gain',
      label: 'Muscle Gain',
      icon: Zap,
      description: 'Build muscle and strength',
      color: 'text-purple-600'
    },
    {
      value: 'general_fitness',
      label: 'General Fitness',
      icon: Heart,
      description: 'Improve overall health and fitness',
      color: 'text-green-600'
    },
    {
      value: 'endurance',
      label: 'Endurance',
      icon: Target,
      description: 'Improve cardiovascular endurance',
      color: 'text-orange-600'
    },
    {
      value: 'disease_prevention',
      label: 'Disease Prevention',
      icon: Shield,
      description: 'Prevent chronic diseases',
      color: 'text-indigo-600'
    }
  ];

  const secondaryGoals = primaryGoals.filter(goal => goal.value !== data.primary);

  return (
    <div className="space-y-6">
      {/* Primary Goal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What's your primary health goal? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {primaryGoals.map((goal) => {
            const Icon = goal.icon;
            return (
              <label key={goal.value} className="relative">
                <input
                  type="radio"
                  name="primary"
                  value={goal.value}
                  checked={data.primary === goal.value}
                  onChange={(e) => handleChange('primary', e.target.value)}
                  className="sr-only"
                />
                <div className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${data.primary === goal.value 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-6 w-6 mt-1 ${goal.color}`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{goal.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {errors.primary && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.primary}
          </p>
        )}
      </div>

      {/* Secondary Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Any secondary goals? (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {secondaryGoals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = (data.secondary || []).includes(goal.value);
            
            return (
              <label key={goal.value} className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSecondaryGoalToggle(goal.value)}
                  className="sr-only"
                />
                <div className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${goal.color}`} />
                    <span className="font-medium text-gray-900">{goal.label}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Target Weight (if weight loss/gain is selected) */}
      {(data.primary === 'weight_loss' || data.primary === 'weight_gain') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Weight (kg) - Optional
          </label>
          <input
            type="number"
            min="30"
            max="300"
            step="0.1"
            value={data.targetWeight || ''}
            onChange={(e) => handleChange('targetWeight', parseFloat(e.target.value) || '')}
            className="input-field max-w-xs"
            placeholder="e.g., 65.0"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave blank if you're not sure - we can help you set a realistic target
          </p>
        </div>
      )}

      {/* Timeframe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What's your timeframe?
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { value: '1_month', label: '1 Month' },
            { value: '3_months', label: '3 Months' },
            { value: '6_months', label: '6 Months' },
            { value: '1_year', label: '1 Year' },
            { value: 'long_term', label: 'Long Term' }
          ].map((option) => (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name="timeframe"
                value={option.value}
                checked={data.timeframe === option.value}
                onChange={(e) => handleChange('timeframe', e.target.value)}
                className="sr-only"
              />
              <div className={`
                p-3 rounded-lg border-2 cursor-pointer text-center transition-all
                ${data.timeframe === option.value 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Goal Summary */}
      {data.primary && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900 mb-2">Your Goals Summary</h4>
          <div className="text-sm text-green-700">
            <p className="mb-1">
              <strong>Primary:</strong> {primaryGoals.find(g => g.value === data.primary)?.label}
            </p>
            {data.secondary && data.secondary.length > 0 && (
              <p className="mb-1">
                <strong>Secondary:</strong> {data.secondary.map(s => 
                  primaryGoals.find(g => g.value === s)?.label
                ).join(', ')}
              </p>
            )}
            <p className="mb-1">
              <strong>Timeframe:</strong> {data.timeframe?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            {data.targetWeight && (
              <p>
                <strong>Target Weight:</strong> {data.targetWeight} kg
              </p>
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How this helps</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• AI will create personalized workout plans</li>
          <li>• Nutrition recommendations tailored to your goals</li>
          <li>• Progress tracking aligned with your objectives</li>
          <li>• Realistic timelines and milestones</li>
        </ul>
      </div>
    </div>
  );
};

export default HealthGoalsStep;
