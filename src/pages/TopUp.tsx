import React, { useState } from 'react';
import { Banknote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProfileBalanceCard } from '../components/ProfileBalanceCard';
import { Modal } from '../components/Modal';
import { apiService } from '../services/api';

const PRESET_AMOUNTS = [10000, 20000, 50000, 100000, 250000, 500000];

export const TopUp: React.FC = () => {
  const { refreshBalance, setActiveTab } = useAuth();
  const [amountStr, setAmountStr] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'success' | 'failed';
    amount: number;
  }>({
    isOpen: false,
    type: 'confirm',
    amount: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse raw number
  const numericAmount = parseInt(amountStr.replace(/\D/g, ''), 10) || 0;

  // Validation: min 10.000, max 1.000.000
  const isValidAmount = numericAmount >= 10000 && numericAmount <= 1000000;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      setAmountStr('');
      setSelectedPreset(null);
      return;
    }
    const num = parseInt(rawVal, 10);
    setAmountStr(new Intl.NumberFormat('id-ID').format(num));
    setSelectedPreset(PRESET_AMOUNTS.includes(num) ? num : null);
  };

  const handleSelectPreset = (preset: number) => {
    setSelectedPreset(preset);
    setAmountStr(new Intl.NumberFormat('id-ID').format(preset));
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) return;
    setModalState({
      isOpen: true,
      type: 'confirm',
      amount: numericAmount,
    });
  };

  const handleConfirmTopUp = async () => {
    setIsProcessing(true);
    try {
      const res = await apiService.topUp(modalState.amount);
      setIsProcessing(false);
      await refreshBalance();

      if (res.status === 0) {
        setModalState((prev) => ({
          ...prev,
          type: 'success',
        }));
        setAmountStr('');
        setSelectedPreset(null);
      } else {
        setModalState((prev) => ({
          ...prev,
          type: 'failed',
        }));
      }
    } catch {
      setIsProcessing(false);
      setModalState((prev) => ({
        ...prev,
        type: 'failed',
      }));
    }
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    setActiveTab('home');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-5 sm:py-8 space-y-7 sm:space-y-10">
      {/* Profile & Saldo Card */}
      <ProfileBalanceCard />

      {/* Top Up Section */}
      <section className="w-full pt-1 sm:pt-4">
        <p className="text-gray-500 text-xs sm:text-sm md:text-base font-normal">Silahkan masukan</p>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mt-0.5 mb-5 sm:mb-8">
          Nominal Top Up
        </h2>

        <form onSubmit={handleOpenConfirm} className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Input + Button */}
          <div className="md:col-span-7 space-y-4 sm:space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Banknote className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={amountStr}
                onChange={handleInputChange}
                placeholder="masukan nominal Top Up"
                className="w-full pl-10 pr-4 py-3 text-base sm:text-sm md:text-base border border-gray-300 rounded-sm placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-500 transition-colors shadow-xs"
              />
            </div>

            <button
              type="submit"
              disabled={!isValidAmount || isProcessing}
              className={`w-full py-3 sm:py-3.5 min-h-[44px] rounded-sm font-semibold text-sm sm:text-base transition-colors shadow-sm focus:outline-none ${
                isValidAmount && !isProcessing
                  ? 'bg-[#f13b2c] hover:bg-[#d3281a] active:bg-[#ba2216] text-white cursor-pointer'
                  : 'bg-gray-300 text-white cursor-not-allowed'
              }`}
            >
              {isProcessing ? 'Memproses...' : 'Top Up'}
            </button>

            {amountStr && !isValidAmount && (
              <p className="text-xs text-[#f13b2c]">
                Nominal Top Up minimal Rp10.000 dan maksimal Rp1.000.000
              </p>
            )}
          </div>

          {/* Right Column: Preset Grid (2 cols x 3 rows) */}
          <div className="md:col-span-5 grid grid-cols-3 gap-2 sm:gap-3">
            {PRESET_AMOUNTS.map((preset) => {
              const isSelected = selectedPreset === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`py-2.5 sm:py-3 px-1 sm:px-2 border rounded-sm text-xs sm:text-sm font-semibold transition-all text-center focus:outline-none cursor-pointer whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'border-[#f13b2c] text-[#f13b2c] bg-[#fff1f0]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400 bg-white'
                  }`}
                >
                  Rp{new Intl.NumberFormat('id-ID').format(preset)}
                </button>
              );
            })}
          </div>
        </form>
      </section>

      {/* Modals for Confirmation, Success, Failed */}
      <Modal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={
          modalState.type === 'confirm'
            ? 'Anda yakin untuk Top Up sebesar'
            : 'Top Up sebesar'
        }
        amount={modalState.amount}
        subtitle={
          modalState.type === 'success'
            ? 'berhasil!'
            : modalState.type === 'failed'
            ? 'gagal'
            : undefined
        }
        confirmLabel="Ya, lanjutkan Top Up"
        cancelLabel="Batalkan"
        onConfirm={handleConfirmTopUp}
        onCancel={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onClose={handleCloseModal}
      />
    </div>
  );
};
