'use client'

import { usePrivy } from "@privy-io/react-auth"

export default function ConnectWalletButton() {
  const { login, logout, user, ready } = usePrivy()

  if (!ready) return null

  return (
    <div className="px-4 py-2 border-2 h-[8vh] border-text rounded-full 
                    flex items-center justify-center text-center">

      {/* Desktop */}
      <div className="hidden md:block">
        {!user ? (
          <button onClick={login}>Connect Wallet</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        {!user ? (
          <button onClick={login}>Connect</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>

    </div>
  )
}