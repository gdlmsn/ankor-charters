'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  const variantStyles = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg',
    outline:
      'border-2 border-primary text-primary bg-background hover:bg-primary/10',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizeStyles = {
    sm: 'text-sm px-3 py-2 h-9',
    md: 'text-base px-6 py-3 h-11',
    lg: 'text-lg px-8 py-4 h-13',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
