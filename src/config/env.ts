import "dotenv/config";

export const settings = () => ({
  Database_URL: process.env.DATABASE_URL,
  Allowed_ORIGINS: ["https://localhost:5173",process.env.FRONTEND_URL],
});

