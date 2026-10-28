import React, { useState } from 'react';
import { Wifi, Smartphone, Check, Sparkles, Clock } from 'lucide-react';
import { OperatorBadge } from './OperatorBadge';

export interface PulsaOption {
  id: string;
  name: string;
  amount: number;
  activePeriod: string;
  badge?: string;
}

export interface DataPackageOption {
  id: string;
  name: string;
  quotaMain: string;
  quotaApps?: string;
  period: string;
  category: 'bulanan' | 'mingguan' | 'harian' | 'unlimited';
  amount: number;
  badge?: string;
  badgeColor?: string;
  description: string;
}

export const AVAILABLE_PULSA: PulsaOption[] = [
  { id: 'p-10', name: 'Pulsa 10.000', amount: 10000, activePeriod: 'Masa aktif 15 hari' },
  { id: 'p-20', name: 'Pulsa 20.000', amount: 20000, activePeriod: 'Masa aktif 30 hari' },
  { id: 'p-25', name: 'Pulsa 25.000', amount: 25000, activePeriod: 'Masa aktif 30 hari' },
  { id: 'p-40', name: 'Pulsa 40.000', amount: 40000, activePeriod: 'Masa aktif 35 hari', badge: 'Standar' },
  { id: 'p-50', name: 'Pulsa 50.000', amount: 50000, activePeriod: 'Masa aktif 45 hari', badge: 'Populer' },
  { id: 'p-100', name: 'Pulsa 100.000', amount: 100000, activePeriod: 'Masa aktif 60 hari', badge: 'Terlaris' },
  { id: 'p-150', name: 'Pulsa 150.000', amount: 150000, activePeriod: 'Masa aktif 75 hari' },
  { id: 'p-200', name: 'Pulsa 200.000', amount: 200000, activePeriod: 'Masa aktif 90 hari' },
  { id: 'p-300', name: 'Pulsa 300.000', amount: 300000, activePeriod: 'Masa aktif 120 hari' },
  { id: 'p-500', name: 'Pulsa 500.000', amount: 500000, activePeriod: 'Masa aktif 150 hari' },
];

export const AVAILABLE_DATA_PACKAGES: DataPackageOption[] = [
  {
    id: 'd-daily-3gb',
    name: 'Paket Harian 3 GB',
    quotaMain: '3 GB Utama',
    period: '3 Hari',
    category: 'harian',
    amount: 15000,
    description: '3 GB Kuota Nasional 24 Jam',
  },
  {
    id: 'd-weekly-8gb',
    name: 'Paket Mingguan 8 GB',
    quotaMain: '8 GB Utama',
    period: '7 Hari',
    category: 'mingguan',
    amount: 35000,
    badge: 'Hemat',
    badgeColor: 'bg-green-100 text-green-700',
    description: '8 GB Kuota Nasional berlaku 7 hari',
  },
  {
    id: 'd-monthly-15gb',
    name: 'Bulanan Hemat 15 GB',
    quotaMain: '12 GB Utama',
    quotaApps: '+ 3 GB Apps & Chat',
    period: '30 Hari',
    category: 'bulanan',
    amount: 50000,
    badge: 'Favorit',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: '12 GB Kuota Utama + 3 GB Apps (WhatsApp, Zoom)',
  },
  {
    id: 'd-monthly-30gb',
    name: 'Bulanan Combo 30 GB',
    quotaMain: '25 GB Utama',
    quotaApps: '+ 5 GB Streaming',
    period: '30 Hari',
    category: 'bulanan',
    amount: 75000,
    badge: 'Terlaris',
    badgeColor: 'bg-[#f13b2c] text-white',
    description: '25 GB Utama + 5 GB YouTube, TikTok & Netflix',
  },
  {
    id: 'd-unlimited-50gb',
    name: 'Unlimited Nonstop 50 GB',
    quotaMain: '40 GB Utama',
    quotaApps: '+ FUP Unlimited',
    period: '30 Hari',
    category: 'unlimited',
    amount: 100000,
    badge: 'Unlimited',
    badgeColor: 'bg-purple-100 text-purple-700',
    description: '40 GB Utama + Akses nonstop tanpa batas kuota',
  },
  {
    id: 'd-jumbo-100gb',
    name: 'Super Kuota Jumbo 100 GB',
    quotaMain: '80 GB Utama',
    quotaApps: '+ 20 GB Sosmed/Video',
    period: '30 Hari',
    category: 'bulanan',
    amount: 150000,
    badge: 'Jumbo',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: '80 GB Utama + 20 GB Streaming & Sosmed 24 Jam',
  },
];

