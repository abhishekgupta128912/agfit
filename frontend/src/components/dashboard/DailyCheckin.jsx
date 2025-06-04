import React, { useState } from 'react';
import {
  Plus,
  Check,
  Coffee,
  Utensils,
  Droplets,
  Dumbbell,
  Moon,
  Heart
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input, { Select } from '../ui/Input';
import Card from '../ui/Card';

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
    <div className="card animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
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
              <Button
                variant="ghost"
                size="sm"
                icon={Plus}
                onClick={() => setShowMealForm(true)}
              >
                Add Meal
              </Button>
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
          <Modal
            isOpen={showMealForm}
            onClose={() => setShowMealForm(false)}
            title="Log Meal"
            size="md"
          >
            <form onSubmit={handleLogMeal} className="space-y-4">
              <Select
                label="Meal Type"
                value={mealForm.name}
                onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
                options={[
                  { value: 'breakfast', label: 'Breakfast' },
                  { value: 'lunch', label: 'Lunch' },
                  { value: 'dinner', label: 'Dinner' },
                  { value: 'snack', label: 'Snack' }
                ]}
              />

              <Input
                label="Foods (comma separated)"
                type="text"
                value={mealForm.foods}
                onChange={(e) => setMealForm({ ...mealForm, foods: e.target.value })}
                placeholder="e.g., Oatmeal, Banana, Almonds"
              />

              <Input
                label="Calories (optional)"
                type="number"
                value={mealForm.calories}
                onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
                placeholder="e.g., 350"
              />

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowMealForm(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                >
                  Log Meal
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {/* Workout Tab */}
      {activeTab === 'workout' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-900">Today's Exercises</p>
            <Button
              variant="ghost"
              size="sm"
              icon={Plus}
              onClick={() => setShowExerciseForm(true)}
            >
              Add Exercise
            </Button>
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
          <Modal
            isOpen={showExerciseForm}
            onClose={() => setShowExerciseForm(false)}
            title="Log Exercise"
            size="md"
          >
            <form onSubmit={handleLogExercise} className="space-y-4">
              <Input
                label="Exercise Name"
                type="text"
                value={exerciseForm.name}
                onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                placeholder="e.g., Push-ups, Running, Yoga"
                required
              />

              <Input
                label="Duration (minutes)"
                type="number"
                value={exerciseForm.duration}
                onChange={(e) => setExerciseForm({ ...exerciseForm, duration: e.target.value })}
                placeholder="e.g., 30"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={exerciseForm.notes}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, notes: e.target.value })}
                  placeholder="How did it feel? Any observations?"
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowExerciseForm(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                >
                  Log Exercise
                </Button>
              </div>
            </form>
          </Modal>
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
