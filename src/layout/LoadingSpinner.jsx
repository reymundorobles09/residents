import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingSpinner = ({ size = '50px', strokeWidth = '4', className = '' }) => {
  return (
    <div className={`flex align-items-center justify-content-center ${className}`} 
         style={{ minHeight: '100vh' }}>
      <ProgressSpinner 
        style={{ width: size, height: size }} 
        strokeWidth={strokeWidth}
        animationDuration=".5s"
      />
    </div>
  );
};

export const InlineLoader = ({ size = '20px', strokeWidth = '3' }) => {
  return (
    <div className="flex align-items-center justify-content-center">
      <ProgressSpinner 
        style={{ width: size, height: size }} 
        strokeWidth={strokeWidth}
        animationDuration=".5s"
      />
    </div>
  );
};

export const PageLoader = () => <LoadingSpinner className="fixed top-0 left-0" />;
export const SectionLoader = () => <LoadingSpinner size="40px" className="my-5" />;

export default LoadingSpinner;