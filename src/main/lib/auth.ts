import { betterAuth, BetterAuthOptions, Auth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { electron } from '@better-auth/electron'
import { db } from '../db'

const authOptions: BetterAuthOptions = {
  plugins: [electron()],
  database: drizzleAdapter(db, {
    provider: 'sqlite'
  }),
  secret: process.env.VITE_BETTER_AUTH_SECRET,
  baseURL: process.env.VITE_BETTER_AUTH_URL || 'http://127.0.0.1:5173',
  trustedOrigins: ['com.electron.app:/'],
  emailAndPassword: {
    enabled: true
  }
}

export const auth: Auth = betterAuth(authOptions)
