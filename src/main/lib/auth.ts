import { betterAuth, BetterAuthOptions, Auth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { electron } from '@better-auth/electron'
import { db } from '../db'
import * as schema from '../db/schema'
import * as authSchema from '../db/auth-schema'

const authOptions: BetterAuthOptions = {
  plugins: [electron()],
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      ...schema,
      ...authSchema
    }
  }),
  secret: process.env.VITE_BETTER_AUTH_SECRET,
  baseURL: process.env.VITE_BETTER_AUTH_URL || 'http://127.0.0.1:5173',
  trustedOrigins: [
    'com.electron.app:/',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ],
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {}
  }
}

export const auth: Auth = betterAuth(authOptions)
