import CreateButton from './CreateButton';
import ConnectWalletButton from './ConnectWallet';
import { GiCrystalGrowth } from 'react-icons/gi';

export default function Navbar(){
  return (
    <nav className="bg-white border-b border-gray-200 top-0 z-40">
      <div className="w-full mx-auto px-2 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-[13vh]">

          {/* Logo / Icon */}
          <div className="flex cursor-pointer gap-2 items-center">
            <GiCrystalGrowth className="h-12 w-12 text-gray-900 px-2 py-2 border rounded-lg flex items-center justify-center" />
            <span className="text-xl md:text-2xl lg:text-3xl font-title font-bold text-gray-900">Crystals</span>
          </div>

          {/* Right-side Buttons */}
          <div className="flex items-center gap-3">
            <CreateButton />
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
