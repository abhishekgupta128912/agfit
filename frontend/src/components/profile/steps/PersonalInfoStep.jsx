import React from 'react';
import { AlertCircle } from 'lucide-react';

const PersonalInfoStep = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDateOfBirthChange = (dateOfBirth) => {
    const age = calculateAge(dateOfBirth);
    onChange({
      ...data,
      dateOfBirth,
      age: age || data.age
    });
  };

  return (
    <div className="space-y-6">
      {/* Age and Date of Birth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age *
          </label>
          <input
            type="number"
            min="13"
            max="120"
            value={data.age}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || '')}
            className={`input-field ${errors.age ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter your age"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.age}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth (Optional)
          </label>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => handleDateOfBirthChange(e.target.value)}
            className="input-field"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Gender *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' }
          ].map((option) => (
            <label key={option.value} className="relative">
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={data.gender === option.value}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="sr-only"
              />
              <div className={`
                p-3 rounded-lg border-2 cursor-pointer text-center transition-all
                ${data.gender === option.value 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}>
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.gender}
          </p>
        )}
      </div>

      {/* Height and Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm) *
          </label>
          <input
            type="number"
            min="100"
            max="250"
            value={data.height}
            onChange={(e) => handleChange('height', parseInt(e.target.value) || '')}
            className={`input-field ${errors.height ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g., 175"
          />
          {errors.height && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.height}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg) *
          </label>
          <input
            type="number"
            min="30"
            max="300"
            step="0.1"
            value={data.weight}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || '')}
            className={`input-field ${errors.weight ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g., 70.5"
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.weight}
            </p>
          )}
        </div>
      </div>

      {/* BMI Calculation Display */}
      {data.height && data.weight && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">BMI Calculation</h4>
          {(() => {
            const heightInMeters = data.height / 100;
            const bmi = (data.weight / (heightInMeters * heightInMeters)).toFixed(1);
            let category = '';
            let categoryColor = '';
            
            if (bmi < 18.5) {
              category = 'Underweight';
              categoryColor = 'text-yellow-600';
            } else if (bmi < 25) {
              category = 'Normal weight';
              categoryColor = 'text-green-600';
            } else if (bmi < 30) {
              category = 'Overweight';
              categoryColor = 'text-orange-600';
            } else {
              category = 'Obese';
              categoryColor = 'text-red-600';
            }

            return (
              <div className="flex items-center justify-between">
                <span className="text-blue-700">
                  Your BMI: <span className="font-semibold">{bmi}</span>
                </span>
                <span className={`font-medium ${categoryColor}`}>
                  {category}
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Why we need this information</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Calculate your BMI and metabolic rate</li>
          <li>• Determine appropriate calorie and nutrition targets</li>
          <li>• Create personalized workout recommendations</li>
          <li>• Track your progress over time</li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
