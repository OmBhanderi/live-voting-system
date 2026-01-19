const { v4: uuidv4 } = require("uuid");

const generateId = () => uuidv4();

const generateVoterId = (req) => {
  return (
    req.sessionID || req.ip || req.headers["x-forwarded-for"] || "anonymous"
  );
};

const validatePollData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (
    !data.options ||
    !Array.isArray(data.options) ||
    data.options.length < 2
  ) {
    errors.push("At least 2 options are required");
  }

  if (
    data.options &&
    data.options.some((opt) => !opt.text || opt.text.trim().length === 0)
  ) {
    errors.push("All options must have text");
  }

  return errors;
};

module.exports = {
  generateId,
  generateVoterId,
  validatePollData,
};
