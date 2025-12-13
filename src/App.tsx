import { Toaster } from "sonner"
import Pages from "@/pages"
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
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

