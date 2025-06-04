import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Coffee, 
  Utensils, 
  Droplets, 
  Dumbbell,
  Moon,
  Heart,
  X
} from 'lucide-react';

const DailyCheckin = ({ progress, onUpdate, isLoading }) => {
  const [activeTab, setActiveTab] = useState('nutrition');
  const [showMealForm, setShowMealForm] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [mealForm, setMealForm] = useState({
    name: 'breakfast',
    foods: '',
    calories: ''
  });
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    duration: '',
    notes: ''
  });

  const handleAddWater = async () => {
    try {
      await onUpdate('water', { glasses: 1 });
    } catch (error) {
      console.error('Error adding water:', error);
    }
  };

  const handleLogMeal = async (e) => {
    e.preventDefault();
    try {
      const mealData = {
        name: mealForm.name,
        foods: mealForm.foods.split(',').map(f => f.trim()).filter(f => f),
        calories: parseInt(mealForm.calories) || 0
      };
      
      await onUpdate('meal', mealData);
      setMealForm({ name: 'breakfast', foods: '', calories: '' });
      setShowMealForm(false);
    } catch (error) {
      console.error('Error logging meal:', error);
    }
  };

  const handleLogExercise = async (e) => {
    e.preventDefault();
    try {
      const exerciseData = {
        name: exerciseForm.name,
        duration: parseInt(exerciseForm.duration) || 0,
        notes: exerciseForm.notes
      };
      
      await onUpdate('exercise', exerciseData);
      setExerciseForm({ name: '', duration: '', notes: '' });
      setShowExerciseForm(false);
    } catch (error) {
      console.error('Error logging exercise:', error);
    }
  };

  const waterProgress = progress?.nutrition?.waterIntake || { glasses: 0, target: 8 };
  const waterPercentage = Math.min((waterProgress.glasses / waterProgress.target) * 100, 100);

  const tabs = [
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'wellness', label: 'Wellness', icon: Heart }
  ];

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Daily Check-in
      </h3>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Nutrition Tab */}
      {activeTab === 'nutrition' && (
        <div className="space-y-4">
          {/* Water Intake */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Droplets className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Water Intake</p>
                <p className="text-xs text-gray-600">
                  {waterProgress.glasses} / {waterProgress.target} glasses
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${waterPercentage}%` }}
                />
              </div>
              <button
                onClick={handleAddWater}
                className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Meals */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-900">Today's Meals</p>
              <button
                onClick={() => setShowMealForm(true)}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Meal</span>
              </button>
            </div>
            
            <div className="space-y-2">
              {progress?.nutrition?.meals?.length > 0 ? (
                progress.nutrition.meals.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Coffee className="h-4 w-4 text-gray-600" />
                      <span className="text-sm capitalize">{meal.name}</span>
                      <span className="text-xs text-gray-500">
                        {meal.calories} cal
                      </span>
                    </div>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No meals logged today
                </p>
              )}
            </div>
          </div>

          {/* Meal Form Modal */}
          {showMealForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Log Meal</h4>
                  <button
                    onClick={() => setShowMealForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleLogMeal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meal Type
                    </label>
                    <select
                      value={mealForm.name}
                      onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Foods (comma separated)
                    </label>
                    <input
                      type="text"
                      value={mealForm.foods}
                      onChange={(e) => setMealForm({ ...mealForm, foods: e.target.value })}
                      placeholder="e.g., Oatmeal, Banana, Almonds"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calories (optional)
                    </label>
                    <input
                      type="number"
                      value={mealForm.calories}
                      onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                      placeholder="e.g., 350"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowMealForm(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Log Meal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Workout Tab */}
      {activeTab === 'workout' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-900">Today's Exercises</p>
            <button
              onClick={() => setShowExerciseForm(true)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Exercise</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {progress?.workout?.exercises?.length > 0 ? (
              progress.workout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{exercise.name}</span>
                    <span className="text-xs text-gray-500">
                      {exercise.duration}min
                    </span>
                  </div>
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No exercises logged today
              </p>
            )}
          </div>

          {/* Exercise Form Modal */}
          {showExerciseForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Log Exercise</h4>
                  <button
                    onClick={() => setShowExerciseForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleLogExercise} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exercise Name
                    </label>
                    <input
                      type="text"
                      value={exerciseForm.name}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                      placeholder="e.g., Push-ups, Running, Yoga"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={exerciseForm.duration}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, duration: e.target.value })}
                      placeholder="e.g., 30"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      value={exerciseForm.notes}
                      onChange={(e) => setExerciseForm({ ...exerciseForm, notes: e.target.value })}
                      placeholder="How did it feel? Any observations?"
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowExerciseForm(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Log Exercise
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Wellness Tab */}
      {activeTab === 'wellness' && (
        <div className="space-y-4">
          <div className="text-center py-8">
            <Moon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              Wellness tracking coming soon!
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Sleep, mood, and meditation tracking
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyCheckin;
