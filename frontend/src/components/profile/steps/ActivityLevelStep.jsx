import React from 'react';
import { AlertCircle, Bed, Coffee, Bike, Zap, Flame } from 'lucide-react';

const ActivityLevelStep = ({ data, onChange, errors }) => {
  const handleChange = (value) => {
    onChange(value);
  };

  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Sedentary',
      icon: Bed,
      description: 'Little to no exercise',
      details: 'Desk job, minimal physical activity',
      multiplier: '1.2x BMR',
      color: 'text-gray-600'
    },
    {
      value: 'lightly_active',
      label: 'Lightly Active',
      icon: Coffee,
      description: 'Light exercise 1-3 days/week',
      details: 'Light walks, occasional gym visits',
      multiplier: '1.375x BMR',
      color: 'text-blue-600'
    },
    {
      value: 'moderately_active',
      label: 'Moderately Active',
      icon: Bike,
      description: 'Moderate exercise 3-5 days/week',
      details: 'Regular workouts, active lifestyle',
      multiplier: '1.55x BMR',
      color: 'text-green-600'
    },
    {
      value: 'very_active',
      label: 'Very Active',
      icon: Zap,
      description: 'Hard exercise 6-7 days/week',
      details: 'Daily intense workouts, sports',
      multiplier: '1.725x BMR',
      color: 'text-orange-600'
    },
    {
      value: 'extremely_active',
      label: 'Extremely Active',
      icon: Flame,
      description: 'Very hard exercise, physical job',
      details: 'Professional athlete level activity',
      multiplier: '1.9x BMR',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Activity Level Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What's your current activity level? *
        </label>
        <div className="space-y-3">
          {activityLevels.map((level) => {
            const Icon = level.icon;
            return (
              <label key={level.value} className="relative">
                <input
                  type="radio"
                  name="activityLevel"
                  value={level.value}
                  checked={data === level.value}
                  onChange={(e) => handleChange(e.target.value)}
                  className="sr-only"
                />
                <div className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${data === level.value 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <div className="flex items-start space-x-4">
                    <Icon className={`h-8 w-8 mt-1 ${level.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{level.label}</h3>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {level.multiplier}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1">{level.description}</p>
                      <p className="text-sm text-gray-500">{level.details}</p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {errors.activityLevel && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.activityLevel}
          </p>
        )}
      </div>

      {/* Activity Level Explanation */}
      {data && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Your Activity Level: {activityLevels.find(l => l.value === data)?.label}
          </h4>
          <p className="text-sm text-blue-700 mb-2">
            {activityLevels.find(l => l.value === data)?.description}
          </p>
          <p className="text-xs text-blue-600">
            This affects your daily calorie needs calculation ({activityLevels.find(l => l.value === data)?.multiplier})
          </p>
        </div>
      )}

      {/* Weekly Exercise Examples */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Activity Examples</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Light Activities</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• Walking (casual pace)</li>
              <li>• Light stretching</li>
              <li>• Yoga (gentle)</li>
              <li>• Household chores</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Moderate Activities</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• Brisk walking</li>
              <li>• Swimming</li>
              <li>• Cycling</li>
              <li>• Dancing</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Vigorous Activities</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• Running</li>
              <li>• HIIT workouts</li>
              <li>• Weight training</li>
              <li>• Sports (basketball, soccer)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Very Intense Activities</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• Marathon training</li>
              <li>• CrossFit</li>
              <li>• Professional sports</li>
              <li>• Physical labor jobs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">💡 Tip</h4>
        <p className="text-sm text-yellow-700">
          Be honest about your current activity level, not what you aspire to be. 
          This helps us create realistic recommendations that you can actually follow.
          You can always update this as your fitness improves!
        </p>
      </div>
    </div>
  );
};

export default ActivityLevelStep;
