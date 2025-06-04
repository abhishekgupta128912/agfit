import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useLoginPrompt = () => {
  const { isAuthenticated } = useAuth();
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [promptFeature, setPromptFeature] = useState('this feature');

  const requireAuth = (callback, featureName = 'this feature') => {
    if (isAuthenticated) {
      // User is authenticated, execute the callback
      if (callback) callback();
      return true;
    } else {
      // User is not authenticated, show login prompt
      setPromptFeature(featureName);
      setIsLoginPromptOpen(true);
      return false;
    }
  };

  const closeLoginPrompt = () => {
    setIsLoginPromptOpen(false);
  };

  return {
    isLoginPromptOpen,
    promptFeature,
    requireAuth,
    closeLoginPrompt
  };
};
