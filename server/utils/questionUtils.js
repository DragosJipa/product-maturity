// server/utils/questionUtils.js

const questionsData = require('../../data/questions.json'); // Load your questions data

function getQuestionDetailsById(questionId) {
  for (const section of questionsData) {
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
function getAnswerTextById(questionId, answerValue) {
  for (const section of questionsData) {
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
  getAnswerTextById
};
