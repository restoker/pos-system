import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { userRelations } from './relations'

export const db = drizzle(process.env.DATABASE_URL || 'file:sqlite.db', {
  relations: {
    ...userRelations
  }
})
