import React, { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-orbitron font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-rg-primary text-white hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    secondary: 'bg-rg-card text-rg-text hover:bg-gray-700 border border-gray-700 dark:border-gray-700 border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
    outline: 'border border-rg-primary text-rg-primary hover:bg-rg-primary/10',
    ghost: 'hover:bg-black/10 dark:hover:bg-white/10 text-rg-text',
    danger: 'bg-red-900 text-red-100 hover:bg-red-800',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};