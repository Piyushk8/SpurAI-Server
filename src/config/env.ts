import "dotenv/config";

export const settings = {
  Database_URL: process.env.DATABASE_URL,
  BASE_API_URL: process.env.BASE_API_URL || "/api/v1",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  Allowed_ORIGINS: [process.env.FRONTEND_URL!],
  PINO_LOG_LEVEL: process.env.PINO_LOG_LEVEL || "info",
};
