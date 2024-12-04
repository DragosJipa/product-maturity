import React from 'react';
import MaturityLevelCard from './MaturityLevelCard';
import MetricCard from './MetricCard';

const MaturityLevel = () => {
    return (
        <>
            <div className="text-left">
                <span className='block text-8xl font-bold gradient-color-text font-ibm-plex-mono'>
                    Understanding Your
                </span>
                <span className='block text-8xl font-bold gradient-color-text font-ibm-plex-mono'>
                    Product's Maturity
                </span>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap gap-12">
                <div className="flex-1 flex justify-center">
                    <MaturityLevelCard
                        level={2}
                        description="Based on the responses gathered from the product maturity assessment, the organization shows signs of operating at a relatively early maturity level, characterized by partial definition and alignment in its product strategy, processes that are inconsistently followed with limited collaboration, a technology infrastructure that is partially modernized, and a culture that lacks empowerment and customer-centric focus."
                    />
                </div>

                <div className="flex-1">
                    <div className="bg-cardBG rounded-2xl p-5 shadow-md mb-6">
                        <h3 className="text-2xl font-ibm-plex-mono flex items-center text-white/75">Metric Levels</h3>
                    </div>
                    <section className="grid grid-cols-1 min-[1000px]:grid-cols-2 gap-6">
                        <MetricCard title="Strategy" value="1" label="Repeatable" />
                        <MetricCard title="Processes" value="3.8" label="Initial" />
                        <MetricCard title="Technology" value="2" label="Repeatable" />
                        <MetricCard title="Culture" value="4.5" label="Initial" />
                    </section>
                </div>
            </div>
        </>
    );
};

export default MaturityLevel;