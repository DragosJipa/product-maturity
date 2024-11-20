// server/utils/questionUtils.js
const axios = require('axios');
const { parse } = require('csv-parse/sync');

const SHEET_ID = '1ykdTltqPXnjzWv2uwPpsaAkPON8n18fSxTIZ2i6ep_Q';
const SHEET_NAME = 'PMA_Questions';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

async function fetchQuestions() {
  try {
    const response = await axios.get(SHEET_URL);
    const csvData = response.data;

    const rows = parse(csvData, {
      columns: false,
      skip_empty_lines: true,
      from_line: 2
    });

    const questionsData = [];

    rows.forEach(row => {
      const values = row[5]?.split(',').map(value => value.trim().replace(/^"|"$/g, '')) || [];
      const labels = row[6]?.split(',').map(label => label.trim().replace(/^"|"$/g, '')) || [];

      const options = values.map((value, index) => ({
        value: value,
        label: labels[index] || ''
      }));

      const questionObj = {
        id: row[2],
        question: row[3],
        type: row[4],
        options: options
      };

      let existingGroup = questionsData.find(
        group => group.type === row[0] && group.dimension === row[1]
      );

      if (existingGroup) {
        existingGroup.questions.push(questionObj);
      } else {
        questionsData.push({
          type: row[0],
          dimension: row[1] || '',
          questions: [questionObj]
        });
      }
    });

    return questionsData;
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    return [];
  }
}

async function getQuestionDetailsById(questionId) {
  const questions = await fetchQuestions();
  for (const section of questions) {
    if (section.questions) {
      for (const question of section.questions) {
        if (question.id === questionId) {
          return {
            text: question.question,
            dimension: section.dimension || "General", // Assuming dimension is in the parent object or default to "General"
          };
        }
      }
    }
  }
  return null; // Return null if not found
}

// New function to get answer text by question ID and answer value
async function getAnswerTextById(questionId, answerValue) {
  const questions = await fetchQuestions();
  for (const section of questions) {
    if (section.questions) {
      for (const question of section.questions) {
        if (question.id === questionId && question.options) {
          const option = question.options.find(opt => opt.value === answerValue);
          return option ? option.label : "Unknown Answer";
        }
      }
    }
  }
  return "No Answer Text"; // Default text if no match is found
}

module.exports = {
  getQuestionDetailsById,
  getAnswerTextById,
  fetchQuestions
};
