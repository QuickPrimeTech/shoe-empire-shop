// @/index.ts

//Drizzle config
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env file");
}

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
// Disable prefetch as it is not supported for "Transaction" pool mode
export const db = drizzle({ client });
