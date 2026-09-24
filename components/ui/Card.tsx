import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, gradient = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-slate-800/90 bg-slate-900/80 backdrop-blur-md p-5 shadow-lg transition-all',
          gradient && 'bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-800/40 border-slate-700/60',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={twMerge('flex flex-col space-y-1.5 pb-4 border-b border-slate-800/80 mb-4', className)}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h3 className={twMerge('text-lg font-semibold tracking-tight text-slate-100 flex items-center gap-2', className)}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p className={twMerge('text-xs text-slate-400 font-normal', className)}>{children}</p>
);
