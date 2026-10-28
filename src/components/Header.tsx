import React from 'react';
import { Home as HomeIcon, PlusCircle, Receipt, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedService, user } = useAuth();

  const handleNav = (tab: string) => {
    if (tab === 'home') {
      setSelectedService(null);
    }
    setActiveTab(tab);
  };

  const avatarSrc =
    user?.profile_image && user.profile_image !== 'null' && !user.profile_image.includes('null')
      ? user.profile_image
      : '/assets/Profile Photo.png';

  return (
    <>
      {/* Top Header for all devices */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 py-3.5 px-4 sm:px-8 md:px-16 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none cursor-pointer"
          >
            <img src="/assets/Logo.png" alt="SIMS PPOB" className="w-6 h-6 object-contain" />
            <span className="font-bold text-gray-800 text-base md:text-lg tracking-tight">SIMS PPOB</span>
          </button>

          {/* Desktop & Tablet Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6 md:gap-10">
            <button
              onClick={() => handleNav('topup')}
              className={`text-sm md:text-base font-semibold transition-colors focus:outline-none cursor-pointer ${
                activeTab === 'topup' ? 'text-[#f13b2c]' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Top Up
            </button>
            <button
              onClick={() => handleNav('transaction')}
              className={`text-sm md:text-base font-semibold transition-colors focus:outline-none cursor-pointer ${
                activeTab === 'transaction' ? 'text-[#f13b2c]' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Transaction
            </button>
            <button
              onClick={() => handleNav('account')}
              className={`text-sm md:text-base font-semibold transition-colors focus:outline-none cursor-pointer ${
                activeTab === 'account' ? 'text-[#f13b2c]' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Akun
            </button>
          </nav>

          {/* Mobile Right: Quick Profile Avatar Button */}
          <button
            onClick={() => handleNav('account')}
            className="sm:hidden flex items-center gap-2 focus:outline-none cursor-pointer"
            title="Buka Profil Akun"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <img
                src={avatarSrc}
                alt="Profil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/Profile Photo.png';
                }}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Smartphones only: < sm) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-safe">
        <div className="grid grid-cols-4 items-center h-15 px-2 max-w-lg mx-auto">
          {/* 1. Beranda */}
          <button
            onClick={() => handleNav('home')}
            className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-95 cursor-pointer ${
              activeTab === 'home' ? 'text-[#f13b2c] font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >
            <HomeIcon className={`w-5 h-5 transition-colors ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px] mt-0.5">Beranda</span>
          </button>

          {/* 2. Top Up */}
          <button
            onClick={() => handleNav('topup')}
            className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-95 cursor-pointer ${
              activeTab === 'topup' ? 'text-[#f13b2c] font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >
            <PlusCircle className={`w-5 h-5 transition-colors ${activeTab === 'topup' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px] mt-0.5">Top Up</span>
          </button>

          {/* 3. Transaksi */}
          <button
            onClick={() => handleNav('transaction')}
            className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-95 cursor-pointer ${
              activeTab === 'transaction' ? 'text-[#f13b2c] font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >
            <Receipt className={`w-5 h-5 transition-colors ${activeTab === 'transaction' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px] mt-0.5">Transaksi</span>
          </button>

          {/* 4. Akun */}
          <button
            onClick={() => handleNav('account')}
            className={`flex flex-col items-center justify-center py-1 transition-transform active:scale-95 cursor-pointer ${
              activeTab === 'account' ? 'text-[#f13b2c] font-bold' : 'text-gray-400 font-medium hover:text-gray-600'
            }`}
          >
            <UserIcon className={`w-5 h-5 transition-colors ${activeTab === 'account' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[11px] mt-0.5">Akun</span>
          </button>
        </div>
      </nav>
    </>
  );
};

