import react from 'react';
import './landingPage.css';

const GenerateQuestions = ({ questions, currentQuestionIndex, insideCurrentQuestionIndex, formData, handleInputChange }) => {
    console.log('GenerateQuestions:', questions, currentQuestionIndex, insideCurrentQuestionIndex, formData);
    const isDropdown = questions?.type === 'select';
    const isRadio = questions?.type === 'radio';

    const cornerCases = {
        organizationType: "type of organization",
        strategyQ1: "product strategy",
        strategyQ2: "frequently",
        strategyQ3: "measure the success",
        strategyQ4: "customer needs and market trends",
        strategyQ5: "conflicting priorities",
        strategyQ6: "highest paid person's opinion (HiPPO)",
        processesQ1: "product development methodology",
        processesQ2: "followed",
        processesQ3: "retrospectives or reviews",
        processesQ4: "collaboration and communication",
        processesQ5: "Agile principles",
        processesQ6: "waterfall",
        technologyQ1: "technology infrastructure",
        technologyQ2: "CI/CD (Continuous Integration/Continuous Deployment)",
        technologyQ3: "rapid prototyping and experimentation",
        technologyQ4: "automation",
        technologyQ5: "outdated technologies",
        technologyQ6: "scalability or future growth",
        cultureQ1: "aligned",
        cultureQ2: "innovation and experimentation",
        cultureQ3: "customer-centric",
        cultureQ4: "culture of ownership",
        cultureQ5: "discouraged from experimenting",
        cultureQ6: "risk aversion",
        openEndedQ1: "biggest challenges",
        openEndedQ2: "improvements",
        openEndedQ3: "development success",
        openEndedQ4: "gather and use customer feedback",
    };

    function renderQuestionText(question, id) {
        const highlightText = cornerCases[id] || id; // Use the corner case text if available, otherwise use id

        if (question?.includes(highlightText)) {
            const parts = question.split(highlightText);
            return (
                <>
                    {parts[0]}
                    <span className="gradient-text">{highlightText}</span>
                    {parts[1]}
                </>
            );
        } else {
            return question;
        }
    }


    return (
        <div>
            <div className="w-full max-w-4xl pt-60 md:pt-72 lg:pt-80 xl:pt-96 pt-w415 pt-w400 pt-h80 px-1">
                <p className="font-ibm-plex-mono text-5xl font-normal leading-[62.4px] tracking-[0.75px] text-left text-gray-100 mb-4">
                    <div>
                        {renderQuestionText(questions?.question, questions?.id)}
                    </div>
                </p>

                {isDropdown && (
                    <div className="relative w-full mb-6">
                        <select
                            className="w-full bg-selectBG text-white py-3 px-4 pr-8 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-2xl font-ibm-plex-mono font-light leading-[41.6px] tracking-[0.75px] text-left"
                            defaultValue={questions?.options?.[0]?.value}
                            value={formData[questions?.id || '']}
                            id={questions?.id}
                            name={questions?.id}
                            onChange={(e) => handleInputChange(questions?.id, e.target.value)}
                        >
                            {questions?.options?.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                )}


                {isRadio && (
                    <div className="grid grid-cols-2 gap-4">
                        {questions?.options?.map((option, index) => (
                            <label
                                key={index}
                                className="flex flex-col items-start cursor-pointer space-x-3 gap-1 mt-4"
                            >
                                <span className="flex flex-row items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={questions?.id}
                                        value={option.value}
                                        checked={formData[questions?.id] === option.value}
                                        onChange={() => handleInputChange(questions?.id, option.value)}
                                        aria-checked={formData[questions?.id] === option.value}
                                        className="appearance-none w-8 h-8 rounded-full border border-black bg-radioBG hover:bg-gray-500 checked:bg-black transition duration-200"
                                    />
                                    <span className="text-xl font-medium text-gray-100">
                                        {option.value}
                                    </span>
                                </span>
                                <div className="text-sm text-gray-400 pl-7 mrg-2">
                                    {option.label}
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GenerateQuestions;