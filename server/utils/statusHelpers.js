// server/utils/statusHelpers.js

// In-memory store to track task statuses
const taskStatuses = {};

// Function to set the status of a task
const setTaskStatus = (taskId, status, result = null) => {
  taskStatuses[taskId] = { status, result };
};

// Function to get the status of a task
const getTaskStatus = (taskId) => {
  return taskStatuses[taskId] || { status: 'not_started' }; // Default to 'not_started' if no status is found
};

module.exports = {
  setTaskStatus,
  getTaskStatus,
};
