import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="font-semibold text-red-900 mb-1">Something went wrong</h3>
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
