import Pages from "@/pages"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "sonner"
import './App.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      // Don't throw errors by default - let components handle them
      throwOnError: false,
    },
    mutations: {
      // Don't throw errors by default for mutations either
      throwOnError: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Pages />
      <Toaster
        position="top-right"
        duration={4000}
        closeButton
        richColors
        toastOptions={{
          style: {
            padding: '16px',
          },
          className: 'toast',
        }}
      />
    </QueryClientProvider>
  )
}

export default App

