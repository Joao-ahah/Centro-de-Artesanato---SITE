'use client';

import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-amber-50 z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4 mx-auto"></div>
        <h2 className="text-xl font-medium text-amber-800 mb-2">Carregando</h2>
        <p className="text-amber-600">Aguarde um momento...</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 