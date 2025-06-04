import React from 'react';
import { Heart, Pill, AlertTriangle, Shield } from 'lucide-react';

const HealthConditionsStep = ({ data, onChange, errors }) => {
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

  const handleMedicationChange = (index, value) => {
    const medications = [...(data.medications || [])];
    medications[index] = value;
    handleChange('medications', medications.filter(med => med.trim() !== ''));
  };

  const addMedication = () => {
    const medications = [...(data.medications || []), ''];
    handleChange('medications', medications);
  };

  const removeMedication = (index) => {
    const medications = [...(data.medications || [])];
    medications.splice(index, 1);
    handleChange('medications', medications);
  };

  const healthConditions = [
    { value: 'diabetes_type1', label: 'Type 1 Diabetes' },
    { value: 'diabetes_type2', label: 'Type 2 Diabetes' },
    { value: 'hypertension', label: 'High Blood Pressure' },
    { value: 'heart_disease', label: 'Heart Disease' },
    { value: 'asthma', label: 'Asthma' },
    { value: 'arthritis', label: 'Arthritis' },
    { value: 'thyroid_disorder', label: 'Thyroid Disorder' },
    { value: 'depression', label: 'Depression' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'sleep_apnea', label: 'Sleep Apnea' },
    { value: 'high_cholesterol', label: 'High Cholesterol' }
  ];

  const injuries = [
    { value: 'knee_injury', label: 'Knee Injury' },
    { value: 'back_injury', label: 'Back Injury' },
    { value: 'shoulder_injury', label: 'Shoulder Injury' },
    { value: 'ankle_injury', label: 'Ankle Injury' },
    { value: 'wrist_injury', label: 'Wrist Injury' },
    { value: 'neck_injury', label: 'Neck Injury' },
    { value: 'hip_injury', label: 'Hip Injury' }
  ];

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900 mb-1">Medical Disclaimer</h4>
            <p className="text-sm text-yellow-700">
              This information is used only to personalize your fitness and nutrition recommendations. 
              Always consult with healthcare professionals before starting any new exercise or diet program.
            </p>
          </div>
        </div>
      </div>

      {/* Existing Health Conditions */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Heart className="h-5 w-5 text-red-600" />
          <label className="text-sm font-medium text-gray-700">
            Existing Health Conditions (Optional)
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthConditions.map((condition) => {
            const isSelected = (data.existing || []).includes(condition.value);
            return (
              <label key={condition.value} className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleArrayToggle('existing', condition.value)}
                  className="sr-only"
                />
                <div className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <span className="text-sm font-medium">{condition.label}</span>
                </div>
              </label>
            );
          })}
        </div>
        
        {/* None option */}
        <label className="relative mt-3 block">
          <input
            type="checkbox"
            checked={(data.existing || []).includes('none')}
            onChange={() => {
              if ((data.existing || []).includes('none')) {
                handleChange('existing', []);
              } else {
                handleChange('existing', ['none']);
              }
            }}
            className="sr-only"
          />
          <div className={`
            p-3 rounded-lg border-2 cursor-pointer transition-all max-w-xs
            ${(data.existing || []).includes('none')
              ? 'border-green-500 bg-green-50 text-green-700' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}>
            <span className="text-sm font-medium">None of the above</span>
          </div>
        </label>
      </div>

      {/* Current Medications */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Pill className="h-5 w-5 text-blue-600" />
          <label className="text-sm font-medium text-gray-700">
            Current Medications (Optional)
          </label>
        </div>
        
        <div className="space-y-3">
          {(data.medications || []).map((medication, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={medication}
                onChange={(e) => handleMedicationChange(index, e.target.value)}
                className="input-field flex-1"
                placeholder="Enter medication name"
              />
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                ✕
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addMedication}
            className="btn-secondary text-sm"
          >
            + Add Medication
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Include supplements, vitamins, and prescription medications
        </p>
      </div>

      {/* Previous Injuries */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <label className="text-sm font-medium text-gray-700">
            Previous or Current Injuries (Optional)
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {injuries.map((injury) => {
            const isSelected = (data.injuries || []).includes(injury.value);
            return (
              <label key={injury.value} className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleArrayToggle('injuries', injury.value)}
                  className="sr-only"
                />
                <div className={`
                  p-3 rounded-lg border-2 cursor-pointer text-center transition-all
                  ${isSelected 
                    ? 'border-orange-500 bg-orange-50 text-orange-700' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}>
                  <span className="text-sm font-medium">{injury.label}</span>
                </div>
              </label>
            );
          })}
        </div>
        
        {/* None option for injuries */}
        <label className="relative mt-3 block">
          <input
            type="checkbox"
            checked={(data.injuries || []).includes('none')}
            onChange={() => {
              if ((data.injuries || []).includes('none')) {
                handleChange('injuries', []);
              } else {
                handleChange('injuries', ['none']);
              }
            }}
            className="sr-only"
          />
          <div className={`
            p-3 rounded-lg border-2 cursor-pointer transition-all max-w-xs
            ${(data.injuries || []).includes('none')
              ? 'border-green-500 bg-green-50 text-green-700' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}>
            <span className="text-sm font-medium">No injuries</span>
          </div>
        </label>
      </div>

      {/* Summary */}
      {((data.existing?.length > 0 && !data.existing.includes('none')) || 
        (data.medications?.length > 0) || 
        (data.injuries?.length > 0 && !data.injuries.includes('none'))) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Health Summary</h4>
          <div className="text-sm text-blue-700 space-y-1">
            {data.existing?.length > 0 && !data.existing.includes('none') && (
              <p><strong>Conditions:</strong> {data.existing.join(', ')}</p>
            )}
            {data.medications?.length > 0 && (
              <p><strong>Medications:</strong> {data.medications.filter(m => m.trim()).join(', ')}</p>
            )}
            {data.injuries?.length > 0 && !data.injuries.includes('none') && (
              <p><strong>Injuries:</strong> {data.injuries.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How this helps</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Workouts will be modified to accommodate injuries</li>
          <li>• Exercise intensity will be adjusted for health conditions</li>
          <li>• Nutrition plans will consider medication interactions</li>
          <li>• Safety recommendations will be prioritized</li>
        </ul>
      </div>
    </div>
  );
};

export default HealthConditionsStep;
