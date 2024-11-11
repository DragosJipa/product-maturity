import React, { useState, useEffect, useContext, lazy } from 'react';
import axios from 'axios';
import { populateDummyResponses } from '../utils/formUtils';
import { useCheckProcessingStatus } from '../utils/formUtils';
import { AssessmentContext } from '../context/assessmentContext'; // Import AssessmentContext
import LoadingSpinner from './loadingSpinner';
import './productMaturity.css';
import './landingPage.css'
import { useNavigate } from 'react-router-dom';
import GenerateQuestions from './generateQuestions';

const ProductMaturityAssessment = () => {
    const navigate = useNavigate();

    const backToStart = () => {
        navigate('/');
    };

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [insideCurrentQuestionIndex, setInsideCurrentQuestionIndex] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { assessmentData, setAssessmentData } = useContext(AssessmentContext); // Use context to get and set assessment data
    const [isSubmitted, setIsSubmitted] = useState(false); // Keep track of whether the form is submitted
    const { checkProcessingStatus } = useCheckProcessingStatus(); // Use the new hook
    // Dynamically determine the base URL
    const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '';

    useEffect(() => {
        axios.get(`${baseURL}/api/questions`)
            .then(response => {
                setQuestions(response.data);
                console.log('Questions:', response.data);
                // Check if there is existing data in the context
                if (assessmentData && assessmentData.responses) {
                    setFormData(assessmentData.responses);
                } else {
                    setFormData({}); // Reset form data to empty if no existing data
                }
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                setError('Failed to load questions. Please try again later.');
            });
    }, [assessmentData, baseURL]);

    useEffect(() => {
        if (isSubmitted) {
            const taskId = assessmentData?.taskId;
            if (taskId) {
                checkProcessingStatus(taskId); // Use the hook to check processing status
            }
        }
    }, [isSubmitted, assessmentData, checkProcessingStatus]);

    const handleInputChange = (questionId, value) => {
        setFormData({
            ...formData,
            [questionId]: value,
        });
        if (window._hsq) {
            console.log('window._hsq:', window._hsq);
            window._hsq.push(['trackEvent', {
                id: questionId,
                value: value,
            }]);
        }
    };

    const handleNext = () => {
        const isLastInnerQuestion = questions[currentQuestionIndex].questions.length - 1 === insideCurrentQuestionIndex;
        const isLastMainQuestion = currentQuestionIndex >= questions.length - 1;

        if (!isLastMainQuestion) {
            if (isLastInnerQuestion) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setInsideCurrentQuestionIndex(0);
            } else {
                setInsideCurrentQuestionIndex(insideCurrentQuestionIndex + 1);
            }
        } else {
            setLoading(true);  // Keep loading until backend confirms submission
            axios.post(`${baseURL}/api/submit`, formData)
                .then(response => {
                    setIsSubmitted(true);
                    setAssessmentData({
                        ...assessmentData,
                        responses: formData, // Store the form responses in context
                        taskId: response.data.taskId, // Save the taskId from the server
                    });

                    // Remove setLoading(false) here since we still need to wait for the processing status
                    // Polling for processing status now
                    const taskId = response.data.taskId;
                    checkProcessingStatus(taskId);  // This will handle the state updates
                })
                .catch(error => {
                    console.error('Submission error:', error);
                    setError('Failed to submit responses. Please try again later.');
                    setLoading(false); // Stop spinner in case of error
                });
        }
    };


    const handlePrevious = () => {
        if (currentQuestionIndex === 0 && insideCurrentQuestionIndex === 0) {
            backToStart();
            return;
        }

        if (insideCurrentQuestionIndex > 0) {
            setInsideCurrentQuestionIndex(insideCurrentQuestionIndex - 1);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setInsideCurrentQuestionIndex(questions[currentQuestionIndex - 1].questions.length - 1);
        }
    };

    const handlePopulateDummyResponses = () => {
        const dummyData = populateDummyResponses(questions);
        setFormData(dummyData);
    };


    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
                {error}
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-300 bg-customBG">
                Loading questions...
            </div>
        );
    }

    const currentSection = questions[currentQuestionIndex].questions[insideCurrentQuestionIndex];
    console.log('Current Section:', currentSection);

    return (
        <div className="flex flex-col items-start justify-start h-screen bg-customBG text-white p-4 px-32">
            {/* Top navigation */}
            <div className="w-full max-w-md mt-8 mb-8">
                <div className="text-xs text-gray-400 flex items-center space-x-2">
                    <button className="w-[32px] h-[32px] flex items-center justify-center" onClick={handlePrevious}>
                        <svg
                            width="13.63"
                            height="24"
                            viewBox="0 0 13.63 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12.63 24L1 12L12.63 0L13.63 1.04L3.09 12L13.63 22.96L12.63 24Z"
                                fill="white"
                            />
                        </svg>
                    </button>
                    <div>
                        <span className="font-ibm-plex-mono text-sm font-normal leading-[31.2px] tracking-[0.75px] text-left"
                            onClick={handlePopulateDummyResponses}
                        >
                            Product Maturity Assessment
                        </span>
                        <h1 className="text-2xl font-semibold gradient-text">1. Contextual Information</h1>
                    </div>
                </div>
            </div>

            <GenerateQuestions
                questions={currentSection}
                formData={formData}
                currentQuestionIndex={currentQuestionIndex}
                insideCurrentQuestionIndex={insideCurrentQuestionIndex}
                handleInputChange={handleInputChange}
            />

            {/* Bottom progress indicator */}
            <div className="w-full max-w-5xl flex justify-between items-center pt-[clamp(2rem,10vh,6rem)]">
                {/* Dynamic Dots */}
                <div className="flex space-x-2">
                    {[...Array(questions[currentQuestionIndex].questions.length)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                // If clicking forward
                                if (index > insideCurrentQuestionIndex) {
                                    for (let i = insideCurrentQuestionIndex; i < index; i++) {
                                        handleNext();
                                    }
                                }
                                // If clicking backward
                                else if (index < insideCurrentQuestionIndex) {
                                    for (let i = insideCurrentQuestionIndex; i > index; i--) {
                                        handlePrevious();
                                    }
                                }
                            }}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === insideCurrentQuestionIndex
                                ? 'w-8 bg-white' // Elongated white dot for selected
                                : 'w-2 bg-gray-600 hover:bg-gray-400' // Regular circular dot for others with hover state
                                }`}
                        ></button>
                    ))}
                </div>

                {/* Button at the end */}
                <div>
                    <button
                        onClick={handleNext}
                        className="flex items-center h-12 px-5 text-white font-mono font-normal text-lg leading-snug tracking-wide hover:bg-white hover:text-gray-900 transition-colors duration-300 ease-in-out rounded-lg"
                    >
                        Continue
                        <span className="flex items-center justify-center w-10 h-10 border border-white rounded-lg ml-2">
                            ➡️
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductMaturityAssessment;
