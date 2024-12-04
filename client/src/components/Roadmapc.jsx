import React, { useState, useRef } from 'react';
import './landingPage.css';
import GoalCard from './GoalCard';

const interpolateColor = (color1, color2, factor) => {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
    }
    return result;
};

const interpolateColors = (color1, color2, steps) => {
    const stepFactor = 1 / (steps - 1);
    const interpolatedColorArray = [];

    color1 = color1.match(/\w\w/g).map((c) => parseInt(c, 16));
    color2 = color2.match(/\w\w/g).map((c) => parseInt(c, 16));

    for (let i = 0; i < steps; i++) {
        interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray.map((color) => `rgb(${color.join(',')})`);
};

const gradientColors = interpolateColors('#624BED', '#CE5682', 100);

const goalCards = [
    {
        phase: 1,
        goal: "Strategy Alignment Goal",
        title: "Define clear product strategy",
        milestone: "Strategy Milestone",
        milestoneTitle: "Strategy Workshop conducted",
        question: "Need help defining your product strategy?",
        answer: "Modus facilitates workshops to help you create a winning product strategy aligned with your business goals. We'll guide you through a proven process to define your target audience, value proposition, and roadmap to success."
    },
    {
        phase: 2,
        goal: "Process Optimization Goal",
        title: "Implement Agile methodologies",
        milestone: "Processes Milestone",
        milestoneTitle: "Agile framework adopted",
        question: "Struggling with Agile implementation?",
        answer: "Modus facilitates workshops to help you create a winning product strategy aligned with your business goals. We'll guide you through a proven process to define your target audience, value proposition, and roadmap to success."
    },
    {
        phase: 3,
        goal: "Technology Upgrade Goal",
        title: "Modernize tech stack and implement CI/CD",
        milestone: "Technology Milestone",
        milestoneTitle: "CI/CD fully integrated",
        question: "Need to modernize your technology?",
        answer: "Modus facilitates workshops to help you create a winning product strategy aligned with your business goals. We'll guide you through a proven process to define your target audience, value proposition, and roadmap to success."
    },
    {
        phase: 4,
        goal: "Cultural Transformation Goal",
        title: "Foster ownership and empowerment",
        milestone: "Culture Milestone",
        milestoneTitle: "Innovation culture established",
        question: "Ready to build a customer-centric culture?",
        answer: "Modus facilitates workshops to help you create a winning product strategy aligned with your business goals. We'll guide you through a proven process to define your target audience, value proposition, and roadmap to success."
    }
];

const Roadmapc = () => {
    const [hoveredPhase, setHoveredPhase] = useState(null);
    const totalLines = 100;
    const lineWidth = 20;
    const lineMargin = 10;
    const containerWidth = totalLines * (lineWidth + lineMargin);
    const scrollContainerRef = useRef(null);

    const handleMouseDown = (e) => {
        const scrollContainer = scrollContainerRef.current;
        scrollContainer.isDown = true;
        scrollContainer.startX = e.pageX - scrollContainer.offsetLeft;
        scrollContainer.scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
        const scrollContainer = scrollContainerRef.current;
        scrollContainer.isDown = false;
    };

    const handleMouseUp = () => {
        const scrollContainer = scrollContainerRef.current;
        scrollContainer.isDown = false;
    };

    const handleMouseMove = (e) => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer.isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - scrollContainer.startX);
        scrollContainer.scrollLeft = scrollContainer.scrollLeft - walk;
    };

    return (
        <>
            <div className="flex items-center gap-4 pr-32 pl-32">
                <span className='text-left block text-8xl font-bold gradient-color-text font-ibm-plex-mono'>
                    Transformative Journey Roadmap
                </span>
                <div className="flex gap-2 place-self-end">
                    <button className="w-24 h-16 sm:w-16 sm:h-16 rounded-full bg-[#ffffff10] flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <button className="w-24 h-16 sm:w-16 sm:h-16 rounded-full bg-[#ffffff10] flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto scrollbar-hide pl-32"
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <div className="relative" style={{ width: `${containerWidth}px` }}>

                    <div className="relative h-[100px] mb-12">
                        <div className="absolute top-0 left-0 right-0 h-full flex">
                            {[...Array(totalLines)].map((_, index) => {
                                const color = gradientColors[index];
                                return (
                                    <div
                                        key={index}
                                        className="relative h-full"
                                        style={{ width: `${lineWidth}px`, marginRight: `${lineMargin}px` }}
                                    >
                                        <div
                                            className="absolute top-0 left-0 w-[2px] h-full"
                                            style={{
                                                background: color,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Phase markers */}
                        {[1, 2, 3, 4].map((phase, index) => (
                            <div
                                key={phase}
                                className="absolute top-5 text-white"
                                style={{ left: `${(index * 25.5)}%` }}
                                onMouseEnter={() => {
                                    setHoveredPhase(phase)
                                }}
                                onMouseLeave={() => setHoveredPhase(null)}
                            >
                                <div className={`items-center bg-black px-4 py-2 gradient-border-card-always rounded-full text-white text-sm my-2 font-ibm-plex-mono ${hoveredPhase === phase ? 'hover' : ''}`}>
                                    Phase {phase}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cards container */}
                    <div className="grid grid-cols-4 gap-8">
                        {goalCards.map((card, index) => (
                            <GoalCard
                                key={index}
                                goal={card.goal}
                                title={card.title}
                                milestone={card.milestone}
                                milestoneTitle={card.milestoneTitle}
                                question={card.question}
                                answer={card.answer}
                                hovered={hoveredPhase === card.phase}
                                onMouseEnter={() => setHoveredPhase(card.phase)}
                                onMouseLeave={() => setHoveredPhase(null)} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Roadmapc;
