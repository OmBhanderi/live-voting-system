export const validatePollTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  if (title.length > 200) {
    return 'Title must be less than 200 characters';
  }
  return null;
};

export const validatePollOptions = (options) => {
  if (!options || options.length < 2) {
    return 'At least 2 options are required';
  }
  if (options.length > 10) {
    return 'Maximum 10 options allowed';
  }

  for (let i = 0; i < options.length; i++) {
    if (!options[i] || options[i].trim().length === 0) {
      return `Option ${i + 1} cannot be empty`;
    }
    if (options[i].length > 200) {
      return `Option ${i + 1} must be less than 200 characters`;
    }
  }

  // Check for duplicates
  const uniqueOptions = new Set(options.map(opt => opt.toLowerCase().trim()));
  if (uniqueOptions.size !== options.length) {
    return 'Duplicate options are not allowed';
  }

  return null;
};

export const validatePollForm = (formData) => {
  const errors = {};

  const titleError = validatePollTitle(formData.title);
  if (titleError) errors.title = titleError;

  const optionsError = validatePollOptions(formData.options);
  if (optionsError) errors.options = optionsError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};