import React from 'react';
import { Utensils, AlertTriangle, Heart } from 'lucide-react';

const DietaryInfoStep = ({ data, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleArrayToggle = (field, item) => {
    const currentArray = data[field] || [];
    const isSelected = currentArray.includes(item);
    
    if (isSelected) {
      handleChange(field, currentArray.filter(i => i !== item));
    } else {
      handleChange(field, [...currentArray, item]);
    }
  };

  const dietaryRestrictions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'pescatarian', label: 'Pescatarian' },
    { value: 'keto', label: 'Ketogenic' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'gluten_free', label: 'Gluten-Free' },
    { value: 'dairy_free', label: 'Dairy-Free' },
    { value: 'low_carb', label: 'Low Carb' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'intermittent_fasting', label: 'Intermittent Fasting' }
  ];

  const allergies = [
    { value: 'nuts', label: 'Nuts' },
    { value: 'shellfish', label: 'Shellfish' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'soy', label: 'Soy' },
    { value: 'wheat', label: 'Wheat/Gluten' },
    { value: 'fish', label: 'Fish' },
    { value: 'sesame', label: 'Sesame' }
  ];

  const preferences = [
    { value: 'spicy_food', label: 'Spicy Food' },
    { value: 'sweet_food', label: 'Sweet Food' },
    { value: 'organic', label: 'Organic' },
    { value: 'local_produce', label: 'Local Produce' },
    { value: 'meal_prep_friendly', label: 'Meal Prep Friendly' },
    { value: 'quick_meals', label: 'Quick Meals' },
    { value: 'traditional_cuisine', label: 'Traditional Cuisine' }
  ];

  return (
    <div className="space-y-6">
      {/* Dietary Restrictions */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Utensils className="h-5 w-5 text-green-600" />
          <label className="text-sm font-medium text-gray-700">
            Dietary Restrictions (Optional)
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {dietaryRestrictions.map((restriction) => {
            const isSelected = (data.restrictions || []).includes(restriction.value);
            return (
              <label key={restriction.value} className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleArrayToggle('restrictions', restriction.value)}
                  className="sr-only"
                />
                <div className={`
                  p-3 rounded-lg border-2 cursor-pointer text-center transition-all
                  ${isSelected 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <span className="text-sm font-medium">{restriction.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Food Allergies */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <label className="text-sm font-medium text-gray-700">
            Food Allergies (Optional)
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allergies.map((allergy) => {
            const isSelected = (data.allergies || []).includes(allergy.value);
            return (
              <label key={allergy.value} className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleArrayToggle('allergies', allergy.value)}
                  className="sr-only"
                />
                <div className={`
                  p-3 rounded-lg border-2 cursor-pointer text-center transition-all
                  ${isSelected 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <span className="text-sm font-medium">{allergy.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Food Preferences */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Heart className="h-5 w-5 text-purple-600" />
          <label className="text-sm font-medium text-gray-700">
            Food Preferences (Optional)
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {preferences.map((preference) => {
            const isSelected = (data.preferences || []).includes(preference.value);
            return (
              <label key={preference.value} className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleArrayToggle('preferences', preference.value)}
                  className="sr-only"
                />
                <div className={`
                  p-3 rounded-lg border-2 cursor-pointer text-center transition-all
                  ${isSelected 
                    ? 'border-purple-500 bg-purple-50 text-purple-700' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <span className="text-sm font-medium">{preference.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Meals Per Day */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How many meals do you prefer per day?
        </label>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <label key={num} className="relative">
              <input
                type="radio"
                name="mealsPerDay"
                value={num}
                checked={data.mealsPerDay === num}
                onChange={(e) => handleChange('mealsPerDay', parseInt(e.target.value))}
                className="sr-only"
              />
              <div className={`
                p-3 rounded-lg border-2 cursor-pointer text-center transition-all
                ${data.mealsPerDay === num 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}>
                <span className="text-sm font-medium">{num}</span>
              </div>
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          This includes snacks and smaller meals throughout the day
        </p>
      </div>

      {/* Summary */}
      {(data.restrictions?.length > 0 || data.allergies?.length > 0 || data.preferences?.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Your Dietary Profile</h4>
          <div className="text-sm text-blue-700 space-y-1">
            {data.restrictions?.length > 0 && (
              <p><strong>Restrictions:</strong> {data.restrictions.join(', ')}</p>
            )}
            {data.allergies?.length > 0 && (
              <p><strong>Allergies:</strong> {data.allergies.join(', ')}</p>
            )}
            {data.preferences?.length > 0 && (
              <p><strong>Preferences:</strong> {data.preferences.join(', ')}</p>
            )}
            <p><strong>Meals per day:</strong> {data.mealsPerDay || 3}</p>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How this helps</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• AI will create meal plans that fit your dietary needs</li>
          <li>• Recipes will exclude your allergens and restrictions</li>
          <li>• Meal timing will match your preferred eating schedule</li>
          <li>• Nutrition recommendations will be personalized</li>
        </ul>
      </div>
    </div>
  );
};

export default DietaryInfoStep;
