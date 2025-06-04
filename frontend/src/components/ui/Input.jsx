import React, { forwardRef } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'text',
  size = 'md',
  variant = 'default',
  fullWidth = true,
  className = '',
  containerClassName = '',
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const baseClasses = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    filled: error
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-200 bg-gray-50 focus:border-primary-500 focus:ring-primary-500 focus:bg-white',
    outlined: error
      ? 'border-2 border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-2 border-gray-300 focus:border-primary-500 focus:ring-primary-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px]', // Minimum touch target
    md: 'px-3 py-3 text-sm min-h-[44px]', // 44px minimum for mobile
    lg: 'px-4 py-3.5 text-base min-h-[48px]'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-5 w-5'
  };

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    LeftIcon ? 'pl-10' : '',
    (RightIcon || showPasswordToggle || error) ? 'pr-10' : '',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  const iconClass = iconSizes[size];

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className={`${iconClass} text-gray-400`} />
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          className={classes}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Right Icon / Password Toggle / Error Icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {error ? (
            <AlertCircle className={`${iconClass} text-red-500`} />
          ) : showPasswordToggle && type === 'password' ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className={iconClass} />
              ) : (
                <Eye className={iconClass} />
              )}
            </button>
          ) : RightIcon ? (
            <RightIcon className={`${iconClass} text-gray-400`} />
          ) : null}
        </div>
      </div>
      
      {/* Helper Text / Error Message */}
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  rows = 4,
  resize = 'vertical',
  fullWidth = true,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };

  const classes = [
    baseClasses,
    error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    'px-3 py-2.5 text-sm',
    resizeClasses[resize],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={classes}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  fullWidth = true,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseClasses = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white';
  
  const classes = [
    baseClasses,
    error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    'px-3 py-2.5 text-sm',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <select ref={ref} className={classes} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Input;
