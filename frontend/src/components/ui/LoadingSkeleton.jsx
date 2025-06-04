import React from 'react';

const LoadingSkeleton = ({
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  className = '',
  animation = 'pulse',
  ...props
}) => {
  const baseClasses = 'bg-gray-300 rounded';
  
  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: ''
  };

  const variants = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
    avatar: 'rounded-full w-10 h-10',
    card: 'rounded-xl h-32',
    button: 'rounded-lg h-10'
  };

  const classes = [
    baseClasses,
    animations[animation],
    variants[variant],
    className
  ].filter(Boolean).join(' ');

  const style = {
    width: variant === 'circular' || variant === 'avatar' ? height : width,
    height: variant === 'text' ? '1rem' : height,
    ...props.style
  };

  return (
    <div 
      className={classes}
      style={style}
      {...props}
    />
  );
};

// Text Skeleton Component
export const TextSkeleton = ({ 
  lines = 1, 
  className = '', 
  lineHeight = '1rem',
  spacing = '0.5rem',
  ...props 
}) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, index) => (
      <LoadingSkeleton
        key={index}
        variant="text"
        height={lineHeight}
        className={index < lines - 1 ? `mb-${spacing}` : ''}
        {...props}
      />
    ))}
  </div>
);

// Avatar Skeleton Component
export const AvatarSkeleton = ({ size = 'md', className = '', ...props }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <LoadingSkeleton
      variant="circular"
      className={`${sizes[size]} ${className}`}
      {...props}
    />
  );
};

// Card Skeleton Component
export const CardSkeleton = ({ 
  showAvatar = false,
  showTitle = true,
  showDescription = true,
  showActions = false,
  className = '',
  ...props 
}) => (
  <div className={`p-6 bg-white rounded-xl border border-gray-200 ${className}`} {...props}>
    {/* Header with Avatar */}
    {showAvatar && (
      <div className="flex items-center mb-4">
        <AvatarSkeleton size="md" />
        <div className="ml-3 flex-1">
          <LoadingSkeleton width="40%" height="1rem" className="mb-2" />
          <LoadingSkeleton width="60%" height="0.75rem" />
        </div>
      </div>
    )}
    
    {/* Title */}
    {showTitle && (
      <LoadingSkeleton width="70%" height="1.25rem" className="mb-3" />
    )}
    
    {/* Description */}
    {showDescription && (
      <div className="space-y-2 mb-4">
        <LoadingSkeleton width="100%" height="0.875rem" />
        <LoadingSkeleton width="80%" height="0.875rem" />
        <LoadingSkeleton width="60%" height="0.875rem" />
      </div>
    )}
    
    {/* Actions */}
    {showActions && (
      <div className="flex space-x-2">
        <LoadingSkeleton variant="button" width="5rem" />
        <LoadingSkeleton variant="button" width="4rem" />
      </div>
    )}
  </div>
);

// Table Skeleton Component
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  showHeader = true,
  className = '',
  ...props 
}) => (
  <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`} {...props}>
    {/* Header */}
    {showHeader && (
      <div className="border-b border-gray-200 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <LoadingSkeleton key={index} width="60%" height="1rem" />
          ))}
        </div>
      </div>
    )}
    
    {/* Rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <LoadingSkeleton key={colIndex} width="80%" height="0.875rem" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Stats Card Skeleton Component
export const StatsCardSkeleton = ({ className = '', ...props }) => (
  <div className={`p-6 bg-white rounded-xl border border-gray-200 ${className}`} {...props}>
    <div className="flex items-center">
      <LoadingSkeleton variant="circular" width="3rem" height="3rem" />
      <div className="ml-4 flex-1">
        <LoadingSkeleton width="60%" height="0.875rem" className="mb-2" />
        <LoadingSkeleton width="40%" height="1.5rem" />
      </div>
    </div>
  </div>
);

// Dashboard Skeleton Component
export const DashboardSkeleton = ({ className = '', ...props }) => (
  <div className={`space-y-6 ${className}`} {...props}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <div>
        <LoadingSkeleton width="12rem" height="2rem" className="mb-2" />
        <LoadingSkeleton width="20rem" height="1rem" />
      </div>
      <LoadingSkeleton variant="button" width="6rem" />
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <StatsCardSkeleton key={index} />
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CardSkeleton showTitle showDescription />
      </div>
      <div>
        <CardSkeleton showTitle showDescription />
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
