const { 
  MAX_POLL_OPTIONS, 
  MIN_POLL_OPTIONS,
  MAX_OPTION_LENGTH,
  MAX_POLL_TITLE_LENGTH,
  MAX_POLL_DESCRIPTION_LENGTH 
} = require('../config/constants');

const validatePoll = (req, res, next) => {
  const { title, description, options } = req.body;

  // Validate title
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Poll title is required'
    });
  }

  if (title.length > MAX_POLL_TITLE_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `Poll title must be less than ${MAX_POLL_TITLE_LENGTH} characters`
    });
  }

  // Validate description
  if (description && description.length > MAX_POLL_DESCRIPTION_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `Description must be less than ${MAX_POLL_DESCRIPTION_LENGTH} characters`
    });
  }

  // Validate options
  if (!options || !Array.isArray(options)) {
    return res.status(400).json({
      success: false,
      error: 'Options must be an array'
    });
  }

  if (options.length < MIN_POLL_OPTIONS) {
    return res.status(400).json({
      success: false,
      error: `At least ${MIN_POLL_OPTIONS} options are required`
    });
  }

  if (options.length > MAX_POLL_OPTIONS) {
    return res.status(400).json({
      success: false,
      error: `Maximum ${MAX_POLL_OPTIONS} options allowed`
    });
  }

  // Validate each option
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const optionText = typeof option === 'string' ? option : option.text;

    if (!optionText || optionText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: `Option ${i + 1} cannot be empty`
      });
    }

    if (optionText.length > MAX_OPTION_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Option ${i + 1} must be less than ${MAX_OPTION_LENGTH} characters`
      });
    }
  }

  // Check for duplicate options
  const optionTexts = options.map(opt => 
    typeof opt === 'string' ? opt.toLowerCase().trim() : opt.text.toLowerCase().trim()
  );
  const uniqueOptions = new Set(optionTexts);

  if (uniqueOptions.size !== options.length) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate options are not allowed'
    });
  }

  next();
};

module.exports = validatePoll;