import React, { useState } from 'react';
import { 
  Plus, 
  Droplets, 
  Utensils, 
  Dumbbell, 
  Target,
  X
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input, { Select } from '../ui/Input';

const QuickActions = ({ onUpdate, isVisible, onClose }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [quickData, setQuickData] = useState({
    water: { glasses: 1 },
    meal: { name: 'snack', foods: '', calories: '' },
    exercise: { name: '', duration: '', notes: '' }
  });

  const quickActions = [
    {
      id: 'water',
      label: 'Add Water',
      icon: Droplets,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'meal',
      label: 'Log Meal',
      icon: Utensils,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'exercise',
      label: 'Log Exercise',
      icon: Dumbbell,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'goal',
      label: 'Set Goal',
      icon: Target,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  const handleQuickAction = async (actionId) => {
    if (actionId === 'water') {
      // Quick water logging - no modal needed
      try {
        await onUpdate('water', quickData.water);
        onClose();
      } catch (error) {
        console.error('Error adding water:', error);
      }
    } else {
      setActiveAction(actionId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeAction === 'meal') {
        const mealData = {
          name: quickData.meal.name,
          foods: quickData.meal.foods.split(',').map(f => f.trim()).filter(f => f),
          calories: parseInt(quickData.meal.calories) || 0
        };
        await onUpdate('meal', mealData);
      } else if (activeAction === 'exercise') {
        const exerciseData = {
          name: quickData.exercise.name,
          duration: parseInt(quickData.exercise.duration) || 0,
          notes: quickData.exercise.notes
        };
        await onUpdate('exercise', exerciseData);
      }
      
      setActiveAction(null);
      onClose();
    } catch (error) {
      console.error('Error submitting quick action:', error);
    }
  };

  const updateQuickData = (type, field, value) => {
    setQuickData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Quick Actions Overlay */}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center md:hidden">
        <div className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-8 animate-slide-in-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className={`${action.color} ${action.hoverColor} text-white rounded-2xl p-6 flex flex-col items-center space-y-3 transition-all duration-200 active:scale-95 shadow-lg`}
                >
                  <Icon className="h-8 w-8" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Meal Form Modal */}
      <Modal
        isOpen={activeAction === 'meal'}
        onClose={() => setActiveAction(null)}
        title="Quick Meal Log"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Meal Type"
            value={quickData.meal.name}
            onChange={(e) => updateQuickData('meal', 'name', e.target.value)}
            options={[
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'lunch', label: 'Lunch' },
              { value: 'dinner', label: 'Dinner' },
              { value: 'snack', label: 'Snack' }
            ]}
          />

          <Input
            label="Foods"
            type="text"
            value={quickData.meal.foods}
            onChange={(e) => updateQuickData('meal', 'foods', e.target.value)}
            placeholder="e.g., Apple, Yogurt"
          />

          <Input
            label="Calories (optional)"
            type="number"
            value={quickData.meal.calories}
            onChange={(e) => updateQuickData('meal', 'calories', e.target.value)}
            placeholder="e.g., 200"
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveAction(null)}
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

      {/* Exercise Form Modal */}
      <Modal
        isOpen={activeAction === 'exercise'}
        onClose={() => setActiveAction(null)}
        title="Quick Exercise Log"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Exercise"
            type="text"
            value={quickData.exercise.name}
            onChange={(e) => updateQuickData('exercise', 'name', e.target.value)}
            placeholder="e.g., Push-ups, Running"
            required
          />

          <Input
            label="Duration (minutes)"
            type="number"
            value={quickData.exercise.duration}
            onChange={(e) => updateQuickData('exercise', 'duration', e.target.value)}
            placeholder="e.g., 30"
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveAction(null)}
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
    </>
  );
};

export default QuickActions;
