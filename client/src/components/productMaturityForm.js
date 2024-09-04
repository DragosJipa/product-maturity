// client/src/components/productMaturityForm.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import GeneralQuestions from './generalQuestions';
import DimensionQuestions from './dimensionQuestions';
import OpenEndedQuestions from './openEndedQuestions';
import { populateDummyResponses, submitFormData } from '../utils/formUtils';
import { AssessmentContext } from '../context/assessmentContext'; // Import AssessmentContext

function ProductMaturityForm() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData } = useContext(AssessmentContext); // Use context to get and set assessment data

  useEffect(() => {
    axios.get('http://localhost:3001/api/questions')
      .then(response => {
        setQuestions(response.data);

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
  }, [assessmentData]); // Depend on assessmentData to reset form when it's cleared

  const handleInputChange = (questionId, value) => {
    setFormData({
      ...formData,
      [questionId]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setLoading(true);
      submitFormData(
        formData,
        () => {},
        (response) => {
          setLoading(false);
          // Update the context with both interpretation and detailedReport
          setAssessmentData({ 
            interpretation: response.interpretation, 
            detailedReport: response.detailedReport, 
            responses: formData 
          });
          navigate('/summary');
        },
        (error) => {
          console.error('Submission error:', error);
          setError('Failed to submit responses. Please try again later.');
          setLoading(false);
        }
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handlePopulateDummyResponses = () => {
    const dummyData = populateDummyResponses(questions);
    setFormData(dummyData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        Processing responses...
      </div>
    );
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
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        Loading questions...
      </div>
    );
  }

  const currentSection = questions[currentQuestionIndex];
  const isGeneral = currentSection.type === "general";
  const isDimension = currentSection.type === "dimension";
  const isOpenEnded = currentSection.type === "open-ended";

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl hover:shadow-2xl rounded-2xl p-8 max-w-2xl w-full transition-shadow duration-300 ease-in-out relative">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-3xl font-extrabold text-gray-800 cursor-pointer"
            onClick={handlePopulateDummyResponses}
          >
            Product Maturity Assessment
          </h1>
        </div>

        <div className="w-full bg-gray-300 rounded-full h-2.5 mb-6">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {isGeneral && (
          <GeneralQuestions
            questions={currentSection.questions}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}
        {isDimension && (
          <DimensionQuestions
            questions={currentSection.questions}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}
        {isOpenEnded && (
          <OpenEndedQuestions
            questions={currentSection.questions}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}

        <div className={`flex mt-6 ${currentQuestionIndex === 0 ? 'justify-end' : 'justify-between'}`}>
          {currentQuestionIndex > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="flex items-center bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'} <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductMaturityForm;
