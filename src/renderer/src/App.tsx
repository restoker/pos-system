import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { useAuthStore } from './store/auth.store'

// Create TanStack Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined! // Injected dynamically via RouterProvider
  }
})

// Register the router instance for maximum type safety across routes
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App(): React.JSX.Element {
  const auth = useAuthStore()
  return <RouterProvider router={router} context={{ auth }} />
}
