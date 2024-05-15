import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import "normalize.css"
import "@/styles/globals.scss";
import { ErrorBoundary } from "react-error-boundary";
import { GoogleAnalytics } from "@next/third-parties/google"

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
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_TAG!} />
    </ErrorBoundary>
  </QueryClientProvider>
}

