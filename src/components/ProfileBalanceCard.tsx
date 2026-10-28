import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileBalanceCard: React.FC = () => {
  const { user, balance, showBalance, toggleBalance } = useAuth();

  const formattedBalance = new Intl.NumberFormat('id-ID').format(balance);

  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Pengguna SIMS'
    : 'Kristanto Wibowo';

  const avatarSrc = user?.profile_image && user.profile_image !== 'null' && !user.profile_image.includes('null')
    ? user.profile_image
    : '/assets/Profile Photo.png';

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-center">
      {/* Left: User Welcome */}
      <div className="md:col-span-5 flex flex-row items-center gap-3.5 md:flex-col md:items-start md:gap-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full overflow-hidden md:mb-3 border border-gray-100 bg-gray-50 flex-shrink-0 shadow-xs">
          <img
            src={avatarSrc}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/Profile Photo.png';
            }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-gray-500 text-xs sm:text-sm md:text-base font-normal">Selamat datang,</p>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mt-0.5 truncate md:whitespace-normal">
            {displayName}
          </h1>
        </div>
      </div>

      {/* Right: Balance Card */}
      <div className="md:col-span-7">
        <div
          className="relative w-full rounded-2xl p-5 sm:p-6 md:p-7 text-white shadow-sm overflow-hidden flex flex-col justify-between min-h-[140px] sm:min-h-[155px] bg-[#f13b2c]"
          style={{
            backgroundImage: `url('/assets/Background Saldo.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div>
            <p className="text-white/90 text-xs sm:text-sm font-medium">Saldo anda</p>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mt-2 flex items-center">
              <span>Rp </span>
              <div className="ml-2.5 flex items-center">
                {showBalance ? (
                  <span className="font-mono tracking-tight">{formattedBalance}</span>
                ) : (
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 py-1">
                    {[...Array(7)].map((_, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white inline-block shadow-xs"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={toggleBalance}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/95 hover:text-white transition-all font-normal focus:outline-none cursor-pointer py-1 active:scale-95 select-none"
            >
              <span>{showBalance ? 'Tutup Saldo' : 'Lihat Saldo'}</span>
              {showBalance ? (
                <EyeOff className="w-4 h-4 text-white" />
              ) : (
                <Eye className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