interface TelcoPackageSelectorProps {
  serviceCode: 'PULSA' | 'PAKET_DATA';
  selectedAmount: number;
  onSelectPackage: (pkg: { name: string; amount: number }) => void;
  operatorName?: string;
}

export const TelcoPackageSelector: React.FC<TelcoPackageSelectorProps> = ({
  serviceCode,
  selectedAmount,
  onSelectPackage,
  operatorName,
}) => {
  const [dataCategory, setDataCategory] = useState<'all' | 'bulanan' | 'mingguan' | 'harian' | 'unlimited'>('all');

  const filteredData = AVAILABLE_DATA_PACKAGES.filter((p) => {
    if (dataCategory === 'all') return true;
    return p.category === dataCategory;
  });

  return (
    <div className="w-full space-y-3.5 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {serviceCode === 'PAKET_DATA' ? (
            <Wifi className="w-4 h-4 text-[#f13b2c]" />
          ) : (
            <Smartphone className="w-4 h-4 text-[#f13b2c]" />
          )}
          <span className="text-xs md:text-sm font-semibold text-gray-800">
            {serviceCode === 'PAKET_DATA'
              ? 'Pilihan Paket Data yang Tersedia'
              : 'Pilihan Nominal Pulsa yang Tersedia'}
          </span>
        </div>

        {operatorName && <OperatorBadge operatorName={operatorName} size="sm" />}
      </div>

      {/* For Paket Data: Category Filters */}
      {serviceCode === 'PAKET_DATA' && (
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:mx-0 sm:px-0">
          {[
            { id: 'all', label: 'Semua Paket' },
            { id: 'bulanan', label: 'Bulanan' },
            { id: 'mingguan', label: 'Mingguan' },
            { id: 'harian', label: 'Harian' },
            { id: 'unlimited', label: 'Unlimited' },
          ].map((cat) => {
            const active = dataCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setDataCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#f13b2c] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Paket Data Grid */}
      {serviceCode === 'PAKET_DATA' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredData.map((pkg) => {
            const isSelected = selectedAmount === pkg.amount;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => onSelectPackage({ name: `Paket Data - ${pkg.name}`, amount: pkg.amount })}
                className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer active:scale-[0.99] ${
                  isSelected
                    ? 'border-[#f13b2c] bg-[#fff6f5] ring-2 ring-[#f13b2c]/30 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-xs font-bold text-gray-900 leading-tight">
                      {pkg.name}
                    </span>
                    {pkg.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${pkg.badgeColor || 'bg-red-500 text-white'}`}>
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-base font-extrabold text-gray-900">
                      {pkg.quotaMain}
                    </span>
                    {pkg.quotaApps && (
                      <span className="text-[10px] text-gray-500 font-medium truncate">
                        {pkg.quotaApps}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-2.5 sm:pt-3 mt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{pkg.period}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-[#f13b2c]">
                      Rp{new Intl.NumberFormat('id-ID').format(pkg.amount)}
                    </span>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#f13b2c] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Pulsa Grid */}
      {serviceCode === 'PULSA' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {AVAILABLE_PULSA.map((item) => {
            const isSelected = selectedAmount === item.amount;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPackage({ name: item.name, amount: item.amount })}
                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all relative flex flex-col justify-between cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-[#f13b2c] bg-[#fff6f5] ring-2 ring-[#f13b2c]/30 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {item.badge && (
                  <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#f13b2c] text-white shadow-xs">
                    {item.badge}
                  </span>
                )}

                <span className="text-xs sm:text-sm font-bold text-gray-900 block truncate">
                  Rp{new Intl.NumberFormat('id-ID').format(item.amount)}
                </span>

                <span className="text-[10px] text-gray-500 mt-1 block">
                  {item.activePeriod}
                </span>

                {isSelected && (
                  <div className="mt-1.5 sm:mt-2 flex justify-center">
                    <span className="text-[10px] font-bold text-[#f13b2c] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Dipilih
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <span>Pilihan paket di atas akan otomatis mengunci nominal total pembayaran.</span>
      </p>
    </div>
  );
};
