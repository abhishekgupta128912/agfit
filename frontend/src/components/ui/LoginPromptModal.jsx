import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, UserPlus, LogIn } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';

const LoginPromptModal = ({ isOpen, onClose, feature = "this feature" }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center p-6">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
          <Lock className="h-8 w-8 text-primary-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Login Required
        </h3>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Please log in to access {feature}. Join thousands of users on their health journey with AgFit!
        </p>

        {/* Benefits */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-medium text-gray-900 mb-2">With AgFit you can:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Track your daily meals and exercises</li>
            <li>• Get AI-powered personalized recommendations</li>
            <li>• Monitor your progress with detailed analytics</li>
            <li>• Set and achieve your health goals</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            className="flex-1"
            icon={LogIn}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            icon={UserPlus}
            onClick={handleRegister}
          >
            Sign Up
          </Button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </Modal>
  );
};

export default LoginPromptModal;
