import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    // Block unauthorized access to any route wrapped by _auth
    if (!context.auth.isLoading && !context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href
        }
      })
    }
  },
  component: AuthLayout
})

function AuthLayout(): React.JSX.Element | null {
  const { auth } = Route.useRouteContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate])

  if (auth.isLoading) {
    return (
      <div className="flex h-screen w-screen bg-[#181818] p-8 text-[#FFFFFF]">
        <div className="flex w-full gap-6">
          {/* Skeleton Sidebar */}
          <div className="w-64 h-full rounded-2xl bg-[#1F1F1F] p-4 flex flex-col justify-between animate-pulse border border-[#272727]">
            <div className="space-y-4">
              <div className="h-10 w-32 bg-[#272727] rounded-lg" />
              <div className="space-y-2 pt-4">
                <div className="h-9 bg-[#272727] rounded-lg" />
                <div className="h-9 bg-[#272727] rounded-lg" />
                <div className="h-9 bg-[#272727] rounded-lg" />
              </div>
            </div>
            <div className="h-12 bg-[#272727] rounded-lg" />
          </div>
          {/* Skeleton Main View */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="h-16 rounded-2xl bg-[#1F1F1F] p-4 animate-pulse border border-[#272727]" />
            <div className="grid grid-cols-3 gap-6">
              <div className="h-32 rounded-2xl bg-[#1F1F1F] animate-pulse border border-[#272727]" />
              <div className="h-32 rounded-2xl bg-[#1F1F1F] animate-pulse border border-[#272727]" />
              <div className="h-32 rounded-2xl bg-[#1F1F1F] animate-pulse border border-[#272727]" />
            </div>
            <div className="flex-1 rounded-2xl bg-[#1F1F1F] animate-pulse border border-[#272727]" />
          </div>
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return null
  }

  return <Outlet />
}
