import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: ['./src/main/db/schema.ts', './src/main/db/auth-schema.ts'],
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.VITE_DB_FILE_NAME || 'sqlite.db'
  }
})
