import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/assessment');
    };

    return (
        <div className="relative flex flex-col min-h-screen bg-customBG text-white px-4">
            <div className="flex items-center justify-between w-full p-4 lg:hidden">
                <button className="text-white text-2xl font-bold">
                    <span className="border border-white rounded-xl pt-0.5 pl-2 pr-2 pb-2">☰</span>
                </button>
                <h1 className="text-left lg:hidden w-full font-mono text-lg tracking-wide ml-2 mt-2">
                    Product{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold">
                        Maturity
                    </span>{' '}
                    Assessment
                </h1>
            </div>
            {/* Main Content Container */}
            <div className="flex flex-col items-start justify-start flex-grow w-full max-w-4xl mx-auto lg:max-w-[1124px] lg:max-h-[500px] gap-10 lg:gap-[124px] pt-60 md:pt-72 lg:pt-80 xl:pt-96 pt-w415 pt-w400 pt-h80 px-1">
                {/* Heading and Description */}
                <div className="w-full max-w-full flex flex-col gap-4 lg:gap-10">
                    <h1 className="hidden lg:block font-mono font-normal text-2xl lg:text-3xl xl:text-[36px] leading-tight lg:leading-snug xl:leading-[46.8px] tracking-wide">
                        Product Maturity Assessment
                    </h1>
                    <p className="font-mono font-light text-3xl lg:text-4xl xl:text-[48px] leading-tight lg:leading-snug xl:leading-[62.4px] tracking-wide">
                        Let’s embark on a journey to uncover your{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold">
                            product’s full potential!
                        </span>{' '}
                        🚀
                    </p>
                </div>
            </div>

            {/* Desktop version of the button in content flow */}
            <div className="hidden lg:flex w-full max-w-[1124px] items-start mx-auto pt-44">
                <button
                    onClick={handleStart}
                    className="flex items-center justify-start text-white font-mono font-normal text-lg lg:text-[20px] leading-snug lg:leading-[26px] tracking-wide group"
                >
                    Let's go!
                    <span className="flex items-center justify-center w-10 h-10 lg:w-[64px] lg:h-[64px] border border-white rounded-lg ml-3 lg:ml-5 transform transition-transform duration-300 group-hover:translate-x-1">
                        ➡️
                    </span>
                </button>
            </div>

            {/* Mobile Button Positioned Bottom-Right */}
            <div className="lg:hidden fixed bottom-4 right-4">
                <button
                    onClick={handleStart}
                    className="flex items-center h-12 px-5 text-white font-mono font-normal text-lg leading-snug tracking-wide hover:bg-white hover:text-gray-900 transition-colors duration-300 ease-in-out rounded-lg"
                >
                    Let's go!
                    <span className="flex items-center justify-center w-10 h-10 border border-white rounded-lg ml-2">
                        ➡️
                    </span>
                </button>
            </div>
        </div>
    );
}

export default LandingPage;
