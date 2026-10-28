import React, { useState } from 'react';
import {
  Wallet,
  QrCode,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

export interface PaymentOption {
  id: string;
  name: string;
  category: 'saldo' | 'va' | 'ewallet' | 'card';
  categoryLabel: string;
  description: string;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  bankCode?: string;
  fee: number;
  iconType: 'wallet' | 'bank' | 'qris' | 'card' | 'ewallet';
}

export const PAYMENT_METHODS: PaymentOption[] = [
  {
    id: 'saldo',
    name: 'Saldo SIMS PPOB',
    category: 'saldo',
    categoryLabel: 'Saldo Akun',
    description: 'Bayar instan langsung dari dompet SIMS',
    badge: 'Utama',
    badgeBg: 'bg-[#f13b2c]',
    badgeText: 'text-white',
    fee: 0,
    iconType: 'wallet',
  },
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    category: 'va',
    categoryLabel: 'Virtual Account',
    description: 'Verifikasi otomatis 24 jam',
    badge: 'BCA',
    badgeBg: 'bg-[#005baa]',
    badgeText: 'text-white',
    bankCode: 'BCA',
    fee: 0,
    iconType: 'bank',
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    category: 'va',
    categoryLabel: 'Virtual Account',
    description: 'Verifikasi otomatis 24 jam',
    badge: 'Mandiri',
    badgeBg: 'bg-[#003d79]',
    badgeText: 'text-white',
    bankCode: 'Mandiri',
    fee: 0,
    iconType: 'bank',
  },
  {
    id: 'bni_va',
    name: 'BNI Virtual Account',
    category: 'va',
    categoryLabel: 'Virtual Account',
    description: 'Verifikasi otomatis 24 jam',
    badge: 'BNI',
    badgeBg: 'bg-[#f15a24]',
    badgeText: 'text-white',
    bankCode: 'BNI',
    fee: 0,
    iconType: 'bank',
  },
  {
    id: 'bri_va',
    name: 'BRI Virtual Account',
    category: 'va',
    categoryLabel: 'Virtual Account',
    description: 'Verifikasi otomatis 24 jam',
    badge: 'BRI',
    badgeBg: 'bg-[#00529c]',
    badgeText: 'text-white',
    bankCode: 'BRI',
    fee: 0,
    iconType: 'bank',
  },
  {
    id: 'permata_va',
    name: 'Permata Virtual Account',
    category: 'va',
    categoryLabel: 'Virtual Account',
    description: 'Verifikasi otomatis 24 jam',
    badge: 'Permata',
    badgeBg: 'bg-[#1e7e34]',
    badgeText: 'text-white',
    bankCode: 'PERMATA',
    fee: 0,
    iconType: 'bank',
  },
  {
    id: 'cimb_va',
    name: 'CIMB Niaga Virtual Account',
    category: 'va',
    categoryLabel: 'Virtual Account',
    description: 'Verifikasi otomatis 24 jam',
    badge: 'CIMB',
    badgeBg: 'bg-[#b81d24]',
    badgeText: 'text-white',
    bankCode: 'CIMB',
    fee: 0,
    iconType: 'bank',
  },
  {
    id: 'qris',
    name: 'QRIS (Semua E-Wallet & M-Banking)',
    category: 'ewallet',
    categoryLabel: 'E-Wallet & QRIS',
    description: 'Scan via GoPay, OVO, Dana, LinkAja, BCA, dll.',
    badge: 'QRIS',
    badgeBg: 'bg-[#ea1c24]',
    badgeText: 'text-white',
    fee: 0,
    iconType: 'qris',
  },
  {
    id: 'gopay',
    name: 'GoPay',
    category: 'ewallet',
    categoryLabel: 'E-Wallet & QRIS',
    description: 'Bayar instan via aplikasi GoPay',
    badge: 'GoPay',
    badgeBg: 'bg-[#00aed6]',
    badgeText: 'text-white',
    fee: 0,
    iconType: 'ewallet',
  },
  {
    id: 'ovo',
    name: 'OVO',
    category: 'ewallet',
    categoryLabel: 'E-Wallet & QRIS',
    description: 'Bayar instan via OVO Cash',
    badge: 'OVO',
    badgeBg: 'bg-[#4c2a86]',
    badgeText: 'text-white',
    fee: 0,
    iconType: 'ewallet',
  },
  {
    id: 'dana',
    name: 'DANA',
    category: 'ewallet',
    categoryLabel: 'E-Wallet & QRIS',
    description: 'Bayar instan via Saldo DANA',
    badge: 'DANA',
    badgeBg: 'bg-[#118eea]',
    badgeText: 'text-white',
    fee: 0,
    iconType: 'ewallet',
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    category: 'ewallet',
    categoryLabel: 'E-Wallet & QRIS',
    description: 'Bayar instan via ShopeePay',
    badge: 'ShopeePay',
    badgeBg: 'bg-[#ee4d2d]',
    badgeText: 'text-white',
    fee: 0,
    iconType: 'ewallet',
  },
  {
    id: 'card',
    name: 'Kartu Debit / Kredit Online',
    category: 'card',
    categoryLabel: 'Kartu',
    description: 'Visa, Mastercard, JCB (3D Secure)',
    badge: 'Visa / MC',
    badgeBg: 'bg-gray-800',
    badgeText: 'text-white',
    fee: 0,
    iconType: 'card',
  },
];

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentOption;
  onSelectMethod: (method: PaymentOption) => void;
  balance: number;
  tariff: number;
  onNavigateTopUp?: () => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  balance,
  tariff,
  onNavigateTopUp,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'saldo' | 'va' | 'ewallet' | 'card'>('all');

  const formattedBalance = new Intl.NumberFormat('id-ID').format(balance);
  const isSaldoInsufficient = balance < tariff;

  const filteredMethods = PAYMENT_METHODS.filter((m) => {
    if (categoryFilter === 'all') return true;
    return m.category === categoryFilter;
  });

  const renderIcon = (option: PaymentOption) => {
    switch (option.iconType) {
      case 'wallet':
        return (
          <div className="w-10 h-10 rounded-lg bg-red-50 text-[#f13b2c] flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        );
      case 'bank':
        return (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xs ${option.badgeBg || 'bg-blue-600'} ${option.badgeText || 'text-white'}`}>
            {option.badge || 'BANK'}
          </div>
        );
      case 'qris':
        return (
          <div className="w-10 h-10 rounded-lg bg-red-100 text-[#ea1c24] flex items-center justify-center flex-shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
        );
      case 'ewallet':
        return (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-[10px] tracking-tight ${option.badgeBg || 'bg-cyan-500'} ${option.badgeText || 'text-white'}`}>
            {option.badge?.slice(0, 4) || 'E-W'}
          </div>
        );
      case 'card':
        return (
          <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs md:text-sm font-semibold text-gray-700 block">
          Metode Pembayaran
        </label>
        <span className="text-[11px] text-gray-400 font-medium">
          Biaya Transaksi: <span className="text-green-600 font-semibold">Gratis</span>
        </span>
      </div>

      {/* Selected Method Summary Box */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
          isExpanded
            ? 'border-[#f13b2c] bg-[#fffcfb] shadow-sm'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {renderIcon(selectedMethod)}
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 truncate">
                {selectedMethod.name}
              </span>
              {selectedMethod.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedMethod.badgeBg || 'bg-red-500'} ${selectedMethod.badgeText || 'text-white'}`}>
                  {selectedMethod.badge}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 truncate mt-0.5">
              {selectedMethod.id === 'saldo'
                ? `Sisa Saldo: Rp ${formattedBalance}`
                : selectedMethod.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <span className="text-xs font-semibold text-[#f13b2c] hidden sm:inline">
            {isExpanded ? 'Tutup' : 'Ubah Metode'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#f13b2c]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Saldo Insufficient Alert Banner if Saldo selected */}
      {selectedMethod.id === 'saldo' && isSaldoInsufficient && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#f13b2c] flex-shrink-0" />
            <span className="leading-snug">
              Saldo SIMS (Rp {formattedBalance}) tidak mencukupi untuk tagihan ini (Rp {new Intl.NumberFormat('id-ID').format(tariff)}).
            </span>
          </div>
          {onNavigateTopUp && (
            <button
              type="button"
              onClick={onNavigateTopUp}
              className="inline-flex items-center gap-1 font-bold text-[#f13b2c] hover:underline whitespace-nowrap cursor-pointer self-end sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Top Up Sekarang</span>
            </button>
          )}
        </div>
      )}

      {/* Expanded Payment Methods Drawer */}
      {isExpanded && (
        <div className="p-3 sm:p-5 bg-gray-50/70 border border-gray-200 rounded-xl space-y-3.5 sm:space-y-4 animate-fadeIn">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1 sm:mx-0 sm:px-0">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'saldo', label: 'Saldo Akun' },
              { id: 'va', label: 'Virtual Account' },
              { id: 'ewallet', label: 'E-Wallet & QRIS' },
              { id: 'card', label: 'Kartu Online' },
            ].map((cat) => {
              const active = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#f13b2c] text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Methods List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredMethods.map((method) => {
              const isSelected = selectedMethod.id === method.id;
              const isSaldo = method.id === 'saldo';
              const disabledSaldo = isSaldo && isSaldoInsufficient;

              return (
                <div
                  key={method.id}
                  onClick={() => {
                    onSelectMethod(method);
                    setIsExpanded(false);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-left ${
                    isSelected
                      ? 'border-[#f13b2c] bg-[#fff1f0] ring-1 ring-[#f13b2c]/30'
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  } ${disabledSaldo ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {renderIcon(method)}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {method.name}
                        </span>
                        {method.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${method.badgeBg || 'bg-red-500'} ${method.badgeText || 'text-white'}`}>
                            {method.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 block truncate mt-0.5">
                        {isSaldo ? `Sisa Saldo: Rp ${formattedBalance}` : method.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-[#f13b2c]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
