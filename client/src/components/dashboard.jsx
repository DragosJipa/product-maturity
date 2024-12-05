import React, { useState } from 'react';
import MaturityLevel from './MaturityLevel';
import DetailedAnalysis from './DetailedAnalysis';
import Risks from './Risks';
import './landingPage.css';
import { motion, AnimatePresence } from 'framer-motion';
import Roadmapc from './Roadmapc';
import StarBackground from './StarBackground';
import { moduscreate } from '../utils/icons';
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('maturityLevel');
    const downloadIcon = (
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5625 4.06179C9.5625 3.75004 9.31172 3.49924 9 3.49924C8.68828 3.49924 8.4375 3.75004 8.4375 4.06179V10.3929L6.21094 8.16609C5.99062 7.94575 5.63437 7.94575 5.41641 8.16609C5.19844 8.38642 5.19609 8.7427 5.41641 8.96069L8.60156 12.1485C8.82188 12.3688 9.17812 12.3688 9.39609 12.1485L12.5859 8.96069C12.8062 8.74036 12.8062 8.38407 12.5859 8.16609C12.3656 7.9481 12.0094 7.94575 11.7914 8.16609L9.56484 10.3929V4.06179H9.5625ZM6.01875 10.6249H4.5C3.67266 10.6249 3 11.2976 3 12.1251V14.0002C3 14.8277 3.67266 15.5004 4.5 15.5004H13.5C14.3273 15.5004 15 14.8277 15 14.0002V12.1251C15 11.2976 14.3273 10.6249 13.5 10.6249H11.9813L10.8563 11.75H13.5C13.7063 11.75 13.875 11.9188 13.875 12.1251V14.0002C13.875 14.2065 13.7063 14.3753 13.5 14.3753H4.5C4.29375 14.3753 4.125 14.2065 4.125 14.0002V12.1251C4.125 11.9188 4.29375 11.75 4.5 11.75H7.14375L6.01875 10.6249ZM13.125 13.0626C13.125 12.9134 13.0657 12.7704 12.9602 12.6649C12.8548 12.5594 12.7117 12.5001 12.5625 12.5001C12.4133 12.5001 12.2702 12.5594 12.1648 12.6649C12.0593 12.7704 12 12.9134 12 13.0626C12 13.2118 12.0593 13.3549 12.1648 13.4604C12.2702 13.5659 12.4133 13.6252 12.5625 13.6252C12.7117 13.6252 12.8548 13.5659 12.9602 13.4604C13.0657 13.3549 13.125 13.2118 13.125 13.0626Z" fill="white" />
        </svg>
    );

    const pageVariants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction > 0 ? "-100%" : "100%",
            opacity: 0,
        }),
    };

    const pageTransition = {
        type: "tween",
        duration: 0.35,
        ease: "easeInOut"
    };

    const [direction, setDirection] = useState(0);

    const handleTabChange = (newTab) => {
        const tabOrder = ['maturityLevel', 'detailedAnalysis', 'risksRecommendations', 'roadmap'];
        const oldIndex = tabOrder.indexOf(activeTab);
        const newIndex = tabOrder.indexOf(newTab);
        setDirection(newIndex > oldIndex ? 1 : -1);
        setActiveTab(newTab);
    };

    return (
        <div className="bg-selectBG text-gray-200 min-h-screen">
            <div className="absolute inset-0 z-0">
                <StarBackground />
            </div>
            <div className="relative z-10">
                <header className="flex items-center justify-between px-6 py-4 bg-selectBG shadow-md border-b border-[#FFFFFF33]">

                    {moduscreate}

                    <nav className="relative">
                        <ul className="flex">
                            <li
                                className="cursor-pointer text-lg font-ibm-plex-mono font-medium relative group px-3"
                                onClick={() => handleTabChange('maturityLevel')}
                            >
                                <span>Maturity Level</span>
                                <div className={`absolute bottom-[-19px] left-0 w-full h-[1px] bg-white transition-opacity ${activeTab === 'maturityLevel' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                            </li>
                            <li
                                className="cursor-pointer text-lg font-ibm-plex-mono font-medium relative group px-3"
                                onClick={() => handleTabChange('detailedAnalysis')}
                            >
                                <span>Detailed Analysis</span>
                                <div className={`absolute bottom-[-19px] left-0 w-full h-[1px] bg-white transition-opacity ${activeTab === 'detailedAnalysis' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                            </li>
                            <li
                                className="cursor-pointer text-lg font-ibm-plex-mono font-medium relative group px-3"
                                onClick={() => handleTabChange('risksRecommendations')}
                            >
                                <span>Risks & Recommendations</span>
                                <div className={`absolute bottom-[-19px] left-0 w-full h-[1px] bg-white transition-opacity ${activeTab === 'risksRecommendations' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                            </li>
                            <li
                                className="cursor-pointer text-lg font-ibm-plex-mono font-medium relative group px-3"
                                onClick={() => handleTabChange('roadmap')}
                            >
                                <span>Roadmap</span>
                                <div className={`absolute bottom-[-19px] left-0 w-full h-[1px] bg-white transition-opacity ${activeTab === 'roadmap' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                            </li>
                        </ul>
                    </nav>

                    <button className="inline-flex gap-2 font-ibm-plex-mono text-white rounded-full px-6 py-2 text-sm font-medium transition-all bg-gradient-to-r from-[#624BED] to-[#CE5682]">
                        {downloadIcon} Download Report
                    </button>

                </header>

                <main className={`mt-8 ${activeTab === "roadmap" ? "p-32 px-0" : "p-32"} relative overflow-hidden`}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={activeTab}
                            custom={direction}
                            variants={pageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={pageTransition}
                            className="w-full space-y-28"
                        >
                            {activeTab === "maturityLevel" && <MaturityLevel />}
                            {activeTab === "detailedAnalysis" && <DetailedAnalysis />}
                            {activeTab === "risksRecommendations" && <Risks />}
                            {activeTab === "roadmap" && <Roadmapc />}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* {activeTab === 'maturityLevel' &&
                    <footer className="bg-customBG text-white py-14 px-72 relative" style={{ top: '20vh' }}>
                        <div className="flex justify-between items-start">
                            <h2 className="text-3xl font-bold font-ibm-plex-mono pb-10">Sections</h2>
                            <button className="font-ibm-plex-mono bg-transparent border border-white text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-white hover:text-gray-900 transition-all">
                                View Results
                            </button>
                        </div>

                        <ul className="mt-6 space-y-10">
                            {[
                                "Contextual Information",
                                "Product Strategy and Vision",
                                "Product Development Processes and Agile Adoption",
                                "Company Culture and Leadership",
                                "Technology and Innovation",
                            ].map((section, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center text-lg font-ibm-plex-mono font-light"
                                >
                                    <span>{section}</span>

                                    <span className='flex flex-row'>
                                        <button className="flex items-center bg-selectBG text-white px-4 py-2 rounded-full text-sm transition-all font-ibm-plex-mono">
                                            Review
                                        </button>
                                        <button className='mx-5'>
                                            <svg
                                                width="13.63"
                                                height="24"
                                                viewBox="0 0 13.63 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M1 0L12.63 12L1 24L0 22.96L10.54 12L0 1.04L1 0Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </footer>
                } */}
            </div>
        </div>
    );
}

export default Dashboard;