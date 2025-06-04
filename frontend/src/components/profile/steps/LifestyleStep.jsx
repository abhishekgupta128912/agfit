import React from 'react';
import { Moon, Zap, Cigarette, Wine } from 'lucide-react';

const LifestyleStep = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const getStressLevelColor = (level) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    if (level <= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStressLevelLabel = (level) => {
    if (level <= 2) return 'Very Low';
    if (level <= 4) return 'Low';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'High';
    return 'Very High';
  };

  return (
    <div className="space-y-6">
      {/* Sleep Hours */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Moon className="h-5 w-5 text-indigo-600" />
          <label className="text-sm font-medium text-gray-700">
            How many hours do you sleep per night on average?
          </label>
        </div>
        
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hours) => (
            <label key={hours} className="relative">
              <input
                type="radio"
                name="sleepHours"
                value={hours}
                checked={data.sleepHours === hours}
                onChange={(e) => handleChange('sleepHours', parseInt(e.target.value))}
                className="sr-only"
              />
              <div className={`
                p-3 rounded-lg border-2 cursor-pointer text-center transition-all
                ${data.sleepHours === hours 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}>
                <span className="text-sm font-medium">{hours}h</span>
              </div>
            </label>
          ))}
        </div>
        
        {data.sleepHours && (
          <div className="mt-2 text-sm text-gray-600">
            {data.sleepHours < 6 && (
              <p className="text-red-600">⚠️ Consider getting more sleep for better health and recovery</p>
            )}
            {data.sleepHours >= 6 && data.sleepHours <= 9 && (
              <p className="text-green-600">✅ Good sleep duration for most adults</p>
            )}
            {data.sleepHours > 9 && (
              <p className="text-yellow-600">💤 You might be getting more sleep than needed</p>
            )}
          </div>
        )}
      </div>

      {/* Stress Level */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="h-5 w-5 text-yellow-600" />
          <label className="text-sm font-medium text-gray-700">
            What's your current stress level? (1 = Very Low, 10 = Very High)
          </label>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 w-16">Very Low</span>
            <input
              type="range"
              min="1"
              max="10"
              value={data.stressLevel || 5}
              onChange={(e) => handleChange('stressLevel', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
              }}
            />
            <span className="text-sm text-gray-500 w-16">Very High</span>
          </div>
          
          <div className="text-center">
            <span className={`text-lg font-semibold ${getStressLevelColor(data.stressLevel || 5)}`}>
              {data.stressLevel || 5}/10 - {getStressLevelLabel(data.stressLevel || 5)}
            </span>
          </div>
          
          {data.stressLevel >= 8 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                High stress levels can impact your health goals. Consider stress management techniques 
                like meditation, yoga, or speaking with a healthcare professional.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Smoking Status */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Cigarette className="h-5 w-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">
            Smoking Status
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { value: 'never', label: 'Never smoked', color: 'green' },
            { value: 'former', label: 'Former smoker', color: 'blue' },
            { value: 'current_light', label: 'Current light smoker', color: 'yellow' },
            { value: 'current_heavy', label: 'Current heavy smoker', color: 'red' }
          ].map((option) => (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name="smokingStatus"
                value={option.value}
                checked={data.smokingStatus === option.value}
                onChange={(e) => handleChange('smokingStatus', e.target.value)}
                className="sr-only"
              />
              <div className={`
                p-3 rounded-lg border-2 cursor-pointer transition-all
                ${data.smokingStatus === option.value 
                  ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700` 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Alcohol Consumption */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Wine className="h-5 w-5 text-purple-600" />
          <label className="text-sm font-medium text-gray-700">
            Alcohol Consumption
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'never', label: 'Never', description: 'No alcohol consumption' },
            { value: 'rarely', label: 'Rarely', description: 'Special occasions only' },
            { value: 'occasionally', label: 'Occasionally', description: '1-2 times per week' },
            { value: 'regularly', label: 'Regularly', description: '3-5 times per week' },
            { value: 'daily', label: 'Daily', description: 'Every day' }
          ].map((option) => (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name="alcoholConsumption"
                value={option.value}
                checked={data.alcoholConsumption === option.value}
                onChange={(e) => handleChange('alcoholConsumption', e.target.value)}
                className="sr-only"
              />
              <div className={`
                p-3 rounded-lg border-2 cursor-pointer transition-all
                ${data.alcoholConsumption === option.value 
                  ? 'border-purple-500 bg-purple-50 text-purple-700' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}>
                <div className="text-center">
                  <span className="text-sm font-medium block">{option.label}</span>
                  <span className="text-xs text-gray-500">{option.description}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Lifestyle Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Your Lifestyle Profile</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Sleep:</strong> {data.sleepHours || 8} hours per night</p>
          <p><strong>Stress Level:</strong> {data.stressLevel || 5}/10 ({getStressLevelLabel(data.stressLevel || 5)})</p>
          <p><strong>Smoking:</strong> {data.smokingStatus?.replace('_', ' ') || 'Never'}</p>
          <p><strong>Alcohol:</strong> {data.alcoholConsumption?.replace('_', ' ') || 'Rarely'}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-900 mb-2">Lifestyle Recommendations</h4>
        <ul className="text-sm text-green-700 space-y-1">
          {data.sleepHours < 7 && (
            <li>• Aim for 7-9 hours of sleep for optimal recovery and health</li>
          )}
          {data.stressLevel >= 7 && (
            <li>• Consider stress management techniques like meditation or yoga</li>
          )}
          {(data.smokingStatus === 'current_light' || data.smokingStatus === 'current_heavy') && (
            <li>• Quitting smoking will significantly improve your fitness results</li>
          )}
          {(data.alcoholConsumption === 'regularly' || data.alcoholConsumption === 'daily') && (
            <li>• Moderate alcohol consumption for better health outcomes</li>
          )}
          <li>• Regular exercise can help improve sleep quality and reduce stress</li>
        </ul>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How this helps</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Sleep patterns affect workout scheduling and recovery recommendations</li>
          <li>• Stress levels influence exercise intensity and stress-relief activities</li>
          <li>• Lifestyle factors help create realistic and sustainable plans</li>
          <li>• Personalized wellness tips based on your current habits</li>
        </ul>
      </div>
    </div>
  );
};

export default LifestyleStep;
