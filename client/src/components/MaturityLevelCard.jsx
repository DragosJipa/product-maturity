import React from 'react';
import HalfCircleProgressBar from './HalfCircleProgressBar';
import './landingPage.css';

export default function MaturityLevelCard({ level, description }) {
    return (
        <div className="gradient-border-large p-6 rounded-3xl shadow-md text-center flex flex-col items-center justify-center">
            <HalfCircleProgressBar progress={level} />

            <p className="text-left leading-7 tracking-wider font-ibm-plex-mono font-thin text-white mt-4 text-xl">{description}{description}</p>
        </div>
    );
}