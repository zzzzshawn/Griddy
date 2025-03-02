'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export const QueryProvider = ({children}: {children: React.ReactNode}) => {
    const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const Providers = ({children}: {children: React.ReactNode}) => {
  return (
    <QueryProvider>
        {children}
    </QueryProvider>
  )
}

export default Providers