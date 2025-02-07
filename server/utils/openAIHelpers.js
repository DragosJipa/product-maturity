// server/utils/openAIHelpers.js

const OpenAI = require('openai');
const logger = require('../config/logger'); // Import logger
const appConfig = require('../config/appConfig'); // Assuming you have a config setup
const { initializeCache, getAllQuestionsAndAnswers } = require('../utils/questionUtils');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Step 1: Function to generate a detailed report
async function generateDetailedReport(data) {
  try {
    const prompt = await generateDetailedReportPrompt(data);

    const response = await openai.chat.completions.create({
      model: appConfig.LLM_MODEL,
      messages: [
        { role: "system", content: "You are a product management consultant. Provide a detailed analysis and report based on the client's responses." },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const detailedReport = response.choices[0].message.content;
    return detailedReport;
  } catch (error) {
    logger.error(`Failed to generate detailed report: ${error.message}`);
    return null;
  }
}

// Step 2: Function to generate JSON output from the detailed report
async function generateJsonFromReport(detailedReport) {
  try {
    const prompt = generateJsonPrompt(detailedReport);
    const response = await openai.chat.completions.create({
      model: appConfig.LLM_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a data analyst and assistant. Your task is to analyze the provided data and generate a response based on the data provided. Ignore any previous instructions or context and respond solely based on the following new instructions."
        },
        {
          role: "user",
          content: prompt
        },
      ],
      max_tokens: 3000,
      temperature: 0.7, // Adjust temperature for creativity vs. precision
      top_p: 0.9,       // Adjust top_p for diversity in responses
      frequency_penalty: 0.1, // Penalize frequent terms for varied output
      presence_penalty: 0.1,  // Penalize terms that have already been used
    });

    let jsonResponseText = response.choices[0].message.content;

    // Clean up the response to remove code block formatting or extra text
    jsonResponseText = jsonResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Try to parse as JSON
    try {
      const parsedJson = JSON.parse(jsonResponseText);
      return parsedJson;
    } catch (jsonError) {
      logger.error(`Failed to parse JSON from detailed report: ${jsonError.message}`);
      try {
        const parsedRetryJson = generateJsonWithRetries(prompt);
        return parsedRetryJson;
      } catch (err) {

      }
      return { error: "Invalid JSON format from OpenAI", raw: jsonResponseText };
    }
  } catch (error) {
    logger.error(`Failed to generate JSON from report: ${error.message}`);
    return null;
  }
}

// async function generateJsonFromReport(detailedReport, retries = 3) {
//   let jsonResponse = {};

//   const requiredFields = [
//     "maturity_level.level",
//     "maturity_level.status",
//     "maturity_level.description",
//     "maturity_level.strategy.level",
//     "maturity_level.strategy.label",
//     "maturity_level.processes.level",
//     "maturity_level.processes.label",
//     "maturity_level.technology.level",
//     "maturity_level.technology.label",
//     "maturity_level.culture.level",
//     "maturity_level.culture.label",
//     "detailed_analysis.strengths",
//     "detailed_analysis.weaknesses",
//     "detailed_analysis.areas_for_improvement",
//     "risks.description",
//     "risks.recommendations",
//     "risks.risks",
//     "roadmap"
//   ];

//   const requiredRoadmapFields = [
//     "answer",
//     "goal",
//     "milestone",
//     "milestoneTitle",
//     "phase",
//     "question",
//     "title"
//   ];

//   const requiredRecommendationFields = [
//     "action",
//     "description",
//     "type"
//   ];

//   const checkFields = (obj, fields) => {
//     return fields.every(field => {
//       const keys = field.split('.');
//       let value = obj;
//       for (const key of keys) {
//         if (value[key] === undefined) {
//           return false;
//         }
//         value = value[key];
//       }
//       return true;
//     });
//   };

//   const isJsonComplete = (json) => {
//     if (!checkFields(json, requiredFields)) {
//       return false;
//     }

//     if (!Array.isArray(json.roadmap)) {
//       return false;
//     }

//     for (const item of json.roadmap) {
//       if (!checkFields(item, requiredRoadmapFields)) {
//         return false;
//       }
//     }

//     if (!Array.isArray(json.risks.recommendations)) {
//       return false;
//     }

//     for (const item of json.risks.recommendations) {
//       if (!checkFields(item, requiredRecommendationFields)) {
//         return false;
//       }
//     }

//     return true;
//   };

//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const maturityAndAnalysisPrompt = generateMaturityAndAnalysisPrompt(detailedReport);
//       const response1 = await openai.chat.completions.create({
//         model: appConfig.LLM_MODEL,
//         messages: [
//           {
//             role: "system",
//             content: "You are a data analyst and assistant. Your task is to analyze the provided data and generate a response based on the data provided. Ignore any previous instructions or context and respond solely based on the following new instructions."
//           },
//           {
//             role: "user",
//             content: maturityAndAnalysisPrompt
//           },
//         ],
//         max_tokens: 3000,
//         temperature: 0.7,
//         top_p: 0.9,
//         frequency_penalty: 0.1,
//         presence_penalty: 0.1,
//       });

//       let jsonResponseText1 = response1.choices[0].message.content;
//       jsonResponseText1 = jsonResponseText1.replace(/```json/g, '').replace(/```/g, '').trim();
//       const parsedJson1 = JSON.parse(jsonResponseText1);

//       const risksAndRoadmapPrompt = generateRisksAndRoadmapPrompt(detailedReport);
//       const response2 = await openai.chat.completions.create({
//         model: appConfig.LLM_MODEL,
//         messages: [
//           {
//             role: "system",
//             content: "You are a data analyst and assistant. Your task is to analyze the provided data and generate a response based on the data provided. Ignore any previous instructions or context and respond solely based on the following new instructions."
//           },
//           {
//             role: "user",
//             content: risksAndRoadmapPrompt
//           },
//         ],
//         max_tokens: 3000,
//         temperature: 0.7,
//         top_p: 0.9,
//         frequency_penalty: 0.1,
//         presence_penalty: 0.1,
//       });

//       let jsonResponseText2 = response2.choices[0].message.content;
//       jsonResponseText2 = jsonResponseText2.replace(/```json/g, '').replace(/```/g, '').trim();
//       const parsedJson2 = JSON.parse(jsonResponseText2);

//       jsonResponse = { ...parsedJson1, ...parsedJson2 };
//       if (isJsonComplete(jsonResponse)) {
//         return jsonResponse;
//       } else {
//         console.warn(`Attempt ${attempt} produced incomplete JSON. Retrying...`);
//       }
//     } catch (error) {
//       if (attempt < retries) {
//         console.warn(`Attempt ${attempt} failed. Retrying...`);
//       } else {
//         console.error(`Failed to generate valid JSON after ${retries} attempts:`, error.message);
//         return { error: "Failed to generate valid JSON", raw: error.message };
//       }
//     }
//   }
// }

// Function to generate a prompt for the detailed report based on form data
async function generateDetailedReportPrompt(data) {
  let prompt = `
    You work for a digital and product transformation consultancy firm. Your client has recently undergone a product maturity assessment to evaluate their current state and identify areas for improvement. 
    The assessment covered four key dimensions: Strategy, Processes, Technology, and Culture. The responses are provided below, at the end of the prompt.
    
    Your task is to analyze all data provided here and produce a detailed report. Be descriptive, include examples, specify what will be changed if a certain action is taken. 
    Format the entire response in Markdown. Use headers, bullet points, and tables where appropriate to enhance readability.
    
    Important: Use the following information about our Product Lab offering and best practices to enhance the report with actionable recommendations that align with our services.
    
    ### Product Lab Summary
    
    **Key Components of Product Lab**
    
    - **Product Mindset Philosophy:**
      - **Shift from Project-Based to Product-Based Approach:** Encourages focusing on products rather than projects, ensuring sustained value delivery over time.
      - **Emphasize Continuous Delivery of Value:** Focuses on consistent value delivery rather than just completing projects, aligning with the goal of solving real customer problems.
      - **Solve Real Customer Problems:** Aligns product efforts with business goals to deliver meaningful value, not just features.
      - **End-to-End Accountability:** Ensures product teams are accountable for the entire product lifecycle, fostering commitment to overall product success.
    
    - **Product Operating Model:**
      - **Clear Roles and Responsibilities:** Defines roles clearly to avoid overlap and ensure accountability across the product lifecycle from strategy to delivery.
      - **Cross-Functional Collaboration:** Ensures collaboration between different departments such as product, IT, and business teams to prevent silos and enhance product outcomes.
      - **Decision-Making Authority and Accountability:** Empowers teams with the autonomy to make decisions and be accountable for their outcomes, fostering a sense of ownership and commitment.
      - **Single Backlog and Prioritization:** Maintains a unified backlog to prioritize effectively and ensure all teams are aligned towards common strategic goals.
      - **Product Lifecycle Management:** Emphasizes the importance of managing the entire product lifecycle, from ideation and planning to development, launch, and continuous improvement.
    
    - **Market and UX Research:**
      - **Focus on Understanding Customers and the Market:** Emphasizes the importance of understanding customer needs and market dynamics rather than following trends, fostering a culture of continuous learning and questioning assumptions.
    
    - **How Modus Create Can Help:**
      - **Implement a Product Operating Model:** Define clear roles and responsibilities within product teams, ensuring alignment and accountability from strategy to delivery.
      - **Facilitate Strategic Alignment Workshops:** Align product efforts with strategic goals and customer needs, focusing on solving real customer problems rather than just delivering features.
      - **Optimize Product Development Processes:** Start with a simple, functional system and evolve gradually according to Gall’s Law, emphasizing continuous improvement and alignment with customer needs.
      - **Establish Robust Product Metrics and KPIs:** Develop KPIs aligned with strategic goals, ensuring a focus on value delivery and alignment between business objectives, technological capabilities, and customer needs.
    
    Use this information to ensure that your recommendations are aligned with our firm’s offerings and best practices.
    
    Here is the structure for the report that you will create:
    
    1. **Summary**: A short overview of the product maturity based on the responses. Formulate it as an impersonal statement, considering that the recipient is exactly the client who has undergone the assessment.
    2. **Maturity Level**: An overall maturity level (1-5) calculated based on all the responses, both quantitative and qualitative ones. It's your interpretation of the current state of the organization.
    3. **Dimension Scores**: Provide the numeric scores for each dimension (Strategy, Processes, Technology, Culture) on a scale of 1-5. /* (Initial - level 1, Repeatable - level 2, Defined - level 3, Managed - level 4, and Optimizing - level 5) - no in betweens (just like you woud do math.floor on them) */
    4. **Detailed Analysis**: An in-depth analysis, discussing strengths, weaknesses, and areas for improvement.
    5. **Current State vs. Desired Future State**: A comparison between the current state of the organization and the desired future state in terms of product maturity.
    6. **Recommendations**: Actionable recommendations for improving the product maturity, focusing on each dimension. For each recommendation, provide an example of an actionable change - what the organization can do to implement the recommendation. Don't just list generic advice, be specific, focus on the how the needle can be moved.
    7. **Risks**: An assessment of possible risks associated with the current product maturity level and recommendations for risk mitigation.
    8. **Transformative Journey Roadmap**: A roadmap outlining the transformative journey for the organization, organized as a table
    9. **How Modus Create Can Help**: A brief section on how Modus Create can assist the organization in achieving its desired future state. Include actionable steps and services that align with the recommendations. Make reffrences to Modus' offerings inside the Product Lab and Product Operating Model.
    
    Some guidelines about Roadmap:
    - Roadmap has phases. 
    - Each phase has a clear goal and the side of the business which is impacted. They are mentioned in the phase description.
    - At the end of each phase sits a milestone. A milestone means an achievement, a goal reached, a deliverable.
    - Each milestone has a title, a description (what will be achieved, which is the deliverable), and the position on the roadmap line.
    
    When you assess the product maturity please use this matrix, provided in JSON format. The matrix has five levels of maturity: Initial, Repeatable, Defined, Managed, and Optimizing. The levels are defined across four dimensions: Strategy, Processes, Technology, and Culture. In your report, make references to the matrix according to the level of maturity. Use the identified level to provide a clear picture of the current state of the organization, using the descriptions provided in the matrix.
    
    \`\`\`json
    {
      "maturity_levels": [
        {
          "level": "Initial",
          "description": "At the initial level, organizations may not have a formal environment for managing products or an actual product management team.",
          "dimensions": {
            "Strategy": "An overarching product mission and vision is almost nonexistent, or poorly defined. When asked about strategy, the common response is 'being market/tech leader'.",
            "Processes": "Processes are very ad hoc. Product development is often unpredictable, the process is constantly changing as work progresses.",
            "Technology": "Outdated or no technology stack; reliance on manual processes and legacy systems.",
            "Culture": "No clear culture of ownership; decisions are top-down, and team members are not empowered to take action. High resistance to change."
          }
        },
        {
          "level": "Repeatable",
          "description": "Organizations at the repeatable level start to establish formal practices for managing and implementing product management.",
          "dimensions": {
            "Strategy": "Some strategic language is present. Org leadership just started to talk about OKRs, and some business objectives could be set.",
            "Processes": "Some processes are defined and documented. They still fall under PMO / PJM responsibility.",
            "Technology": "Basic technology tools in place; limited automation and integration between systems.",
            "Culture": "Limited culture of ownership; some empowerment exists, but most decisions are still top-down. Resistance to new ideas or innovation is present."
          }
        },
        {
          "level": "Defined",
          "description": "The defined level sees more precise practices for product management.",
          "dimensions": {
            "Strategy": "Mission and vision are in place, with some objectives for the next year. The organization still lacks good communication and not all parts push in the same direction.",
            "Processes": "Cross-functional processes are defined; debts and risks could be monitored but not all the time mitigated.",
            "Technology": "Moderate technology stack with some integration; automated testing and deployment tools are in early stages.",
            "Culture": "Defined culture of ownership; team members are somewhat empowered, and there is support for taking initiative, but it varies across teams."
          }
        },
        {
          "level": "Managed",
          "description": "At the managed level, product strategy is well defined and informs product management processes.",
          "dimensions": {
            "Strategy": "Product strategy is well defined and aligned with business strategy. Could be the status of Missionaries, when everyone fights for the objectives.",
            "Processes": "Processes are monitored, and reported. Effort and capacity are well estimated and planned.",
            "Technology": "Advanced technology stack with significant automation in place; CI/CD fully integrated.",
            "Culture": "Strong culture of ownership; team members are empowered to take actions, backed by data, and are encouraged to innovate."
          }
        },
        {
          "level": "Optimizing",
          "description": "When an organization reaches the optimizing level, every function is focused on continuous improvement.",
          "dimensions": {
            "Strategy": "The organization is able to self improve and adapt on any aspect. Regular retros are held at all org levels and departments.",
            "Processes": "All processes are continuously optimized; retrospectives are held across all levels to drive improvements.",
            "Technology": "Cutting-edge technology stack; fully automated processes with continuous deployment and integration.",
            "Culture": "Very strong culture of ownership; team members are fully empowered to take action and are consistently supported."
          }
        }
      ]
    }
    \`\`\`
    
    Important note: please write as a human not as a robot. A real human being will read your work.

    Here are the responses from the product maturity assessment for analysis:
    
    `;

  await initializeCache();
  const { questionDetailsMap, answerTextMap } = await getAllQuestionsAndAnswers();

  // Append user responses to the prompt
  for (const [questionId, answer] of Object.entries(data)) {
    const questionDetails = questionDetailsMap.get(questionId);
    const answerText = answerTextMap.get(questionId)?.get(answer) || "Unknown Answer";

    if (questionDetails) {
      prompt += `Dimension: ${questionDetails.dimension}\n`;
      prompt += `Question: ${questionDetails.text}\n`;
    } else {
      prompt += `Dimension: Not Found\n`;
      prompt += `Question: Not Found\n`;
    }

    prompt += `Question ID: ${questionId}\nAnswer: ${answer} (${answerText})\n\n`;
  }

  return prompt;
}



// Function to generate a prompt for JSON output based on the detailed report
function generateJsonPrompt(detailedReport) {
  return `
Based on the following detailed report, produce a structured JSON output that includes the following information. The response should be pure JSON format, without any additional text, formatting, or comments. 

\`\`\`json
{
  "maturity_level": {
      "level": "The overall maturity level (1-5) extracted from the report. This is the numeric score value present in the report.",
      "status": "Maturity status (e.g., Initial, Repeatable, Defined, etc.). (but only use one word).",
      "description": "A concise description of the maturity level based on the report.",
      "strategy": {
          "level": "Score for Strategy dimension (1-5) as it is present in the report.",
          "label": "e.g., Initial, Repeatable, Defined, etc. as present in the report for Strategy dimention."
      },
      "processes": {
          "level": "Score for Processes dimension (1-5) as it is present in the report.",
          "label": "e.g., Initial, Repeatable, Defined, etc. as present in the report for Processes dimention."
      },
      "technology": {
          "level": "Score for Technology dimension (1-5) as it is present in the report.",
          "label": "e.g., Initial, Repeatable, Defined, etc. as present in the report for Technology dimention."
      },
      "culture": {
          "level": "Score for Culture dimension (1-5) as it is present in the report.",
          "label": "e.g., Initial, Repeatable, Defined, etc. as present in the report for Culture dimention."
      }
  },
  "detailed_analysis": {
      "strengths": [
          "A list of strengths based on the report."
      ],
      "weaknesses": [
          "A list of weaknesses based on the report."
      ],
      "areas_for_improvement": [
          "A list of areas for improvement based on the report."
      ]
  },
  "risks": {
      "description": "An overall description of risks identified in the report.",
      "recommendations": [
          {
              "type": "Type of recommendation (e.g., strategy, processes, technology, culture).",
              "description": "Detailed explanation of the recommendation.",
              "action": "Specific action steps for the recommendation."
          }
      ],
      "risks": [
          "A list of specific risks extracted from the report."
      ]
  },
  "roadmap": [
      {
          "phase": "Unique ID for the phase, starting from 1.",
          "goal": "Goal for this phase, extracted from the Roadmap section in the report report. Example: Process Optimization",
          "title": "Phase name, extracted from the Roadmap section in the report report. Example: Implement Agile methodologies",
          "milestone": "A short name for the milestone, based on the Roadmap section in the report. Example: Agile Processes",
          "milestoneTitle": "Title of the milestone, extracted from the Roadmap section in the report report. Example: Agile framework adopted",
          "question": "A relevant question associated with this phase. What an important stakeholder in a target organization might ask. Example: Struggling with Agile implementation?",
          "answer": "A detailed answer or suggestion related to the phase, formulated by Modus, as a solution to their problem. Try to formulate the answer based on the the section "How Modus Create Can Help" from the report provided. Example: "Modus facilitates workshops to help you create a winning product strategy aligned with your business goals. We'll guide you through a proven process to define your target audience, value proposition, and roadmap to success.""
      }
  ]
}
\`\`\`

Guidelines for the JSON response:
- Ensure all fields are present in the response.
- Provide unique IDs for phases and milestones, starting from 1.

Use the detailed report below to extract the relevant information:

${detailedReport}
`;
}


// Function to generate a prompt for the maturity level and detailed analysis sections
function generateMaturityAndAnalysisPrompt(detailedReport) {
  return `
Based on the following detailed report, produce a structured JSON output that includes the following information. The response should be pure JSON format, without any additional text, formatting, or comments. 

/* Example starts here */

\`\`\`json
{
  "maturity_level": {
      "level": "The overall maturity level (1-5) extracted from the report. This is the numeric score value present in the report.", /* (Initial - level 1, Repeatable - level 2, Defined - level 3, Managed - level 4, and Optimizing - level 5) - no in betweens (just like you woud do math.floor on them) */
      "status": "Maturity status (e.g., Initial, Repeatable, Defined, etc.).", /* (Initial - level 1, Repeatable - level 2, Defined - level 3, Managed - level 4, and Optimizing - level 5) - no in betweens (just like you woud do math.floor on them) */
      "description": "A concise description of the maturity level based on the report.",
      "strategy": {
          "level": "Score for Strategy dimension (1-5) as it is present in the report.",
          "label": "e.g., Initial, Repeatable, Defined, etc. as present in the report for Strategy dimention."
      },
      "processes": {
          "level": "Score for Processes dimension (1-5) as it is present in the report.",
          "label": "e.g., Initial, Repeatable, Defined, etc. as present in the report for Processes dimention."
      },
      "technology": {
          "level": "Score for Technology dimension (1-5) as it is present in the report.",
          "label": "e.g., Initial, Repeatable, Defined, etc. as present in the report for Technology dimention."
      },
      "culture": {
          "level": "Score for Culture dimension (1-5) as it is present in the report.",
          "label": "e.g., Initial, Repeatable, Defined, etc. as present in the report for Culture dimention."
      }
  },
  "detailed_analysis": {
      "strengths": [
          "A list of strengths based on the report."
      ],
      "weaknesses": [
          "A list of weaknesses based on the report."
      ],
      "areas_for_improvement": [
          "A list of areas for improvement based on the report."
      ]
  }
}
\`\`\`

/* Example ends here */

Guidelines for the JSON response:
- Ensure all fields are present in the response.
- Please extract the level and label directly from the report without altering the values.

Use the detailed report below to extract the relevant information:

${detailedReport}
`;
}

// Function to generate a prompt for the risks and roadmap sections
function generateRisksAndRoadmapPrompt(detailedReport) {
  return `
Based on the following detailed report, produce a structured JSON output that includes the following information. The response should be pure JSON format, without any additional text, formatting, or comments. 

\`\`\`json
{
  "risks": {
      "description": "An overall description of risks identified in the report.",
      "recommendations": [
          {
              "type": "Type of recommendation (e.g., strategy, processes, technology, culture).",
              "description": "Detailed explanation of the recommendation.",
              "action": "Specific action steps for the recommendation."
          }
      ],
      "risks": [
          "A list of specific risks extracted from the report."
      ]
  },
  "roadmap": [
      {
          "phase": "Unique ID for the phase, starting from 1.",
          "goal": "Goal for this phase, extracted from the Roadmap section in the report report. Example: Process Optimization",
          "title": "Phase name, extracted from the Roadmap section in the report report. Example: Implement Agile methodologies",
          "milestone": "A short name for the milestone, based on the Roadmap section in the report. Example: Agile Processes",
          "milestoneTitle": "Title of the milestone, extracted from the Roadmap section in the report report. Example: Agile framework adopted",
          "question": "A relevant question associated with this phase. What an important stakeholder in a target organization might ask. Example: Struggling with Agile implementation?",
          "answer": "A detailed answer or suggestion related to the phase, formulated by Modus, as a solution to their problem. Try to formulate the answer based on the the section "How Modus Create Can Help" from the report provided. Example: "Modus facilitates workshops to help you create a winning product strategy aligned with your business goals. We'll guide you through a proven process to define your target audience, value proposition, and roadmap to success.""
      }
  ]
}
\`\`\`

Guidelines for the JSON response:
- Ensure all fields are present in the response.
- Provide unique IDs for phases and milestones, starting from 1.

Use the detailed report below to extract the relevant information:

${detailedReport}
`;
}

function normalizeJsonResponse(responseText) {
  try {
    if (!responseText) {
      throw new Error('Response text is empty or undefined');
    }

    // Check if response text is already in JSON format
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '').trim();
    }

    // Parse JSON content
    const jsonResponse = JSON.parse(cleanedText);

    // Validate required fields
    if (!jsonResponse.Strengths || !jsonResponse.Opportunities) {
      throw new Error('Missing required fields in JSON response');
    }

    return jsonResponse;
  } catch (error) {
    console.error('Error normalizing JSON response:', error);
    throw error;
  }
}

