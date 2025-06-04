import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../../utils/api';
import { ChevronLeft, ChevronRight, Check, User, Target, Activity, Utensils, Heart, Moon } from 'lucide-react';
import MobileLayout from '../layout/MobileLayout';

// Import step components
import PersonalInfoStep from './steps/PersonalInfoStep';
import HealthGoalsStep from './steps/HealthGoalsStep';
import ActivityLevelStep from './steps/ActivityLevelStep';
import DietaryInfoStep from './steps/DietaryInfoStep';
import HealthConditionsStep from './steps/HealthConditionsStep';
import LifestyleStep from './steps/LifestyleStep';

const HealthProfileForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {
      age: '',
      gender: '',
      height: '',
      weight: '',
      dateOfBirth: ''
    },
    healthGoals: {
      primary: '',
      secondary: [],
      targetWeight: '',
      timeframe: '3_months'
    },
    activityLevel: '',
    dietaryInfo: {
      restrictions: [],
      allergies: [],
      preferences: [],
      mealsPerDay: 3
    },
    healthConditions: {
      existing: [],
      medications: [],
      injuries: []
    },
    lifestyle: {
      sleepHours: 8,
      stressLevel: 5,
      smokingStatus: 'never',
      alcoholConsumption: 'rarely'
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const steps = [
    {
      id: 'personalInfo',
      title: 'Personal Information',
      icon: User,
      component: PersonalInfoStep,
      description: 'Basic information about you'
    },
    {
      id: 'healthGoals',
      title: 'Health Goals',
      icon: Target,
      component: HealthGoalsStep,
      description: 'What you want to achieve'
    },
    {
      id: 'activityLevel',
      title: 'Activity Level',
      icon: Activity,
      component: ActivityLevelStep,
      description: 'Your current fitness level'
    },
    {
      id: 'dietaryInfo',
      title: 'Dietary Preferences',
      icon: Utensils,
      component: DietaryInfoStep,
      description: 'Food preferences and restrictions'
    },
    {
      id: 'healthConditions',
      title: 'Health Conditions',
      icon: Heart,
      component: HealthConditionsStep,
      description: 'Medical history and conditions'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      icon: Moon,
      component: LifestyleStep,
      description: 'Sleep, stress, and habits'
    }
  ];

  // Load existing profile data if available
  useEffect(() => {
    const loadExistingProfile = async () => {
      try {
        const response = await profileAPI.getProfile();
        if (response.success && response.data.profile) {
          setFormData(response.data.profile);
        }
      } catch (error) {
        // Profile doesn't exist yet, that's okay
        console.log('No existing profile found');
      }
    };

    loadExistingProfile();
  }, []);

  const updateFormData = (stepId, data) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: data
    }));
    
    // Clear errors for this step
    setErrors(prev => ({
      ...prev,
      [stepId]: {}
    }));
  };

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    const stepData = formData[step.id];
    const stepErrors = {};

    switch (step.id) {
      case 'personalInfo':
        if (!stepData.age) stepErrors.age = 'Age is required';
        if (!stepData.gender) stepErrors.gender = 'Gender is required';
        if (!stepData.height) stepErrors.height = 'Height is required';
        if (!stepData.weight) stepErrors.weight = 'Weight is required';
        break;
      
      case 'healthGoals':
        if (!stepData.primary) stepErrors.primary = 'Primary goal is required';
        break;
      
      case 'activityLevel':
        if (!stepData) stepErrors.activityLevel = 'Activity level is required';
        break;
      
      // Other steps are optional
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [step.id]: stepErrors
    }));

    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await profileAPI.createOrUpdateProfile(formData);
      if (response.success) {
        navigate('/dashboard', { 
          state: { message: 'Health profile completed successfully!' }
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ submit: 'Failed to save profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const currentStepData = formData[steps[currentStep].id];
  const currentStepErrors = errors[steps[currentStep].id] || {};

  return (
    <MobileLayout
      title="Health Profile"
      showBackButton={true}
      onBack={() => navigate('/dashboard')}
      className="bg-gradient-to-br from-primary-50 to-primary-100"
    >
      <div className="max-w-4xl mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Complete Your Health Profile
          </h1>
          <p className="text-gray-600">
            Help us create personalized recommendations just for you
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                  <div className={`
                    w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2 transition-colors
                    ${isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-primary-600 text-white' :
                      'bg-gray-200 text-gray-400'}
                  `}>
                    {isCompleted ? <Check className="h-4 w-4 md:h-6 md:w-6" /> : <Icon className="h-4 w-4 md:h-6 md:w-6" />}
                  </div>
                  <span className={`text-xs text-center leading-tight ${
                    isCurrent ? 'text-primary-600 font-medium' : 'text-gray-500'
                  }`}>
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.title.split(' ')[0]}</span>
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="card max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>

          <CurrentStepComponent
            data={currentStepData}
            onChange={(data) => updateFormData(steps[currentStep].id, data)}
            errors={currentStepErrors}
          />

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 space-y-3 sm:space-y-0">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <span className="text-sm text-gray-500 order-first sm:order-none">
              Step {currentStep + 1} of {steps.length}
            </span>

            <button
              type="button"
              onClick={nextStep}
              disabled={isLoading}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] w-full sm:w-auto"
            >
              {currentStep === steps.length - 1 ? (
                isLoading ? 'Saving...' : 'Complete Profile'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default HealthProfileForm;
