import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import config from "../config";

const pool = new Pool({
  connectionString: config.database.url,
});

export const db = drizzle(pool, { schema });

export const testConnection = async () => {
  const client = await pool.connect();
  try {
    console.log("✓ Database connection verified");
  } finally {
    client.release();
  }
};

export default db;
