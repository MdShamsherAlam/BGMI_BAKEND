const rateLimit = require('express-rate-limit');

// Create a rate limiter middleware
const requestLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 4, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // Send rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Export the middleware
module.exports = requestLimiter;
