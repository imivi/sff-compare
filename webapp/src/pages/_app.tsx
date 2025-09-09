import "normalize.css"
import "@/styles/globals.scss";

import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  }
})

export default function App({ Component, pageProps }: AppProps) {
  return <QueryClientProvider client={queryClient}>
    <ErrorBoundary fallback={<p>An error occurred</p>}>
      <Component {...pageProps} />
    </ErrorBoundary>
  </QueryClientProvider>
}

