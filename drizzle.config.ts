import { defineConfig } from "drizzle-kit";
import { settings } from "./src/config/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: settings.Database_URL,
  },
});
