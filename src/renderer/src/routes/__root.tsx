import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { AuthState } from '../store/auth.store'

export interface MyRouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent
})

function RootComponent(): React.JSX.Element {
  return (
    <div className="h-screen w-screen bg-[#181818] text-[#FFFFFF] font-sans antialiased overflow-hidden flex flex-col">
      <Outlet />
    </div>
  )
}
