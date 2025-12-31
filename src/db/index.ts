import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { settings } from "../config/env";

const pool = new Pool({
  connectionString: settings.Database_URL,
});

export const db = drizzle(pool);
