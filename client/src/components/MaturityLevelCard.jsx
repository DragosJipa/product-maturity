import React from 'react';
import HalfCircleProgressBar from './HalfCircleProgressBar';

export default function MaturityLevelCard({ level, description }) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
            <div className="relative">
                <HalfCircleProgressBar progress={level} level={level} />
            </div>
            <p className="font-ibm-plex-mono font-light text-gray-300 mt-4 text-xl">{description}</p>
        </div>
    );
}