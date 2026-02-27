import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";
import dns from "dns";

// Force IPv4 resolution to avoid ENETUNREACH on Railway
dns.setDefaultResultOrder('ipv4first');

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

const client = postgres(process.env.DATABASE_URL);
export const db = drizzle(client, { 
  schema,
  // Drizzle mapea automáticamente snake_case (BD) a camelCase (TypeScript)
});
