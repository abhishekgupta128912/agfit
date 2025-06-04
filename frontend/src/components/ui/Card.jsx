import React from 'react';

const Card = ({
  children,
  variant = 'default',
  padding = 'default',
  shadow = 'sm',
  hover = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl border transition-all duration-200';
  
  const variants = {
    default: 'border-gray-200',
    elevated: 'border-gray-100',
    outlined: 'border-gray-300',
    ghost: 'border-transparent bg-gray-50',
    primary: 'border-primary-200 bg-primary-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50',
    mobile: 'border-gray-200 mx-4 mb-4 md:mx-0 md:mb-0' // Mobile-specific spacing
  };

  const paddings = {
    none: '',
    sm: 'p-3 md:p-4', // Smaller padding on mobile
    default: 'p-4 md:p-6',
    lg: 'p-5 md:p-8',
    xl: 'p-6 md:p-10'
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const hoverEffects = hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer active:scale-[0.98] transition-transform' : '';

  const classes = [
    baseClasses,
    variants[variant],
    paddings[padding],
    shadows[shadow],
    hoverEffects,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`border-b border-gray-200 pb-4 mb-6 ${className}`} {...props}>
    {children}
  </div>
);

// Card Title Component
export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

// Card Description Component
export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

// Card Content Component
export const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// Card Footer Component
export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`border-t border-gray-200 pt-4 mt-6 ${className}`} {...props}>
    {children}
  </div>
);

// Preset card components
export const StatsCard = ({ title, value, icon: Icon, trend, className = '', ...props }) => (
  <Card hover className={`${className}`} {...props}>
    <div className="flex items-center">
      {Icon && (
        <div className="p-2 bg-primary-100 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      )}
      <div className={Icon ? 'ml-4' : ''}>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <span className={`ml-2 text-sm font-medium ${
              trend.type === 'up' ? 'text-green-600' : 
              trend.type === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  </Card>
);

export default Card;
