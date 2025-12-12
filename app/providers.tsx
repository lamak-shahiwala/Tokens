'use client'

import React, { useEffect } from "react"
import { PrivyProvider } from '@privy-io/react-auth'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const origConsoleError = console.error

    console.error = (...args: any[]) => {
      try {
        const msg = typeof args[0] === 'string' ? args[0] : ''
        if (msg.includes('Each child in a list should have a unique "key" prop.')) {
          return
        }
      } catch {
      }

      origConsoleError.apply(console, args)
    }

    return () => {
      console.error = origConsoleError
    }
  }, [])

  return (
    <React.Fragment key="privy-root">
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          appearance: { theme: "light" },
          loginMethods: ["wallet"],
        }}
      >
        {children}
      </PrivyProvider>
    </React.Fragment>
  )
}