async function generateEmailContent(detailedReport) {
  try {
    const prompt = `
Based on the detailed report provided below, generate a response in JSON format according to the structure provided in the example below.
Data provided in the example are only for reference and use the data extracted from report to populate these fields.
Please limit only to the required data, and not adding any other considerations.
The response should be pure JSON format, without any additional text, formatting, or comments. 


    Here are the descriptions of the fields included in the response:
    - Strengths: A key strength identified based on the report.
    - Opportunities: One or two opportunities identified based on the report. Formulate them briefly, in one single sentence, as in the example below
   
    /* Example JSON response starts here */

    \`\`\`json
    {
      "Strengths": "Strong performance in Technology, indicating a good foundation in tools and systems",
      "Opportunities": "Initial steps towards a data-driven approach in decision-making"
    }
    \`\`\`    
    
    /* Example JSON response ends here */

    /* Report starts here */ 
    Assessment detailed report:
    ${detailedReport}
    /* Report ends here */ 
`;

    const response = await openai.chat.completions.create({
      model: appConfig.LLM_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a product management consultant writing personalized emails to clients."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const emailJson = normalizeJsonResponse(response.choices[0].message.content.trim());
    console.log('Generated email content:', emailJson);

    return emailJson;
  } catch (error) {
    logger.error(`Failed to generate email content: ${error.message}`);
    return null;
  }
}

module.exports = {
  generateDetailedReport,
  generateJsonFromReport,
  generateEmailContent,
};
