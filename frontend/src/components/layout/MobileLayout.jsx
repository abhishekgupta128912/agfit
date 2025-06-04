import React from 'react';
import { useAuth } from '../../context/AuthContext';
import MobileHeader from './MobileHeader';
import BottomNavigation from './BottomNavigation';
import Navbar from './Navbar';

const MobileLayout = ({ 
  children, 
  title, 
  showBackButton = false, 
  onBack,
  rightAction,
  hideBottomNav = false,
  className = ''
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation - Hidden on Mobile */}
      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Header - Hidden on Desktop */}
      <div className="md:hidden">
        <MobileHeader 
          title={title}
          showBackButton={showBackButton}
          onBack={onBack}
          rightAction={rightAction}
        />
      </div>

      {/* Main Content */}
      <main className={`
        ${isAuthenticated && !hideBottomNav ? 'pb-20' : 'pb-4'} 
        md:pb-0 
        ${className}
      `}>
        {/* Desktop Container */}
        <div className="hidden md:block max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {children}
          </div>
        </div>

        {/* Mobile Container */}
        <div className="md:hidden">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {isAuthenticated && !hideBottomNav && (
        <BottomNavigation />
      )}
    </div>
  );
};

export default MobileLayout;
