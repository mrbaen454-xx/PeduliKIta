import React from 'react';

export const Loading = ({ message = 'Memuat data...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <p className="mt-4 text-gray-500">{message}</p>
  </div>
);

export const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-red-500 mb-2">
      <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="text-gray-700 mb-4">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
      >
        Coba Lagi
      </button>
    )}
  </div>
);

export const EmptyState = ({ message = 'Tidak ada data.', icon }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
    <div className="text-gray-400 mb-4">
      {icon || (
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )}
    </div>
    <p className="text-gray-500">{message}</p>
  </div>
);
