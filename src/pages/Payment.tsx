import React, { useState, useEffect, useId } from 'react';
import {
  Banknote,
  Hash,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Smartphone,
  Zap,
  Droplet,
  Tv,
  Flame,
  Gamepad2,
  Music,
  Heart,
  Sparkles,
  Calculator,
  UtensilsCrossed,
  ShieldCheck,
  Building2,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProfileBalanceCard } from '../components/ProfileBalanceCard';
import { Modal } from '../components/Modal';
import {
  PaymentMethodSelector,
  PAYMENT_METHODS,
  type PaymentOption,
} from '../components/PaymentMethodSelector';
import { PaymentInstructionModal } from '../components/PaymentInstructionModal';
import { TelcoPackageSelector } from '../components/TelcoPackageSelector';
import { OperatorBadge } from '../components/OperatorBadge';
import { ZakatCalculatorModal } from '../components/ZakatCalculatorModal';
import { apiService } from '../services/api';
import type { ServiceItem } from '../types';
import {
  TV_PROVIDERS,
  MUSIC_PROVIDERS,
  MUSIC_PACKAGES,
  GAME_LIST,
  GAME_PACKAGES,
  FOOD_MERCHANTS,
  FOOD_PACKAGES,
  KURBAN_INSTITUTIONS,
  KURBAN_PACKAGES,
  ZAKAT_TYPES,
  ZAKAT_INSTITUTIONS,
  ZAKAT_PRESETS,
} from '../data/paymentData';

