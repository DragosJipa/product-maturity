// client/src/utils/formUtils.js

import axios from 'axios';

// Enhanced dummy responses for open-ended questions with more detailed and elaborated content
const openEndedDummyResponses = {
  "openEndedQ1": [
    "Our biggest challenge in product development is the alignment between our development teams and the marketing department. Often, there are conflicting priorities, which delays product launches and impacts the overall product roadmap. Additionally, we struggle with legacy systems that hinder our ability to innovate and quickly pivot based on customer feedback.",
    "We are currently facing difficulties in scaling our infrastructure to support new features and services. There is also a lack of streamlined processes, leading to inefficiencies in cross-functional collaboration. Furthermore, the frequent changes in customer demands require a more agile approach that our current setup doesn’t fully support.",
    "The most significant challenge is balancing the need for rapid iteration with maintaining product quality. Our team often feels pressured to release new features quickly, which sometimes compromises thorough testing and quality assurance processes. Additionally, integrating customer feedback into the development cycle in real time remains a hurdle."
  ],
  "openEndedQ2": [
    "Over the next 12 months, we would like to see a stronger emphasis on integrating customer feedback more effectively into the product development cycle. Additionally, increasing the automation of our testing processes could significantly reduce deployment times and improve product quality. We are also looking to implement more agile methodologies to better adapt to market changes.",
    "We aim to enhance our DevOps practices to achieve continuous delivery and reduce time to market. Another key improvement would be establishing a more transparent communication framework between teams to ensure everyone is aligned on the product vision and goals. Lastly, investing in modernizing our tech stack will be critical for improving overall development efficiency.",
    "We hope to see a shift towards a more data-driven approach in our decision-making process. Introducing more sophisticated analytics tools would help in better understanding user behavior and preferences. We also want to focus on refining our MVP strategy to validate assumptions earlier in the development cycle, reducing waste and focusing resources on high-impact features."
  ],
  "openEndedQ3": [
    "A recent product development success was the launch of our mobile application, which saw a 40% increase in user engagement within the first three months. This success was primarily due to early involvement of customers in the design phase, allowing us to iterate on feedback rapidly. Our decision to adopt a microservices architecture also enabled more flexibility and faster deployment of updates.",
    "Our successful rollout of a new feature that allowed integration with third-party tools was a significant milestone. It was achieved through a dedicated cross-functional team that worked closely with early adopters to refine the feature before general release. Leveraging an agile framework, the team was able to adapt quickly to changes and feedback, ensuring a smooth deployment.",
    "We recently revamped our user interface, which resulted in a 50% reduction in user churn rate. The success was largely due to conducting in-depth user research and usability testing, allowing us to create a more intuitive and engaging user experience. The project was also a testament to effective collaboration between the design, development, and product management teams."
  ],
  "openEndedQ4": [
    "Currently, we gather customer feedback through multiple channels, including surveys, user interviews, and direct feedback forms within the app. This feedback is then analyzed and prioritized by a dedicated customer insights team. Insights gained are discussed in monthly product strategy meetings to ensure alignment with the product roadmap.",
    "Customer feedback is primarily collected via NPS surveys and support tickets. We also have a customer advisory board that meets quarterly to provide feedback on new features and future plans. The feedback is documented and tracked using our project management tools, ensuring transparency and accountability in how it influences product decisions.",
    "We use a combination of automated feedback collection through in-app surveys and direct outreach programs to gather customer insights. Additionally, we have a beta testing group that provides continuous feedback on upcoming features. This feedback is crucial in refining our development priorities and ensuring we meet our users' needs effectively."
  ],
};

// Function to populate dummy responses
export const populateDummyResponses = (questions) => {
  const dummyData = {};

  // Iterate through each section
  questions.forEach((section) => {
    // Iterate through each question within the section
    section.questions.forEach((question) => {
      if (question.options && question.options.length > 0) {
        // If options are present, it's a radio or select type; pick a random option
        const randomOption = question.options[Math.floor(Math.random() * question.options.length)];
        dummyData[question.id] = randomOption.value;
      } else if (question.type === 'text' || question.type === 'email') {
        // For text or email input, use a generic dummy response
        dummyData[question.id] = 'Dummy Response';
      } else if (section.type === 'open-ended' && openEndedDummyResponses[question.id]) {
        // For open-ended questions, pick a random response from pre-generated ones
        const randomResponse = openEndedDummyResponses[question.id][Math.floor(Math.random() * openEndedDummyResponses[question.id].length)];
        dummyData[question.id] = randomResponse;
      } else {
        console.warn(`No dummy data available for question ID: ${question.id}`);
      }
    });
  });

  console.log(`Generated dummy data for ${questions.length} questions:`, dummyData);
  return dummyData; // Return the dummy data to be set in the form state
};

// Function to submit form data
export const submitFormData = async (formData, setIsSubmitted, setAssessmentData) => {
  if (typeof formData !== 'object' || formData === null) {
    alert('Invalid form data. Please review your responses.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3001/api/submit', formData);
    console.log('Success:', response.data);

    // Update the context with both interpretation and detailedReport
    setAssessmentData({ 
      interpretation: response.data.interpretation, 
      detailedReport: response.data.detailedReport, 
      responses: formData 
    });

    setIsSubmitted(true);
  } catch (error) {
    console.error('Error:', error);
    alert('There was an issue submitting your responses. Please try again later.');
  }
};

