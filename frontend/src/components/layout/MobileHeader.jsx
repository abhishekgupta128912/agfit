import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Settings, 
  User,
  Menu,
  X,
  TrendingUp,
  LogOut
} from 'lucide-react';
import Button from '../ui/Button';

const MobileHeader = ({ title, showBackButton = false, onBack, rightAction }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTitle = () => {
    if (title) return title;
    if (isAuthenticated && user) {
      return `${getGreeting()}, ${user.name?.split(' ')[0]}!`;
    }
    return 'AgFit';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 pt-safe-top md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            {showBackButton ? (
              <button
                onClick={onBack || (() => navigate(-1))}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 leading-tight">
                    {formatTitle()}
                  </span>
                  {isAuthenticated && !title && (
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {rightAction || (
              <>
                {isAuthenticated && (
                  <>
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                    </button>
                    
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </button>
                  </>
                )}
                
                {!isAuthenticated && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* User Menu Dropdown */}
      {showUserMenu && isAuthenticated && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
            onClick={() => setShowUserMenu(false)}
          />
          <div className="absolute top-16 right-4 z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 md:hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <div className="py-1">
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowUserMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User className="h-4 w-4 mr-3" />
                Profile Settings
              </button>
              
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowUserMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 mr-3" />
                App Settings
              </button>
            </div>
            
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileHeader;
