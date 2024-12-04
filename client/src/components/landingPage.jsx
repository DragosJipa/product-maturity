import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarBackground from './StarBackground';
import './landingPage.css';
import Step from './Step';
import {
    handDrawnUnnderlines, step1, step2, step3, step4, step5, step6,
    handDrawnAccents, handDrownArrow, planet, planet2, planet3 as lines
} from '../utils/icons';

const stepsData = [
    {
        title: "Step 1",
        icon: (
            step1
        ),
        text: "Answer a few key questions about your product."
    },
    {
        title: "Step 2",
        icon: (
            step2
        ),
        text: "Our AI algorithms analyze your responses to determine your product's maturity level."
    },
    {
        title: "Step 3",
        icon: (
            step3
        ),
        text: "Get a personalized report with targeted recommendations and strategies for improvement."
    },
    {
        icon: (
            step4
        ),
        text: "Modus Create experts can help you implement the recommendations from your assessment."
    },
    {
        icon: (
            step5
        ),
        text: 'We provide guidance on strategy, process optimization, technology upgrades, and cultural transformation.'
    },
    {
        icon: (
            step6
        ),
        text: 'Our team can help you build a roadmap for success and achieve your product goals faster.'
    }
];

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className='bg-selectBG min-h-screen'>
            <div className="text-white p-8 bg-selectBG min-h-screen">
                <div className="absolute inset-0 z-0">
                    <StarBackground />
                </div>

                <div className="absolute " style={{ bottom: '-54.9rem', left: '35rem' }}>
                    <div className="absolute inset-0">
                        {planet2}
                    </div>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 mask-image">
                            {lines}
                        </div>
                    </div>
                </div>

                <main className='relative overflow-hidden flex flex-col items-center justify-center px-80 font-ibm-plex-mono text-gray-200'>
                    <div className='px-72'>

                        <span className='text-left text-8xl font-bold gradient-color-text font-ibm-plex-mono'>
                            Accelerate Product Growth with AI-Powered Insights
                        </span>
                        <p className='text-left text-3xl font-ibm-plex-mono pt-14 pr-60'>
                            Feeling stuck in your product's journey? Unsure of the next steps to drive growth and innovation?
                        </p>

                        <div className='flex justify-between pt-14'>
                            <div className='w-1/2'>
                                <p className='text-left text-2xl font-ibm-plex-mono mb-10'>
                                    Our AI-powered product maturity assessment analyzes your product strategy, processes, technology, and culture to identify areas for improvement. Receive a customized roadmap with actionable recommendations to optimize your product development lifecycle.
                                </p>
                                <div className="flex justify-start">
                                    <button
                                        onClick={() => navigate('/start')}
                                        className="inline-flex items-center gap-2 font-ibm-plex-mono text-white rounded-full px-6 py-2 text-2xl font-medium transition-all bg-gradient-to-r from-[#624BED] to-[#CE5682]">
                                        Take the Free Assessment
                                    </button>
                                </div>
                            </div>
                            <div className='w-1/2'>
                                <div className='w-100 h-80 bg-blackBox rounded-2xl'></div>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <div className="mt-16">
                            <div className="flex justify-center">
                                <p className='gradient-color-text font-ibm-plex-mono text-xl font-semibold'>
                                    How it works
                                </p>
                            </div>
                            <h2 className="text-4xl font-bold text-center mb-12 mt-6" style={{ lineHeight: '62.4px', letterSpacing: -0.75 }}>
                                Get Your Product Maturity <br />
                                <div className="inline-flex flex-col items-center">
                                    Score in Minutes
                                    <span className="relative inline-flex flex-col items-center">
                                        <span className="absolute pl-40">{handDrawnUnnderlines}</span>
                                    </span>
                                </div>
                            </h2>
                            <div className="grid grid-cols-1 large:grid-cols-3 gap-8">
                                {stepsData.slice(0, 3).map((step, index) => (
                                    <Step key={index} title={step.title} icon={step.icon} text={step.text} />
                                ))}
                            </div>
                            <div className='absolute -mt-10' style={{ right: '42rem' }}>
                                {handDrownArrow}
                            </div>
                            <div className='absolute -mt-10' style={{ right: '42rem' }}>
                                {handDrawnAccents}
                            </div>
                        </div>

                        <div className="mt-24 text-center">
                            <div className="flex justify-center">
                                <p className='gradient-color-text font-ibm-plex-mono text-xl font-semibold'>
                                    How Modus Can Help
                                </p>
                            </div>

                            <h2 className="text-4xl font-bold text-center mb-12 mt-6" style={{ lineHeight: '62.4px', letterSpacing: -0.75 }}>
                                Partner with Modus Create to <br />
                                Achieve Product Excellence
                            </h2>
                            <div className="grid grid-cols-1 large:grid-cols-3 gap-8">
                                {stepsData.slice(3, 6).map((step, index) => (
                                    <Step key={index} icon={step.icon} text={step.text} />
                                ))}
                            </div>
                        </div>
                        <div className="mt-44 text-center">
                            <div className="flex justify-center">
                                <p className='gradient-color-text font-ibm-plex-mono text-xl font-semibold'>
                                    How Modus Can Help
                                </p>
                            </div>
                            <h2 className="text-4xl font-bold text-center mb-12 mt-6" style={{ lineHeight: '62.4px', letterSpacing: -0.75 }}>
                                Ready to Take Action?
                            </h2>
                            <div className="flex justify-center gap-4">

                                <button
                                    onClick={() => navigate('/start')}
                                    className="inline-flex items-center gap-2 font-ibm-plex-mono text-white rounded-full px-6 py-2 text-xl font-medium transition-all bg-gradient-to-r from-[#624BED] to-[#CE5682]">
                                    Take the Free Assessment
                                </button>
                                <button
                                    className="border border-white hover:border-white text-white px-6 py-3 rounded-full transition duration-300"
                                >
                                    Talk to an Expert
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

            </div>

            <footer className="mt-[65px]">
                <div className="bg-[#161616] px-8 py-12">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 large:grid-cols-5 gap-8">
                        <div>
                            <h4 className="text-white font-semibold mb-4">What We Do</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Digital Strategy</li>
                                <li>Platform & Cloud</li>
                                <li>Product Development</li>
                                <li>Digital Operations</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Our Partners</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Atlassian</li>
                                <li>AWS</li>
                                <li>GitLab</li>
                                <li>Ionic</li>
                                <li>Other Partners</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Who We Are</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Our Story</li>
                                <li>Careers</li>
                                <li>Open Source</li>
                                <li>Our Work</li>
                                <li>Contact Us</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Our Resources</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Blog</li>
                                <li>Innovation Podcast</li>
                                <li>Guides & Playbooks</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Get Weekly Digital Transformation Insights</h4>
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full px-4 py-2 bg-[#232323] rounded-md text-white text-sm border border-gray-700 focus:outline-none focus:border-purple-500"
                                />
                                <button className="px-6 py-2 bg-gradient-to-r from-[#624BED] to-[#CE5682] text-white rounded-full text-sm hover:opacity-90 transition duration-300">
                                    Stay Informed
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#121212] px-8 py-6">
                    <div className="max-w-7xl mx-auto flex flex-col large:flex-row justify-between items-center space-y-4 large:space-y-0">
                        <div className="flex items-center space-x-6">
                            <svg width="109" height="20" viewBox="0 0 109 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M98.552 5.72083C98.552 5.1709 98.755 4.72803 99.1573 4.39215C99.5633 4.05627 100.113 3.88654 100.814 3.88654C102.553 3.88654 104.236 4.51025 105.867 5.75775L107.989 2.66486C107.059 1.86768 105.967 1.255 104.712 0.819519C103.461 0.387695 102.206 0.169922 100.951 0.169922C99.0318 0.169922 97.4337 0.660767 96.153 1.63513C94.8723 2.61322 94.2302 3.99725 94.2302 5.79834C94.2302 7.59943 94.7358 8.91699 95.7471 9.75848C96.7583 10.6 98.3601 11.2828 100.545 11.8069C101.925 12.1538 102.848 12.4897 103.313 12.8255C103.778 13.1577 104.011 13.6117 104.011 14.1801C104.011 14.7484 103.793 15.1987 103.354 15.5345C102.914 15.8704 102.309 16.0365 101.538 16.0365C99.818 16.0365 97.9467 15.1433 95.9205 13.3533L93.4219 16.4462C95.8024 18.6717 98.4819 19.7826 101.457 19.7826C103.516 19.7826 105.181 19.2548 106.443 18.1956C107.705 17.1364 108.336 15.7597 108.336 14.0582C108.336 12.3568 107.842 11.0651 106.856 10.1793C105.871 9.29346 104.487 8.62915 102.704 8.18622C100.922 7.74335 99.7811 7.3595 99.2902 7.03473C98.7993 6.70996 98.552 6.27075 98.552 5.72083Z" fill="white" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M43.1667 17.0069C41.1885 18.8818 38.7526 19.8192 35.8591 19.8192C32.9655 19.8192 30.5296 18.8818 28.5513 17.0069C26.5731 15.132 25.584 12.8031 25.584 10.0129C25.584 7.22266 26.5731 4.8938 28.5513 3.01892C30.5296 1.14398 32.9655 0.206543 35.8591 0.206543C38.7526 0.206543 41.1885 1.14398 43.1667 3.01892C45.145 4.8938 46.1341 7.22266 46.1341 10.0129C46.1341 12.7994 45.145 15.132 43.1667 17.0069ZM41.683 10.0276C41.683 8.33362 41.1221 6.8905 40.0038 5.6947C38.8855 4.4989 37.5089 3.901 35.8738 3.901C34.2388 3.901 32.8658 4.4989 31.7438 5.6947C30.6255 6.8905 30.0646 8.33362 30.0646 10.0276C30.0646 11.7217 30.6255 13.1611 31.7438 14.3458C32.8622 15.5306 34.2388 16.1248 35.8738 16.1248C37.5089 16.1248 38.8818 15.5306 40.0038 14.3458C41.1221 13.1574 41.683 11.718 41.683 10.0276Z" fill="white" />
                                <path d="M16.542 7.61395L11.5484 19.2398H9.09033L4.12256 7.61395V19.2398H0V0.767578H5.57672L10.3341 12.4488L15.1173 0.767578H20.6682V19.2398H16.5457V7.61395H16.542Z" fill="white" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M67.9683 9.90936C67.9683 7.03796 67.0604 4.79767 65.2408 3.18481C63.4213 1.57562 60.8119 0.767334 57.4053 0.763672H50.666V19.2359H57.1876C60.8267 19.2359 63.532 18.4018 65.3073 16.7262C67.0825 15.0543 67.9683 12.7808 67.9683 9.90936ZM63.687 10.0164C63.687 11.8323 63.1629 13.2126 62.1184 14.1648C61.0703 15.117 59.5755 15.5931 57.6305 15.5931H54.9288V4.36218H57.302C59.4684 4.36218 61.0703 4.84937 62.1184 5.82739C63.1629 6.80542 63.687 8.20056 63.687 10.0164Z" fill="white" />
                                <path d="M77.8679 14.8772C78.5728 15.7335 79.5213 16.1579 80.7134 16.1579C81.9055 16.1579 82.8467 15.7298 83.5443 14.8772C84.2381 14.0247 84.5887 12.8547 84.5887 11.3747V0.782227H88.8146V11.5076C88.8146 14.1871 88.058 16.2428 86.5411 17.6785C85.0242 19.1142 83.0829 19.8302 80.7171 19.8302C78.3513 19.8302 76.4063 19.1068 74.882 17.6638C73.3577 16.2206 72.5938 14.1686 72.5938 11.5076V0.782227H76.8196V11.3747C76.8123 12.8584 77.1629 14.0247 77.8679 14.8772Z" fill="white" />
                            </svg>

                            <span className="text-sm text-gray-400">© 2023 Modus Create, LLC</span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <a href="#" className="hover:text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-white">Sitemap</a>
                            <div className="flex items-center space-x-4">
                                <a href="#" className="hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544A8.127 8.127 0 0 1 5.5 16.898a5.778 5.778 0 0 0 4.252-1.189 2.879 2.879 0 0 1-2.684-1.995 2.88 2.88 0 0 0 1.298-.049c-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359a2.877 2.877 0 0 1-.889-3.835 8.153 8.153 0 0 0 5.92 3.001 2.876 2.876 0 0 1 4.895-2.62 5.73 5.73 0 0 0 1.824-.697 2.884 2.884 0 0 1-1.263 1.589 5.73 5.73 0 0 0 1.649-.453 5.85 5.85 0 0 1-1.433 1.489z" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
