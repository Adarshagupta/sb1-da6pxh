import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

export function Loader({ size = 'medium' }: LoaderProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600`} />
  );
}