export const Payment: React.FC = () => {
  const { selectedService, refreshBalance, setActiveTab, balance, user } = useAuth();
  const inputId = useId();
  const zoneInputId = useId();

  // Fallback default service if user directly enters payment
  const activeService: ServiceItem = selectedService || {
    service_code: 'PAJAK',
    service_name: 'PBB',
    service_icon: '/assets/PBB.png',
    service_tariff: 25000,
  };

  const isTelco =
    activeService.service_code === 'PULSA' ||
    activeService.service_code === 'PAKET_DATA';

  const isPln = activeService.service_code === 'PLN';
  const isPbb = activeService.service_code === 'PAJAK';
  const isPgn = activeService.service_code === 'PGN';
  const isTv = activeService.service_code === 'TV';
  const isMusik = activeService.service_code === 'MUSIK';
  const isGame = activeService.service_code === 'VOUCHER_GAME';
  const isFood = activeService.service_code === 'VOUCHER_MAKANAN';
  const isKurban = activeService.service_code === 'KURBAN';
  const isZakat = activeService.service_code === 'ZAKAT';
  const isPdam = activeService.service_code === 'PDAM';

  // Sub-provider states
  const [selectedTvProvider, setSelectedTvProvider] = useState(TV_PROVIDERS[0]);
  const [selectedMusicProvider, setSelectedMusicProvider] = useState(MUSIC_PROVIDERS[0]);
  const [selectedGame, setSelectedGame] = useState(GAME_LIST[0]);
  const [gameZoneId, setGameZoneId] = useState('2034');
  const [selectedFoodMerchant, setSelectedFoodMerchant] = useState(FOOD_MERCHANTS[0]);
  const [selectedKurbanInstitution, setSelectedKurbanInstitution] = useState(KURBAN_INSTITUTIONS[0]);
  const [selectedZakatType, setSelectedZakatType] = useState(ZAKAT_TYPES[0]);
  const [selectedZakatInstitution, setSelectedZakatInstitution] = useState(ZAKAT_INSTITUTIONS[0]);

  // Zakat Calculator & custom amount states
  const [isZakatCalculatorOpen, setIsZakatCalculatorOpen] = useState(false);
  const [isCustomZakat, setIsCustomZakat] = useState(false);

  // Form States
  const [customerId, setCustomerId] = useState<string>('');
  const [customerError, setCustomerError] = useState<string>('');

  // Initial amount & package name calculation helper
  const getInitialTariff = () => {
    if (isPln) return 20000;
    if (isMusik) return 54990;
    if (isGame) return 50000;
    if (isFood) return 50000;
    if (isKurban) return 1950000;
    if (isZakat) return 100000;
    return activeService.service_tariff || 25000;
  };

  const [numericAmount, setNumericAmount] = useState<number>(getInitialTariff);
  const [packageName, setPackageName] = useState<string>(activeService.service_name);

  // Sync state when service changes
  useEffect(() => {
    const tariff = getInitialTariff();
    setNumericAmount(tariff);

    if (isPln) {
      setPackageName('Token Listrik Rp 20.000');
    } else if (isPbb) {
      setPackageName('PBB - Pajak Bumi dan Bangunan');
    } else if (isPgn) {
      setPackageName('PGN Gas Bumi Mandiri');
    } else if (isTv) {
      setPackageName(`${selectedTvProvider.name} - Tagihan Bulanan`);
    } else if (isMusik) {
      const pkg = MUSIC_PACKAGES[selectedMusicProvider.id]?.[1] || MUSIC_PACKAGES['spotify'][1];
      setPackageName(`${selectedMusicProvider.name} - ${pkg.name}`);
      setNumericAmount(pkg.amount);
    } else if (isGame) {
      const pkg = GAME_PACKAGES[selectedGame.id]?.[2] || GAME_PACKAGES['mlbb'][2];
      setPackageName(`${selectedGame.name} - ${pkg.name}`);
      setNumericAmount(pkg.amount);
    } else if (isFood) {
      const pkg = FOOD_PACKAGES[selectedFoodMerchant.id]?.[1] || FOOD_PACKAGES['kfc'][1];
      setPackageName(pkg.name);
      setNumericAmount(pkg.amount);
    } else if (isKurban) {
      const pkg = KURBAN_PACKAGES[0];
      setPackageName(`Kurban - ${pkg.name}`);
      setNumericAmount(pkg.amount);
    } else if (isZakat) {
      setPackageName(selectedZakatType.name);
    } else {
      setPackageName(activeService.service_name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeService.service_code]);

  // Dynamic Service Metadata according to PDF guidelines
  const getServiceMetadata = () => {
    switch (activeService.service_code) {
      case 'PLN':
        return {
          label: 'Nomor Meter / ID Pelanggan PLN',
          placeholder: 'Contoh: 1423 4567 8901 (11-12 digit)',
          sample: '142345678901',
          icon: Zap,
        };
      case 'PAJAK':
        return {
          label: 'Nomor Objek Pajak (NOP)',
          placeholder: 'Contoh: 3201.092.837.461-001.0',
          sample: '3201092837461001',
          icon: FileText,
        };
      case 'PULSA':
      case 'PAKET_DATA':
        return {
          label: 'Nomor Handphone / Ponsel',
          placeholder: 'Contoh: 0812 3456 7890',
          sample: '081234567890',
          icon: Smartphone,
        };
      case 'PDAM':
        return {
          label: 'Nomor Sambungan / ID Pelanggan PDAM',
          placeholder: 'Contoh: 0092 8374 61',
          sample: '0092837461',
          icon: Droplet,
        };
      case 'PGN':
        return {
          label: 'Nomor Pelanggan Gas (PGN)',
          placeholder: 'Contoh: 1002 9384 75',
          sample: '1002938475',
          icon: Flame,
        };
      case 'TV':
        return {
          label: 'Nomor Pelanggan TV Kabel / Parabola',
          placeholder: 'Contoh: 8819 2039 48',
          sample: '8819203948',
          icon: Tv,
        };
      case 'VOUCHER_GAME':
        return {
          label: selectedGame.idLabel,
          placeholder: selectedGame.idPlaceholder,
          sample: '19827364',
          icon: Gamepad2,
        };
      case 'MUSIK': {
        const platformPlaceholders: Record<string, string> = {
          spotify: 'Contoh: akun@gmail.com atau Username Spotify',
          youtube: 'Contoh: akun@gmail.com (Google Account)',
          apple: 'Contoh: akun@icloud.com (Apple ID)',
          joox: 'Contoh: akun@gmail.com atau Joox ID',
        };
        return {
          label: 'Email / ID Akun Musik',
          placeholder: platformPlaceholders[selectedMusicProvider.id] || 'Contoh: akun@gmail.com atau ID Akun',
          sample: 'user.sims@gmail.com',
          icon: Music,
        };
      }
      case 'VOUCHER_MAKANAN':
        return {
          label: 'Nomor Handphone Tujuan (Penerima Voucher)',
          placeholder: 'Contoh: 0812 3456 7890 (Kode e-voucher via SMS/WhatsApp)',
          sample: '081234567890',
          icon: UtensilsCrossed,
        };
      case 'KURBAN':
        return {
          label: 'Nama Shohibul Kurban / Pekurban',
          placeholder: 'Contoh: Muhammad Ihsan Aulia Rahman (081234567890)',
          sample: 'Muhammad Ihsan Aulia Rahman',
          icon: Heart,
        };
      case 'ZAKAT':
        return {
          label: 'Nama Muzakki / No. HP',
          placeholder: 'Contoh: Muhammad Ihsan (081234567890)',
          sample: 'Muhammad Ihsan (081234567890)',
          icon: Heart,
        };
      default:
        return {
          label: 'ID Pelanggan / Nomor Tagihan',
          placeholder: 'Masukkan ID Pelanggan atau Nomor Tagihan',
          sample: '320188927162',
          icon: Hash,
        };
    }
  };

  const meta = getServiceMetadata();
  const IconComponent = meta.icon;

  // Auto-Detect Operator from Phone Number
  const detectOperatorName = (phone: string): string | undefined => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 4) return undefined;
    const prefix = clean.slice(0, 4);
    if (/^(0811|0812|0813|0821|0822|0823|0851|0852|0853)/.test(prefix)) return 'Telkomsel';
    if (/^(0814|0815|0816|0855|0856|0857|0858)/.test(prefix)) return 'Indosat IM3';
    if (/^(0817|0818|0819|0859|0877|0878)/.test(prefix)) return 'XL Axiata';
    if (/^(0831|0832|0838)/.test(prefix)) return 'AXIS';
    if (/^(0895|0896|0897|0898|0899)/.test(prefix)) return 'Tri (3)';
    if (/^(0881|0882|0883|0884|0885|0886|0887|0888|0889)/.test(prefix)) return 'Smartfren';
    return undefined;
  };

  const detectedOperator = isTelco ? detectOperatorName(customerId) : undefined;

  // Selected payment method
  const [selectedMethod, setSelectedMethod] = useState<PaymentOption>(() => {
    return balance >= getInitialTariff()
      ? PAYMENT_METHODS[0]
      : PAYMENT_METHODS[1];
  });

  // Modal States
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'success' | 'failed';
    amount: number;
    paymentMethodName?: string;
    invoiceNumber?: string;
  }>({
    isOpen: false,
    type: 'confirm',
    amount: getInitialTariff(),
  });

  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerId(e.target.value);
    if (customerError) setCustomerError('');
  };

  const handleUseSample = () => {
    setCustomerId(meta.sample);
    if (customerError) setCustomerError('');
  };

  const handleClearInput = () => {
    setCustomerId('');
    setCustomerError('');
  };

  // Change sub-providers handlers
  const handleSelectTvProvider = (provider: typeof TV_PROVIDERS[0]) => {
    setSelectedTvProvider(provider);
    setPackageName(`${provider.name} - Tagihan Bulanan`);
  };

  const handleSelectMusicProvider = (prov: typeof MUSIC_PROVIDERS[0]) => {
    setSelectedMusicProvider(prov);
    const pkgs = MUSIC_PACKAGES[prov.id] || [];
    const firstPkg = pkgs[0] || { name: `${prov.name} 1 Bulan`, amount: 49000 };
    setNumericAmount(firstPkg.amount);
    setPackageName(`${prov.name} - ${firstPkg.name}`);
  };

  const handleSelectGame = (g: typeof GAME_LIST[0]) => {
    setSelectedGame(g);
    const pkgs = GAME_PACKAGES[g.id] || [];
    const firstPkg = pkgs[0] || { name: 'Item Voucher', amount: 50000 };
    setNumericAmount(firstPkg.amount);
    setPackageName(`${g.name} - ${firstPkg.name}`);
  };

  const handleSelectFoodMerchant = (m: typeof FOOD_MERCHANTS[0]) => {
    setSelectedFoodMerchant(m);
    const pkgs = FOOD_PACKAGES[m.id] || [];
    const firstPkg = pkgs[0] || { name: `Voucher ${m.name} Rp 50.000`, amount: 50000 };
    setNumericAmount(firstPkg.amount);
    setPackageName(firstPkg.name);
  };

  // Handle preset package selection (Pulsa / Paket Data)
  const handleSelectTelcoPackage = (pkg: { name: string; amount: number }) => {
    setNumericAmount(pkg.amount);
    setPackageName(pkg.name);
  };

  // Handle custom zakat input
  const handleCustomZakatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const val = parseInt(raw, 10) || 0;
    setNumericAmount(val);
  };

  const handleApplyZakatFromCalculator = (amt: number) => {
    setIsCustomZakat(true);
    setNumericAmount(amt);
    setPackageName(`Zakat Penghasilan (Hasil Hitung Kalkulator)`);
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: ID Pelanggan / Nomor
    if (!customerId.trim()) {
      setCustomerError(`${meta.label} wajib diisi`);
      return;
    }

    if (numericAmount <= 0) {
      setCustomerError('Nominal pembayaran harus lebih dari Rp 0');
      return;
    }

    // Validation: Saldo Insufficient Check
    if (selectedMethod.id === 'saldo' && balance < numericAmount) {
      setCustomerError(
        'Saldo SIMS PPOB Anda tidak mencukupi. Silakan pilih metode pembayaran lain atau lakukan Top Up.'
      );
      return;
    }

    setModalState({
      isOpen: true,
      type: 'confirm',
      amount: numericAmount,
      paymentMethodName: selectedMethod.name,
    });
  };

  const executePayment = async (vaNumber?: string) => {
    setIsProcessing(true);
    const effectivePaymentMethod = vaNumber
      ? `${selectedMethod.name} (${vaNumber})`
      : selectedMethod.name;

    try {
      const res = await apiService.createTransaction(
        activeService.service_code,
        customerId.trim(),
        effectivePaymentMethod,
        numericAmount,
        packageName
      );
      setIsProcessing(false);
      await refreshBalance();

      if (res.status === 0 && res.data) {
        setModalState({
          isOpen: true,
          type: 'success',
          amount: numericAmount,
          paymentMethodName: effectivePaymentMethod,
          invoiceNumber: res.data.invoice_number,
        });
      } else {
        setModalState((prev) => ({
          ...prev,
          isOpen: true,
          type: 'failed',
        }));
      }
    } catch {
      setIsProcessing(false);
      setModalState((prev) => ({
        ...prev,
        isOpen: true,
        type: 'failed',
      }));
    }
  };

  const handleConfirmPayment = async () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));

    if (selectedMethod.id === 'saldo') {
      await executePayment();
    } else {
      setIsInstructionOpen(true);
    }
  };

  const handleInstructionSuccess = async (vaNumber?: string) => {
    setIsInstructionOpen(false);
    await executePayment(vaNumber);
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setActiveTab('home');
  };

  const customerDisplayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'MUHAMMAD IHSAN'
    : 'MUHAMMAD IHSAN';

  const showVerificationBox = customerId.trim().length >= 3;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-5 sm:py-8 space-y-7 sm:space-y-10">
      {/* Profile & Saldo Card */}
      <ProfileBalanceCard />

      {/* Payment Section */}
      <section className="w-full pt-1 sm:pt-4">
        <p className="text-gray-500 text-xs sm:text-sm md:text-base font-normal">Pembayaran</p>

        {/* Header Title & Subtitle */}
        <div className="flex items-center gap-3 sm:gap-3.5 mt-1 sm:mt-1.5 mb-5 sm:mb-7">
          <div className="w-10 h-10 rounded-xl bg-gray-50 p-1.5 border border-gray-100 flex items-center justify-center flex-shrink-0">
            <img
              src={activeService.service_icon}
              alt={activeService.service_name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/Listrik.png';
              }}
            />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              {activeService.service_name}
            </h2>
            {isTelco && (
              <p className="text-xs text-gray-500 font-medium">
                {activeService.service_code === 'PAKET_DATA'
                  ? 'Pilih paket kuota data yang tersedia'
                  : 'Pilih denominasi pulsa yang tersedia'}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleOpenConfirm} className="w-full space-y-6 max-w-3xl">
          {/* ============================================================== */}
          {/* PROVIDER / CATEGORY SELECTORS (Required per service in PDF)    */}
          {/* ============================================================== */}

          {/* 1. TV Langganan: Dropdown Pemilihan Provider (PDF Page 6) */}
          {isTv && (
            <div className="space-y-1.5">
              <label className="text-xs md:text-sm font-semibold text-gray-700 block">
                Pilih Penyedia Layanan TV Kabel <span className="text-[#f13b2c]">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedTvProvider.id}
                  onChange={(e) => {
                    const found = TV_PROVIDERS.find((p) => p.id === e.target.value);
                    if (found) handleSelectTvProvider(found);
                  }}
                  className="w-full py-3 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:border-gray-500 focus:outline-none cursor-pointer appearance-none shadow-xs"
                >
                  {TV_PROVIDERS.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                  <Tv className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* 2. Musik: Dropdown / Grid Pemilihan Platform (PDF Page 6 & 7) */}
          {isMusik && (
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-semibold text-gray-700 block">
                Pilih Layanan / Platform Musik <span className="text-[#f13b2c]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MUSIC_PROVIDERS.map((prov) => {
                  const isSelected = selectedMusicProvider.id === prov.id;
                  return (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => handleSelectMusicProvider(prov)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'border-[#f13b2c] bg-[#fff6f5] text-[#f13b2c] ring-1 ring-[#f13b2c]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {prov.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Voucher Game: Grid Pilihan Spesifik Judul Game (PDF Page 8) */}
          {isGame && (
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-semibold text-gray-700 block">
                Pilih Judul Game <span className="text-[#f13b2c]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GAME_LIST.map((g) => {
                  const isSelected = selectedGame.id === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleSelectGame(g)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#f13b2c] bg-[#fff6f5] ring-2 ring-[#f13b2c]/30'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Gamepad2 className={`w-4 h-4 ${isSelected ? 'text-[#f13b2c]' : 'text-gray-400'}`} />
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#f13b2c]' : 'text-gray-900'}`}>
                          {g.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Voucher Makanan: Grid Logo/Pilihan Merchant (PDF Page 9) */}
          {isFood && (
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-semibold text-gray-700 block">
                Pilih Restoran / Merchant <span className="text-[#f13b2c]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FOOD_MERCHANTS.map((m) => {
                  const isSelected = selectedFoodMerchant.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectFoodMerchant(m)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#f13b2c] bg-[#fff6f5] ring-2 ring-[#f13b2c]/30'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-xs font-bold block truncate ${isSelected ? 'text-[#f13b2c]' : 'text-gray-900'}`}>
                        {m.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Kurban: Dropdown Mitra Lembaga Penyalur (PDF Page 11) */}
          {isKurban && (
            <div className="space-y-1.5">
              <label className="text-xs md:text-sm font-semibold text-gray-700 block">
                Pilih Lembaga Amil Penyalur Kurban <span className="text-[#f13b2c]">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedKurbanInstitution.id}
                  onChange={(e) => {
                    const found = KURBAN_INSTITUTIONS.find((i) => i.id === e.target.value);
                    if (found) setSelectedKurbanInstitution(found);
                  }}
                  className="w-full py-3 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:border-gray-500 focus:outline-none cursor-pointer appearance-none shadow-xs"
                >
                  {KURBAN_INSTITUTIONS.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* 6. Zakat: Jenis Zakat & Lembaga Penyalur (PDF Page 12) */}
          {isZakat && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs md:text-sm font-semibold text-gray-700 block">
                  Pilih Jenis Zakat <span className="text-[#f13b2c]">*</span>
                </label>
                <select
                  value={selectedZakatType.id}
                  onChange={(e) => {
                    const found = ZAKAT_TYPES.find((t) => t.id === e.target.value);
                    if (found) {
                      setSelectedZakatType(found);
                      setPackageName(found.name);
                    }
                  }}
                  className="w-full py-3 px-3.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm text-gray-900 font-medium focus:border-gray-500 focus:outline-none cursor-pointer shadow-xs"
                >
                  {ZAKAT_TYPES.map((zt) => (
                    <option key={zt.id} value={zt.id}>
                      {zt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs md:text-sm font-semibold text-gray-700 block">
                  Lembaga Amil Zakat (LAZ) <span className="text-[#f13b2c]">*</span>
                </label>
                <select
                  value={selectedZakatInstitution.id}
                  onChange={(e) => {
                    const found = ZAKAT_INSTITUTIONS.find((i) => i.id === e.target.value);
                    if (found) setSelectedZakatInstitution(found);
                  }}
                  className="w-full py-3 px-3.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm text-gray-900 font-medium focus:border-gray-500 focus:outline-none cursor-pointer shadow-xs"
                >
                  {ZAKAT_INSTITUTIONS.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* INPUT ID / NOMOR / ACCOUNT FORM FIELD                          */}
          {/* ============================================================== */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
              <div className="flex items-center gap-2">
                <label
                  htmlFor={inputId}
                  className="text-xs md:text-sm font-semibold text-gray-700 block"
                >
                  {meta.label} <span className="text-[#f13b2c]">*</span>
                </label>
                {detectedOperator && <OperatorBadge operatorName={detectedOperator} size="sm" />}
              </div>

              <button
                type="button"
                onClick={handleUseSample}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#f13b2c] hover:underline cursor-pointer flex-shrink-0"
              >
                <Sparkles className="w-3 h-3" />
                <span>Gunakan Contoh ID</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <IconComponent className="w-4 h-4" />
                </div>

                <input
                  id={inputId}
                  type="text"
                  value={customerId}
                  onChange={handleInputChange}
                  placeholder={meta.placeholder}
                  className={`w-full pl-10 pr-10 py-3 text-base sm:text-sm md:text-base border rounded-lg transition-colors text-gray-900 placeholder:text-gray-400 focus:outline-none shadow-xs ${
                    customerError
                      ? 'border-[#f13b2c] bg-red-50/20 focus:border-[#f13b2c]'
                      : 'border-gray-300 focus:border-gray-500 bg-white'
                  }`}
                />

                {customerId && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Khusus Game dengan Zone ID / Server (seperti MLBB / Genshin) */}
              {isGame && selectedGame.hasZoneId && (
                <div className="w-full sm:w-32 relative">
                  <input
                    id={zoneInputId}
                    type="text"
                    value={gameZoneId}
                    onChange={(e) => setGameZoneId(e.target.value)}
                    placeholder={selectedGame.zonePlaceholder || 'Zone ID'}
                    className="w-full py-3 px-3 text-base sm:text-sm border border-gray-300 rounded-lg text-gray-900 font-medium focus:border-gray-500 focus:outline-none shadow-xs text-center"
                  />
                </div>
              )}
            </div>

            {customerError && (
              <p className="text-xs text-[#f13b2c] flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{customerError}</span>
              </p>
            )}

            {/* ============================================================== */}
            {/* MANDATORY VALIDATION DETAIL BOXES BEFORE PAYMENT (PER PDF)     */}
            {/* ============================================================== */}

            {/* 1. PBB: Blok Validasi Detail Wajib Pajak (PDF Page 1) */}
            {isPbb && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    Validasi Detail Wajib Pajak (NOP Terverifikasi)
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Siap Bayar
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nama Wajib Pajak</span>
                    <span className="font-bold text-gray-900 block">BAMBANG SUDIBYO</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nomor Objek Pajak (NOP)</span>
                    <span className="font-mono font-medium text-gray-900 block">{customerId}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-gray-400 block">Alamat Objek Pajak</span>
                    <span className="font-medium text-gray-800 block">
                      Jl. Margonda Raya No. 45, Beji, Kota Depok, Jawa Barat 16424
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Tahun Pajak SPPT</span>
                    <span className="font-semibold text-gray-800 block">2024 (PBB-P2)</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Total Pokok Tagihan</span>
                    <span className="font-bold text-[#f13b2c] block">
                      Rp {new Intl.NumberFormat('id-ID').format(numericAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PLN: Blok Validasi Identitas Pelanggan PLN (PDF Page 2) */}
            {isPln && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Identitas Pelanggan PLN Terverifikasi
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Valid
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nama Pelanggan</span>
                    <span className="font-bold text-gray-900 block truncate">MUHAMMAD IHSAN</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Tarif / Daya Listrik</span>
                    <span className="font-bold text-gray-900 block">R1 / 900 VA</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nomor Meter / IDPEL</span>
                    <span className="font-mono font-medium text-gray-900 block">{customerId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Token yang Dipilih</span>
                    <span className="font-bold text-[#f13b2c] block">
                      Rp {new Intl.NumberFormat('id-ID').format(numericAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PGN: Detail Pelanggan, Periode & Pemakaian (PDF Page 5) */}
            {isPgn && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Detail Pelanggan Gas PGN
                  </span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Tagihan Terbit
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nama Pelanggan</span>
                    <span className="font-bold text-gray-900 block">BAPAK AGUS SETIAWAN</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Periode Tagihan</span>
                    <span className="font-bold text-gray-900 block">Oktober 2024</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Pemakaian Gas</span>
                    <span className="font-bold text-gray-900 block">24 m³ (Rumah Tangga RT-1)</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nominal Tagihan Gas</span>
                    <span className="font-bold text-[#f13b2c] block">
                      Rp {new Intl.NumberFormat('id-ID').format(numericAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. TV Kabel: Ringkasan Pelanggan, Provider & Periode (PDF Page 6) */}
            {isTv && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-blue-500" />
                    Detail Pelanggan TV Berlangganan
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Aktif
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nama Pelanggan</span>
                    <span className="font-bold text-gray-900 block">HENDRA WIJAYA</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Penyedia Layanan</span>
                    <span className="font-bold text-gray-900 block">{selectedTvProvider.name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Periode Tagihan</span>
                    <span className="font-bold text-gray-900 block">Oktober 2024</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nominal Tagihan</span>
                    <span className="font-bold text-[#f13b2c] block">
                      Rp {new Intl.NumberFormat('id-ID').format(numericAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Musik: Validasi Akun Tujuan & Paket (PDF Page 7) */}
            {isMusik && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-purple-600" />
                    Ringkasan Akun Tujuan Musik
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Siap Berlangganan
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nama Pemilik Akun</span>
                    <span className="font-bold text-gray-900 block truncate">Ihsan (Terverifikasi)</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Platform Layanan</span>
                    <span className="font-bold text-gray-900 block">{selectedMusicProvider.name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Akun / Email</span>
                    <span className="font-mono text-gray-900 block truncate">{customerId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Paket yang Dibeli</span>
                    <span className="font-semibold text-gray-800 block truncate">{packageName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Voucher Game: Validasi Nickname In-Game (PDF Page 8) */}
            {isGame && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Validasi Nickname In-Game Terverifikasi
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Akun Ditemukan
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nickname Akun</span>
                    <span className="font-extrabold text-[#f13b2c] block text-sm">
                      {selectedGame.mockNicknames[0] || 'Alucard_Pro'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Game</span>
                    <span className="font-bold text-gray-900 block">{selectedGame.name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">User ID / Server</span>
                    <span className="font-mono text-gray-900 block truncate">
                      {customerId} {selectedGame.hasZoneId ? `(${gameZoneId})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Item Voucher</span>
                    <span className="font-bold text-gray-900 block truncate">{packageName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Voucher Makanan: Ringkasan Pembelian & Tujuan Pengiriman (PDF Page 9 & 10) */}
            {isFood && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                    Ringkasan Pembelian E-Voucher Makanan
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Voucher Resmi
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nama Merchant</span>
                    <span className="font-bold text-gray-900 block">{selectedFoodMerchant.name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nilai Voucher</span>
                    <span className="font-bold text-[#f13b2c] block">
                      Rp {new Intl.NumberFormat('id-ID').format(numericAmount)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] text-gray-400 block">Tujuan Pengiriman Kode Voucher</span>
                    <span className="font-mono font-bold text-gray-900 block">
                      {customerId} (Kode e-voucher digital instan via WhatsApp/SMS)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Kurban: Ringkasan Shohibul Kurban & Penyalur (PDF Page 10 & 11) */}
            {isKurban && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    Data Shohibul Kurban Terverifikasi
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Amanah
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nama Shohibul Kurban</span>
                    <span className="font-bold text-gray-900 block truncate">{customerId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Mitra Penyalur Resmi</span>
                    <span className="font-bold text-gray-900 block">{selectedKurbanInstitution.name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Tipe Hewan Kurban</span>
                    <span className="font-bold text-gray-900 block">{packageName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Total Biaya Kurban</span>
                    <span className="font-bold text-[#f13b2c] block">
                      Rp {new Intl.NumberFormat('id-ID').format(numericAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 9. Zakat: Ringkasan Muzakki & Niat Akad (PDF Page 12) */}
            {isZakat && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Data Penunaian Zakat
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Siap Disalurkan
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nama Muzakki</span>
                    <span className="font-bold text-gray-900 block truncate">{customerId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Jenis Zakat</span>
                    <span className="font-bold text-gray-900 block">{selectedZakatType.name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Lembaga Amil Zakat</span>
                    <span className="font-bold text-gray-900 block">{selectedZakatInstitution.name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nominal Zakat</span>
                    <span className="font-bold text-[#f13b2c] block">
                      Rp {new Intl.NumberFormat('id-ID').format(numericAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 10. PDAM: Blok Validasi Sambungan PDAM */}
            {isPdam && showVerificationBox && !customerError && (
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-blue-500 fill-blue-500" />
                    Data Sambungan PDAM Terverifikasi
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Tagihan Siap Bayar
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nama Pelanggan</span>
                    <span className="font-bold text-gray-900 block truncate">{customerDisplayName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nomor Sambungan</span>
                    <span className="font-mono text-gray-900 block">{customerId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Periode</span>
                    <span className="font-bold text-gray-900 block">Oktober 2024</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nominal Tagihan Air</span>
                    <span className="font-bold text-[#f13b2c] block">
                      Rp {new Intl.NumberFormat('id-ID').format(numericAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* PACKAGE / NOMINAL CHIP SELECTORS PER SERVICE                   */}
          {/* ============================================================== */}

          {/* A. Pilihan Paket Pulsa / Paket Data (PDF Page 3 & 13) */}
          {isTelco && (
            <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl">
              <TelcoPackageSelector
                serviceCode={activeService.service_code as 'PULSA' | 'PAKET_DATA'}
                selectedAmount={numericAmount}
                onSelectPackage={handleSelectTelcoPackage}
                operatorName={detectedOperator}
              />
            </div>
          )}

          {/* B. Pilihan Nominal Token PLN - Sinkron & Active State (PDF Page 2) */}
          {isPln && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Pilihan Nominal Token Listrik (PLN)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[20000, 50000, 100000, 200000, 500000, 1000000].map((nom) => {
                  const isSelected = numericAmount === nom;
                  return (
                    <button
                      key={nom}
                      type="button"
                      onClick={() => {
                        setNumericAmount(nom);
                        setPackageName(`Token Listrik Rp ${new Intl.NumberFormat('id-ID').format(nom)}`);
                      }}
                      className={`py-2.5 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#f13b2c] bg-[#fff6f5] text-[#f13b2c] ring-2 ring-[#f13b2c]/40 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Rp{new Intl.NumberFormat('id-ID').format(nom)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* C. Pilihan Paket Musik via Chip (PDF Page 7) */}
          {isMusik && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Pilihan Paket Langganan {selectedMusicProvider.name}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(MUSIC_PACKAGES[selectedMusicProvider.id] || []).map((pkg) => {
                  const isSelected = numericAmount === pkg.amount && packageName.includes(pkg.name);
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setNumericAmount(pkg.amount);
                        setPackageName(`${selectedMusicProvider.name} - ${pkg.name}`);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#f13b2c] bg-[#fff6f5] ring-2 ring-[#f13b2c]/30 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-gray-900">{pkg.name}</span>
                          {pkg.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#f13b2c] text-white">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        {pkg.itemDescription && (
                          <p className="text-[11px] text-gray-500 line-clamp-2">{pkg.itemDescription}</p>
                        )}
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#f13b2c]">
                          Rp{new Intl.NumberFormat('id-ID').format(pkg.amount)}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-[#f13b2c] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Dipilih
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* D. Pilihan Item Voucher Game via Chip (PDF Page 8) */}
          {isGame && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Pilih Nominal Item / Voucher {selectedGame.name}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(GAME_PACKAGES[selectedGame.id] || []).map((pkg) => {
                  const isSelected = numericAmount === pkg.amount && packageName.includes(pkg.name);
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setNumericAmount(pkg.amount);
                        setPackageName(`${selectedGame.name} - ${pkg.name}`);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#f13b2c] bg-[#fff6f5] ring-2 ring-[#f13b2c]/30 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-gray-900 leading-tight">{pkg.name}</span>
                        {pkg.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#f13b2c] text-white">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#f13b2c]">
                          Rp{new Intl.NumberFormat('id-ID').format(pkg.amount)}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#f13b2c]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* E. Pilihan Denominasi Voucher Makanan via Chip (PDF Page 9) */}
          {isFood && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Pilihan Denominasi E-Voucher {selectedFoodMerchant.name}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(FOOD_PACKAGES[selectedFoodMerchant.id] || []).map((pkg) => {
                  const isSelected = numericAmount === pkg.amount;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setNumericAmount(pkg.amount);
                        setPackageName(pkg.name);
                      }}
                      className={`p-3 rounded-xl border text-center transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-[#f13b2c] bg-[#fff6f5] ring-2 ring-[#f13b2c]/30 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pkg.badge && (
                        <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#f13b2c] text-white">
                          {pkg.badge}
                        </span>
                      )}
                      <span className="text-xs font-bold text-gray-900 block">{pkg.name}</span>
                      <span className="text-xs font-extrabold text-[#f13b2c] block mt-1">
                        Rp{new Intl.NumberFormat('id-ID').format(pkg.amount)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* F. Pilihan Tipe Hewan Kurban via Card (PDF Page 10) */}
          {isKurban && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Pilihan Paket Hewan Kurban (Sesuai Fiqih)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {KURBAN_PACKAGES.map((pkg) => {
                  const isSelected = numericAmount === pkg.amount;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setNumericAmount(pkg.amount);
                        setPackageName(`Kurban - ${pkg.name}`);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#f13b2c] bg-[#fff6f5] ring-2 ring-[#f13b2c]/30 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-gray-900">{pkg.name}</span>
                          {pkg.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        {pkg.itemDescription && (
                          <p className="text-[11px] text-gray-500">{pkg.itemDescription}</p>
                        )}
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#f13b2c]">
                          Rp{new Intl.NumberFormat('id-ID').format(pkg.amount)}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-[#f13b2c] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Dipilih
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* G. Pilihan Zakat: Chip + Nominal Lainnya + Link Kalkulator Zakat (PDF Page 12) */}
          {isZakat && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 block">
                  Pilihan Nominal Zakat
                </label>
                <button
                  type="button"
                  onClick={() => setIsZakatCalculatorOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#f13b2c] hover:underline cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Gunakan Kalkulator Zakat</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {ZAKAT_PRESETS.map((nom) => {
                  const isSelected = !isCustomZakat && numericAmount === nom;
                  return (
                    <button
                      key={nom}
                      type="button"
                      onClick={() => {
                        setIsCustomZakat(false);
                        setNumericAmount(nom);
                      }}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#f13b2c] bg-[#fff6f5] text-[#f13b2c] ring-1 ring-[#f13b2c]'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Rp{new Intl.NumberFormat('id-ID').format(nom)}
                    </button>
                  );
                })}

                {/* Tombol Opsi Nominal Lainnya */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomZakat(true);
                  }}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer col-span-3 sm:col-span-2 ${
                    isCustomZakat
                      ? 'border-[#f13b2c] bg-[#fff6f5] text-[#f13b2c] ring-1 ring-[#f13b2c]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ✏️ Nominal Lainnya (Ketik Bebas)
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TOTAL PEMBAYARAN / NOMINAL TAGIHAN (LOCKED / READ-ONLY / RP)    */}
          {/* ============================================================== */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs md:text-sm font-semibold text-gray-700 block">
                Total Pembayaran
              </label>
              {!isCustomZakat && (
                <span className="text-[11px] text-gray-400 font-medium">
                  {isZakat ? 'Kunci nominal paket' : 'Ditarik otomatis dari sistem'}
                </span>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Banknote className="w-4 h-4" />
              </div>

              {/* Prefiks Rp Statis Konsisten di Dalam Kolom */}
              <div className="absolute inset-y-0 left-9 flex items-center pointer-events-none font-bold text-gray-500 text-sm md:text-base">
                Rp
              </div>

              <input
                type="text"
                readOnly={!isCustomZakat}
                value={new Intl.NumberFormat('id-ID').format(numericAmount)}
                onChange={isCustomZakat ? handleCustomZakatChange : undefined}
                className={`w-full pl-16 sm:pl-17 pr-4 py-3 text-base sm:text-sm md:text-base border rounded-lg font-bold transition-colors focus:outline-none shadow-xs ${
                  isCustomZakat
                    ? 'border-[#f13b2c] bg-white text-gray-900 focus:ring-2 focus:ring-[#f13b2c]/20 cursor-text'
                    : 'border-gray-300 bg-gray-100 text-gray-800 cursor-not-allowed select-none'
                }`}
              />
            </div>
          </div>

          {/* ============================================================== */}
          {/* METODE PEMBAYARAN SELECTOR                                     */}
          {/* ============================================================== */}
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onSelectMethod={setSelectedMethod}
            balance={balance}
            tariff={numericAmount}
            onNavigateTopUp={() => setActiveTab('topup')}
          />

          {/* ============================================================== */}
          {/* RINGKASAN TRANSAKSI SEBELUM TOMBOL BAYAR (PDF Page 14)          */}
          {/* ============================================================== */}
          {customerId.trim() && (
            <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl text-xs text-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#f13b2c] flex-shrink-0" />
              <span>
                Anda akan melakukan transaksi <strong>{packageName}</strong> untuk{' '}
                <strong>{customerId}</strong> sebesar{' '}
                <strong className="text-[#f13b2c]">
                  Rp {new Intl.NumberFormat('id-ID').format(numericAmount)}
                </strong>
                .
              </span>
            </div>
          )}

          {/* ============================================================== */}
          {/* TOMBOL BAYAR DENGAN JARAK VISUAL (WHITE SPACE) (PDF Page 1)    */}
          {/* ============================================================== */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 min-h-[48px] bg-[#f13b2c] hover:bg-[#d3281a] active:bg-[#ba2216] text-white font-semibold text-sm sm:text-base rounded-lg transition-colors shadow-sm focus:outline-none disabled:opacity-70 cursor-pointer"
            >
              {isProcessing ? 'Memproses Transaksi...' : 'Bayar'}
            </button>
          </div>
        </form>
      </section>

      {/* Confirmation & Status Modals */}
      <Modal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={
          modalState.type === 'confirm'
            ? `Beli ${packageName.toLowerCase()} senilai`
            : `Pembayaran ${packageName.toLowerCase()} sebesar`
        }
        amount={modalState.amount}
        subtitle={
          modalState.type === 'success'
            ? 'berhasil!'
            : modalState.type === 'failed'
            ? 'gagal'
            : undefined
        }
        customerId={customerId.trim()}
        paymentMethod={modalState.paymentMethodName || selectedMethod.name}
        invoiceNumber={modalState.invoiceNumber}
        confirmLabel="Ya, lanjutkan Bayar"
        cancelLabel="Batalkan"
        onConfirm={handleConfirmPayment}
        onCancel={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onClose={handleCloseModal}
      />

      {/* Payment Instruction Modal (for VA, QRIS, E-Wallet) */}
      <PaymentInstructionModal
        isOpen={isInstructionOpen}
        paymentMethod={selectedMethod}
        amount={numericAmount}
        serviceName={packageName}
        customerId={customerId.trim()}
        onSuccess={handleInstructionSuccess}
        onClose={() => setIsInstructionOpen(false)}
      />

      {/* Pop-up Kalkulator Zakat */}
      <ZakatCalculatorModal
        isOpen={isZakatCalculatorOpen}
        onClose={() => setIsZakatCalculatorOpen(false)}
        onApplyAmount={handleApplyZakatFromCalculator}
      />
    </div>
  );
};
