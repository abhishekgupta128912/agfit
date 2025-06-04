import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 border border-gray-300',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow-md',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 shadow-sm hover:shadow-md'
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs min-h-[32px]',
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px]', // 44px minimum touch target for mobile
    lg: 'px-4 py-3 text-base min-h-[48px]',
    xl: 'px-6 py-3.5 text-base min-h-[52px]'
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-5 w-5'
  };

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  const iconClass = iconSizes[size];
  const showIcon = Icon && !isLoading;
  const showLoader = isLoading;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {/* Left Icon */}
      {showIcon && iconPosition === 'left' && (
        <Icon className={`${iconClass} ${children ? 'mr-2' : ''}`} />
      )}
      
      {/* Loading Spinner */}
      {showLoader && (
        <Loader2 className={`${iconClass} animate-spin ${children ? 'mr-2' : ''}`} />
      )}
      
      {/* Button Text */}
      {children}
      
      {/* Right Icon */}
      {showIcon && iconPosition === 'right' && (
        <Icon className={`${iconClass} ${children ? 'ml-2' : ''}`} />
      )}
    </button>
  );
};

// Preset button components for common use cases
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const WarningButton = (props) => <Button variant="warning" {...props} />;

export default Button;
