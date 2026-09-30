import { ElectronAPI } from '@electron-toolkit/preload'
import type { authClient } from '../main/lib/auth-client'

declare global {
  type Bridges = typeof authClient.$Infer.Bridges
  interface Window extends Bridges {
    electron: ElectronAPI
    api: unknown
  }
}
