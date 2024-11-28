// middleware/apiKey.js

const validApiKeys = new Set([
    // Add your valid API keys here
    process.env.API_KEY || 'your-default-api-key', // Example API key
]);

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // or any other header you prefer

    if (!apiKey || !validApiKeys.has(apiKey)) {
        return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }

    next(); // Continue to the next middleware or route handler
};

module.exports = apiKeyMiddleware;
