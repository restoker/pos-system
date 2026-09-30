import { createAuthClient } from 'better-auth/client'
import { electronClient } from '@better-auth/electron/client'
import { storage } from '@better-auth/electron/storage'

export const authClient = createAuthClient({
  baseURL: process.env.VITE_BETTER_AUTH_URL || 'http://localhost:5173',
  plugins: [
    electronClient({
      signInURL: `${process.env.VITE_BETTER_AUTH_URL || 'http://localhost:5173'}/sign-in`,
      protocol: {
        scheme: 'com.electron.app'
      },
      storage: storage()
    })
  ]
})
