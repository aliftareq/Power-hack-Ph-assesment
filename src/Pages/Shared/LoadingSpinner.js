import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center space-x-2 lg:p-72">
            <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-violet-400"></div>
        </div>
    );
};

export default LoadingSpinner;