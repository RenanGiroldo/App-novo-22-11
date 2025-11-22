import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={twMerge(clsx('bg-rg-card/60 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl', className))}>
      {children}
    </div>
  );
};