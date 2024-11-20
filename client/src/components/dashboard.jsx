import React from 'react';
import MaturityLevelCard from './MaturityLevelCard';
import MetricCard from './MetricCard';
import './landingPage.css';

const Dashboard = () => {
    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-lg font-bold">MODUS</h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li className="cursor-pointer hover:text-purple-400">Maturity Level</li>
                        <li className="cursor-pointer hover:text-purple-400">Detailed Analysis</li>
                        <li className="cursor-pointer hover:text-purple-400">
                            Risks & Recommendations
                        </li>
                        <li className="cursor-pointer hover:text-purple-400">Roadmap</li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main className="mt-8 p-20 ">
                <div className="text-left">
                    <span className='block text-8xl font-bold gradient-color-text font-ibm-plex-mono'>
                        Understanding Your
                    </span>
                    <span className='block text-8xl font-bold gradient-color-text font-ibm-plex-mono'>
                        Product's Maturity
                    </span>
                </div>
                <div className="flex flex-wrap lg:flex-nowrap gap-12">
                    {/* Maturity Level Card */}
                    <div className="flex-1 flex justify-center">
                        <MaturityLevelCard
                            level={2}
                            description="Based on the responses gathered from the product maturity assessment, the organization shows signs of operating at a relatively early maturity level, characterized by partial definition and alignment in its product strategy, processes that are inconsistently followed with limited collaboration, a technology infrastructure that is partially modernized, and a culture that lacks empowerment and customer-centric focus."
                        />
                    </div>

                    {/* Metrics Section */}
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-4">Metric Levels</h3>
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MetricCard title="Strategy" value="2" label="Repeatable" />
                            <MetricCard title="Processes" value="1.8" label="Initial" />
                            <MetricCard title="Technology" value="2" label="Repeatable" />
                            <MetricCard title="Culture" value="2.5" label="Initial" />
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;