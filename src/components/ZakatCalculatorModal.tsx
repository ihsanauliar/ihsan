import React, { useState } from 'react';
import { Calculator, X, Sparkles, Check } from 'lucide-react';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAmount: (amount: number) => void;
}

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyAmount,
}) => {
  const [monthlyIncome, setMonthlyIncome] = useState<string>('8000000');
  const [otherIncome, setOtherIncome] = useState<string>('0');
  const [essentialExpense, setEssentialExpense] = useState<string>('1500000');

  if (!isOpen) return null;

  // Nisab bulanan setara 85 gr emas / 12 (asumsi emas Rp 1.100.000 / gr => ~Rp 7.800.000 / bln)
  const NISAB_PER_MONTH = 7800000;

  const numMonthly = parseInt(monthlyIncome.replace(/\D/g, ''), 10) || 0;
  const numOther = parseInt(otherIncome.replace(/\D/g, ''), 10) || 0;
  const numExpense = parseInt(essentialExpense.replace(/\D/g, ''), 10) || 0;

  const totalIncome = numMonthly + numOther;
  const netIncome = Math.max(0, totalIncome - numExpense);

  const isNisabReached = netIncome >= NISAB_PER_MONTH;
  const zakatObligation = isNisabReached ? Math.round(netIncome * 0.025) : Math.round(netIncome * 0.025);

  const handleApply = () => {
    onApplyAmount(zakatObligation > 0 ? zakatObligation : 100000);
    onClose();
  };

  const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID').format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg p-4 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-600 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5 pr-8">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-[#f13b2c] flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
              Kalkulator Zakat Penghasilan
            </h3>
            <p className="text-xs text-gray-500">
              Hitung kewajiban zakat 2,5% dari penghasilan bersih bulanan Anda
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Penghasilan Bulanan (Gaji & Tunjangan Tetap)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                Rp
              </span>
              <input
                type="text"
                value={formatRupiah(numMonthly)}
                onChange={(e) => setMonthlyIncome(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg text-gray-900 font-semibold focus:border-[#f13b2c] focus:outline-none shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Pendapatan Lain / Bonus / Lembur (Per Bulan)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                Rp
              </span>
              <input
                type="text"
                value={formatRupiah(numOther)}
                onChange={(e) => setOtherIncome(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg text-gray-900 font-semibold focus:border-[#f13b2c] focus:outline-none shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Pengeluaran Pokok & Cicilan Hutang Mendesak (Per Bulan)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                Rp
              </span>
              <input
                type="text"
                value={formatRupiah(numExpense)}
                onChange={(e) => setEssentialExpense(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg text-gray-900 font-semibold focus:border-[#f13b2c] focus:outline-none shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Calculation Result Box */}
        <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 sm:space-y-2.5">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <span>Penghasilan Bersih Per Bulan</span>
            <span className="font-semibold text-gray-900">Rp {formatRupiah(netIncome)}</span>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Standar Nisab Bulanan (85 gr emas / 12)</span>
            <span className="font-medium text-gray-700">Rp {formatRupiah(NISAB_PER_MONTH)}</span>
          </div>

          <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-800 block">Kewajiban Zakat (2,5%)</span>
              <span className="text-[10px] text-gray-400">
                {isNisabReached ? 'Penghasilan memenuhi nisab' : 'Disarankan ditunaikan sebagai Infaq/Zakat'}
              </span>
            </div>
            <span className="text-base sm:text-lg font-black text-[#f13b2c]">
              Rp {formatRupiah(zakatObligation)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 flex items-start gap-2 text-[11px] text-gray-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
          <span>
            Nominal zakat ini dihitung berdasarkan standar fatwa MUI No. 3 Tahun 2003 tentang Zakat Penghasilan.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 sm:mt-6 flex flex-col xs:flex-row gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 sm:py-2.5 min-h-[44px] border border-gray-300 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer order-2 xs:order-1"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 sm:py-2.5 min-h-[44px] bg-[#f13b2c] hover:bg-[#d3281a] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer order-1 xs:order-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Terapkan ke Tagihan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
