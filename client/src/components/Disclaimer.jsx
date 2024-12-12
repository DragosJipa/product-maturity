import './landingPage.css';
import { useNavigate } from 'react-router-dom';

const Disclaimer = () => {
    const navigate = useNavigate();
    const handleReturn = () => {
        navigate('/start');
    }
    return (
        <div className='min-h-screen bg-startBG text-white font-ibm-plex-mono text-disclaimerTextBG md:px-20 md:py-14 mobile-s:px-4 mobile-s:py-4 '>
            <span className='flex flex-row align-center justify-between'>
                <h1 className='mobile-s:text-2xl md:text-4xl font-semibold'>
                    Disclaimer
                </h1>
                <img src='./x.svg' alt='x' className='cursor-pointer mobile-s:w-8 md:w-10' onClick={handleReturn} />
            </span>
            <div className='space-y-4 mt-6'>
                <h3 className='mobile-s:text-base md:text-xl font-bold'>
                    Please read this disclaimer carefully before using this assessment.
                </h3>
                <p className='mobile-s:text-sm md:base'>
                    By proceeding with this assessment and submitting any information through this platform, you acknowledge and agree to the following:
                </p>
                <h3 className='mobile-s:text-base md:text-xl font-bold'>
                    Data Processing and AI Utilization:
                </h3>
                <p className='mobile-s:text-sm md:base'>
                    You understand and consent to the processing of your data by automated systems, including artificial intelligence (AI) models and algorithms (e.g., OpenAI, Google AI). This processing may involve analyzing your responses, generating personalized feedback, and conducting research to improve the assessment's efficacy.

                    While we employ industry-standard security measures to protect your data during transmission and storage, you acknowledge that no method of electronic transmission or storage is completely secure. We cannot guarantee the absolute security of your data against unauthorized access, use, alteration, or disclosure.
                </p>
                <h3 className='mobile-s:text-base md:text-xl font-bold'>
                    User Responsibility:
                </h3>
                <p className='mobile-s:text-sm md:base'>
                    You are solely responsible for the accuracy, completeness, and authenticity of the information you provide during the assessment. Any consequences arising from providing false, misleading, or incomplete information are your sole responsibility.

                    You understand that this assessment is intended for informational and developmental purposes only and should not be considered a substitute for professional advice. The results of this assessment should not be used to make any decisions about employment, education, or any other personal or professional matters.
                </p>
                <h3 className='mobile-s:text-base md:text-xl font-bold'>
                    Limitation of Liability:
                </h3>
                <p className='mobile-s:text-sm md:base'>
                    We are not liable for any damages, direct or indirect, incidental, special, consequential, or punitive, arising out of or relating to your use of this assessment, including but not limited to:
                    Unauthorized access to or use of your data.
                    Errors or omissions in the assessment content.
                    Reliance on the assessment results for decision-making.
                    Any technological issues or interruptions affecting the assessment platform.
                    Data Retention and Usage:

                    Your anonymized data may be retained for research and development purposes to improve our services and AI models. We will not use your data for marketing or advertising purposes without your explicit consent.

                    We reserve the right to modify this disclaimer at any time. Any changes to this disclaimer will be effective immediately upon posting on this platform.

                    By clicking "I Agree" or proceeding with the assessment, you signify your understanding and acceptance of this disclaimer in its entirety.

                    If you do not agree with any part of this disclaimer, please do not proceed with the assessment.
                </p>
            </div>
        </div>
    );
};

export default Disclaimer;
