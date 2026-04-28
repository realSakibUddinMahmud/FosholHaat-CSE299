// Vercel serverless function entry point
// Imports the pre-compiled NestJS app from apps/api/dist/
const handler = require('../apps/api/dist/serverless').default;
module.exports = handler;
