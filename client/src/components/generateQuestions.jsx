import './landingPage.css';
import TextareaAutosize from 'react-textarea-autosize';

const GenerateQuestions = ({ questions, formData, handleInputChange, errors }) => {
    const isDropdown = questions?.type === 'select';
    const isRadio = questions?.type === 'radio';
    const isOpenEnded = questions?.type === 'open-ended';
    const isEmail = questions?.type === 'email';

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
        email: 'Get Your Personalized Product Maturity Report'
    };

    function renderQuestionText(question, id) {
        const highlightText = cornerCases[id] || id;

        if (question?.includes(highlightText)) {
            const parts = question.split(highlightText);
            return (
                <div className='mobile-s:text-2xl md:text-4xl base:text-4xl 3xl:text-6xl'>
                    {parts[0]}
                    {isEmail ? (<span className="gradient-text mobile-s:text-4xl lg:text-6xl">{highlightText}</span>
                    ) : (<span className="gradient-text">{highlightText}</span>
                    )}

                    {parts[1]}
                    {isEmail && (
                        <div className="font-ibm-plex-mono mobile-s:text-xl text-2xl font-normal text-left text-white pt-[3vh]">
                            Enter your email below to start the free assessment and receive your customized report.
                        </div>
                    )}
                </div>
            );
        } else {
            return question;
        }
    }

    return (
        <div>
            <div className={`w-full max-w-4xl ${isRadio ? 'pt-0 sm:pt-[20vh] xl:pt-[5vh] 3xl:pt-[20vh]' : 'mobile-s:pt-[10vh] 3xl:pt-[20vh]'}`}>
                <p className="font-ibm-plex-mono text-5xl font-normal leading-[62.4px] tracking-[0.75px] text-left text-gray-100 mb-4">
                    <div>
                        {renderQuestionText(questions?.question, questions?.id)}
                    </div>
                </p>

                {isDropdown && (
                    <div className="relative w-full mb-6">
                        <select
                            className="w-full bg-selectBG text-white py-3 px-4 pr-8 rounded appearance-none focus:outline-none focus-gradient sm:text-2xl font-ibm-plex-mono font-light leading-[41.6px] tracking-[0.75px] text-left"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {questions?.options?.map((option, index) => (
                            <label
                                key={index}
                                className="flex flex-col items-start cursor-pointer space-x-3 gap-1 mt-4 
                                hover:bg-[#333333] rounded-lg p-2 transition-colors duration-200"
                            >
                                <span className="flex flex-row items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={questions?.id}
                                        value={option.value}
                                        checked={formData[questions?.id] === option.value}
                                        onChange={() => handleInputChange(questions?.id, option.value)}
                                        aria-checked={formData[questions?.id] === option.value}
                                        className="relative appearance-none w-8 h-8 rounded-full border border-black bg-radioBG 
                                        hover:bg-[#565656] checked:bg-none checked:border-none
                                        checked:before:content-[''] checked:before:absolute checked:before:inset-0
                                        checked:before:bg-gradient-to-tr checked:before:from-[#624BED] checked:before:to-[#CE5682] 
                                        checked:before:rounded-full
                                        checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 
                                        checked:after:-translate-x-1/2 checked:after:-translate-y-1/2
                                        checked:after:w-4 checked:after:h-4 checked:after:bg-white checked:after:rounded-full
                                        transition duration-200"
                                    />
                                    <span className="mobile-s:text-base md:text-xl font-medium text-gray-100 -mt-0.5">
                                        {option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                                    </span>
                                </span>
                                <div className="mobile-s:text-sm md:text-sm text-gray-400 pl-7 mrg-2">
                                    {option.label}
                                </div>
                            </label>
                        ))}
                    </div>
                )}

                {isOpenEnded && (
                    <TextareaAutosize
                        id={questions?.id}
                        name={questions?.id}
                        value={formData[questions?.id] || ''}
                        onChange={(e) => handleInputChange(questions?.id, e.target.value)}
                        className="w-full border border-borderTextAreaBG rounded-lg px-4 py-2 focus:outline-none focus-gradient bg-textAreaBG font-ibm-plex-mono text-base font-light text-left text-white custom-textarea"
                        minRows={3}
                        maxRows={10}
                        placeholder="Enter your response here..."
                        aria-describedby={`${questions?.id}-desc`}
                    />
                )}

                {isEmail && (
                    <div className="w-full">
                        <input
                            type="email"
                            id={questions?.id}
                            name={questions?.id}
                            value={formData[questions?.id] || ''}
                            onChange={(e) => handleInputChange(questions?.id, e.target.value)}
                            className={`w-full border ${errors[questions?.id] ? 'border-errorRed rounded-none' : 'border-borderTextAreaBG rounded-lg'} px-4 py-2 focus:outline-none focus-gradient bg-textAreaBG font-ibm-plex-mono text-base font-light text-left text-white`}
                            placeholder="Email Address"
                            aria-describedby={`${questions?.id}-desc`}
                            required
                        />
                        {errors[questions?.id] && (
                            <p className="text-errorRed text-xl mt-5 p-2 font-ibm-plex-mono bg-errorBG inline-block">{errors[questions?.id]}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GenerateQuestions;