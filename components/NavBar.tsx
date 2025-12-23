"use client";

import CreateButton from "./CreateButton";
import ConnectWalletButton from "./ConnectWallet";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b top-0 z-40 relative">
      <div className="w-full mx-auto px-2 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-16 lg:h-[12vh]">
          {/* Logo*/}
          <div className="relative">
            <Link href={"/"}>
              <div className="flex cursor-pointer gap-2 px-2 items-center">
                <img src={"/images/token_logo.png"} className="h-6 md:h-8" />
                {/* <GiCrystalGrowth className="h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12 text-gray-900 p-2 border rounded-lg" />
              <span className="hidden md:block text-xl md:text-2xl lg:text-3xl font-title font-bold text-gray-900">
                Crystals
              </span> */}
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <CreateButton />
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
