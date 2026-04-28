// Vercel serverless function entry point
// Imports the pre-compiled NestJS app from dist/
const handler = require('../dist/serverless').default;
module.exports = handler;
