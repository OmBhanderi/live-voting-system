const { VOTE_RATE_LIMIT, POLL_CREATION_LIMIT } = require('../config/constants');

// Store for tracking requests
const requestStore = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestStore.entries()) {
    if (now - data.firstRequest > data.window) {
      requestStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

const createRateLimiter = (limit, windowMs, message) => {
  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    const key = `${identifier}-${req.baseUrl}${req.ptah}`;
    const now = Date.now();

    if (!requestStore.has(key)) {
      requestStore.set(key, {
        count: 1,
        firstRequest: now,
        window: windowMs
      });
      return next();
    }

    const data = requestStore.get(key);

    // Reset if window has passed
    if (now - data.firstRequest > windowMs) {
      data.count = 1;
      data.firstRequest = now;
      return next();
    }

    // Increment count
    data.count += 1;

    // Check if limit exceeded
    if (data.count > limit) {
      return res.status(429).json({
        success: false,
        error: message || 'Too many requests, please try again later',
        retryAfter: Math.ceil((data.firstRequest + windowMs - now) / 1000)
      });
    }

    next();
  };
};

// Export rate limiters
const voteRateLimiter = createRateLimiter(
  VOTE_RATE_LIMIT,
  60 * 1000, // 1 minute
  `Too many votes. Limit is ${VOTE_RATE_LIMIT} votes per minute`
);

const pollCreationRateLimiter = createRateLimiter(
  POLL_CREATION_LIMIT,
  60 * 60 * 1000, // 1 hour
  `Too many polls created. Limit is ${POLL_CREATION_LIMIT} polls per hour`
);

module.exports = {
  voteRateLimiter,
  pollCreationRateLimiter,
};