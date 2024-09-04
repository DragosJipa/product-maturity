// server/utils/openAIHelpers.js

const OpenAI = require('openai');
const logger = require('../config/logger'); // Import logger
const appConfig = require('../config/appConfig'); // Assuming you have a config setup
const { getQuestionDetailsById, getAnswerTextById } = require('../utils/questionUtils'); // Import utility functions

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Step 1: Function to generate a detailed report
async function generateDetailedReport(data) {
    try {
        const prompt = generateDetailedReportPrompt(data);
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
            return { error: "Invalid JSON format from OpenAI", raw: jsonResponseText };
        }
    } catch (error) {
        logger.error(`Failed to generate JSON from report: ${error.message}`);
        return null;
    }
}

// Function to generate a prompt for the detailed report based on form data
function generateDetailedReportPrompt(data) {
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
    3. **Dimension Scores**: Provide the numeric scores for each dimension (Strategy, Processes, Technology, Culture) on a scale of 1-5.
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
    
    // Append user responses to the prompt
    for (const [questionId, answer] of Object.entries(data)) {
        const questionDetails = getQuestionDetailsById(questionId);
        const answerText = getAnswerTextById(questionId, answer);

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

{
  "summary": "A very short summary of the product maturity. It should state the level and some key points, without details about company, industry, submitter role",
  "maturity_level": "Overall maturity level (1-5) extracted from the report.",
  "dimension_score": {
    "Strategy": "Score for the Strategy dimension (1-5).",
    "Processes": "Score for the Processes dimension (1-5).",
    "Technology": "Score for the Technology dimension (1-5).",
    "Culture": "Score for the Culture dimension (1-5)."
  },
  "recommendations": [
    {
      "title": "A short title for each recommendation.",
      "details": "Detailed explanation of each recommendation."
    }
  ],
  "risk_assessment": {
    "level": "Overall risk level (e.g., low, medium, high).",
    "details": "Detailed risk analysis based on the report."
  },
  "roadmap_phases": [
    {
      "phase_id": "Unique ID for the phase.",
      "title": "Title of the phase.",
      "description": "Description of the phase."
      "duration": "Duration of the phase as percentage of the total roadmap timeline.",
    }
  ],
  "roadmap_milestones": [
    {
      "milestone_id": "Unique ID for the milestone.",
      "title": "Title of the milestone.",
      "description": "Include the main deliverable or achievement of the phase.",
    }
  ]
}

Guidelines for the JSON response:
- Ensure all fields are present in the response.
- Provide unique IDs for phases and milestones, starting from 1.

Use the detailed report below to extract the relevant information:

${detailedReport}
`;
}

module.exports = {
    generateDetailedReport,
    generateJsonFromReport,
};
