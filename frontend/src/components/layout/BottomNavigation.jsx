import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  UserCircle, 
  Brain, 
  TrendingUp,
  Plus
} from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
      color: 'text-blue-600'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserCircle,
      path: '/profile',
      color: 'text-green-600'
    },
    {
      id: 'add',
      label: 'Track',
      icon: Plus,
      path: '/dashboard',
      color: 'text-primary-600',
      isSpecial: true
    },
    {
      id: 'recommendations',
      label: 'AI Plans',
      icon: Brain,
      path: '/recommendations',
      color: 'text-purple-600'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      path: '/progress',
      color: 'text-orange-600'
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const handleNavigation = (item) => {
    if (item.id === 'add') {
      // Scroll to daily check-in section or open quick add modal
      const element = document.querySelector('[data-daily-checkin]');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-all duration-200 ${
                item.isSpecial 
                  ? 'relative -top-2' 
                  : ''
              }`}
            >
              {item.isSpecial ? (
                <div className="bg-primary-600 rounded-full p-3 shadow-lg">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className={`p-2 rounded-lg transition-colors ${
                  active 
                    ? 'bg-gray-100' 
                    : 'hover:bg-gray-50'
                }`}>
                  <Icon 
                    className={`h-6 w-6 transition-colors ${
                      active 
                        ? item.color 
                        : 'text-gray-400'
                    }`} 
                  />
                </div>
              )}
              
              <span className={`text-xs mt-1 font-medium transition-colors ${
                active && !item.isSpecial
                  ? item.color
                  : item.isSpecial
                  ? 'text-primary-600'
                  : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
