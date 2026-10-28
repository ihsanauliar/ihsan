import React, { useState, useEffect, useCallback } from 'react';
import {
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  ArrowRight,
  X,
  RotateCcw,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import type { PaymentOption } from './PaymentMethodSelector';

interface PaymentInstructionModalProps {
  isOpen: boolean;
  paymentMethod: PaymentOption;
  amount: number;
  serviceName: string;
  customerId: string;
  onSuccess: (vaNumber?: string) => void;
  onClose: () => void;
}

export interface VABankConfig {
  bankName: string;
  bankCode: string;
  companyCode: string;
  vaNumber: string;
  formattedVaNumber: string;
  referenceId: string;
  expiryHours: number;
  steps: {
    mobileTitle: string;
    mobileSteps: string[];
    atmTitle: string;
    atmSteps: string[];
  };
}

// Real-world Indonesian Virtual Account rules per bank
export function generateRealtimeVA(bankCode: string, customerId: string): VABankConfig {
  const now = new Date();
  const bank = (bankCode || '').toUpperCase();
  const timeSeed = Date.now().toString().slice(-4);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const cleanId = customerId.replace(/\D/g, '').padEnd(8, '8').slice(-6);

  let companyCode = '12608';
  let rawNumber = '';
  let bankName = 'Virtual Account';
  let steps = {
    mobileTitle: 'Mobile Banking',
    mobileSteps: [
      'Buka aplikasi Mobile Banking Anda.',
      'Pilih menu Transfer > Virtual Account.',
      'Masukkan nomor VA di atas.',
      'Periksa rincian tagihan dan konfirmasi pembayaran dengan PIN.',
    ],
    atmTitle: 'ATM',
    atmSteps: [
      'Masukkan kartu ATM dan 6 digit PIN.',
      'Pilih menu Transaksi Lainnya > Transfer > Virtual Account.',
      'Masukkan nomor VA di atas lalu tekan Benar.',
      'Periksa layar konfirmasi dan selesaikan transaksi.',
    ],
  };

  if (bank.includes('BCA')) {
    // BCA: 5-digit company code (e.g. 12608) + 11-digit unique customer/order billing code (Total 16 digits)
    companyCode = '12608';
    bankName = 'BCA Virtual Account';
    rawNumber = `${companyCode}${cleanId}${timeSeed}${randomSuffix.toString().slice(-1)}`;
    steps = {
      mobileTitle: 'BCA Mobile (m-BCA) / myBCA',
      mobileSteps: [
        'Buka aplikasi BCA Mobile (m-BCA) atau myBCA.',
        'Pilih menu m-Transfer > BCA Virtual Account.',
        'Masukkan nomor Virtual Account BCA di atas.',
        'Pastikan nama SIMS PPOB dan nominal sudah sesuai, masukkan PIN m-BCA.',
      ],
      atmTitle: 'ATM BCA',
      atmSteps: [
        'Masukkan kartu ATM BCA dan 6 digit PIN.',
        'Pilih menu Transaksi Lainnya > Transfer > ke Rekening BCA Virtual Account.',
        'Masukkan nomor BCA Virtual Account di atas lalu tekan Benar.',
        'Periksa konfirmasi tagihan pada layar ATM lalu pilih Ya.',
      ],
    };
  } else if (bank.includes('MANDIRI')) {
    // Mandiri: 5-digit billing company code (e.g. 88708) + 11-digit dynamic bill key (Total 16 digits)
    companyCode = '88708';
    bankName = 'Mandiri Virtual Account';
    rawNumber = `${companyCode}${cleanId}${timeSeed}${randomSuffix.toString().slice(-1)}`;
    steps = {
      mobileTitle: "Livin' by Mandiri (Kuning)",
      mobileSteps: [
        "Buka aplikasi Livin' by Mandiri dan lakukan Login.",
        'Pilih menu Bayar > ketik penyedia jasa "SIMS PPOB" atau kode 88708.',
        'Masukkan nomor Mandiri Virtual Account di atas.',
        'Periksa konfirmasi detail tagihan, lalu masukkan PIN Livin\'.',
      ],
      atmTitle: 'ATM Mandiri',
      atmSteps: [
        'Masukkan kartu ATM Mandiri dan PIN Anda.',
        'Pilih menu Bayar/Beli > Lainnya > Multi Payment.',
        'Ketik Kode Perusahaan 88708 (SIMS PPOB) lalu tekan Benar.',
        'Masukkan nomor Mandiri VA di atas dan konfirmasi pembayaran.',
      ],
    };
  } else if (bank.includes('BNI')) {
    // BNI: 988 (BNI VA identifier) + 5-digit merchant code + dynamic reference (Total 16 digits)
    companyCode = '98812608';
    bankName = 'BNI Virtual Account';
    rawNumber = `98812608${cleanId}${randomSuffix.toString().slice(-2)}`;
    steps = {
      mobileTitle: 'BNI Mobile Banking',
      mobileSteps: [
        'Buka aplikasi BNI Mobile Banking dan login.',
        'Pilih menu Pembayaran > Virtual Account Billing.',
        'Pilih Rekening Debet, lalu masukkan nomor VA BNI di atas pada tab Input Baru.',
        'Periksa detail tagihan, masukkan Password Transaksi dan selesai.',
      ],
      atmTitle: 'ATM BNI',
      atmSteps: [
        'Masukkan kartu ATM BNI dan 6 digit PIN.',
        'Pilih Menu Lain > Pembayaran > Menu Berikutnya > Virtual Account Billing.',
        'Masukkan nomor Virtual Account BNI di atas.',
        'Konfirmasi jumlah pembayaran pada layar ATM.',
      ],
    };
  } else if (bank.includes('BRI')) {
    // BRI (BRIVA): 5-digit company code (e.g. 12808) + dynamic order digits (Total 15-16 digits)
    companyCode = '12808';
    bankName = 'BRI Virtual Account (BRIVA)';
    rawNumber = `${companyCode}${cleanId}${timeSeed}${randomSuffix.toString().slice(-1)}`;
    steps = {
      mobileTitle: 'BRImo (BRI Mobile)',
      mobileSteps: [
        'Buka aplikasi BRImo dan login akun Anda.',
        'Pilih menu Tagihan > BRIVA > Tambah Pembayaran Baru.',
        'Masukkan nomor BRIVA di atas.',
        'Periksa nama pelanggan & nominal, lalu masukkan PIN BRImo.',
      ],
      atmTitle: 'ATM BRI',
      atmSteps: [
        'Masukkan kartu ATM BRI dan PIN.',
        'Pilih menu Transaksi Lain > Pembayaran > Lainnya > BRIVA.',
        'Masukkan nomor BRIVA di atas.',
        'Pilih Ya untuk memproses pembayaran.',
      ],
    };
  } else if (bank.includes('PERMATA')) {
    companyCode = '8444';
    bankName = 'Permata Virtual Account';
    rawNumber = `8444${cleanId}${timeSeed}${randomSuffix.toString().slice(-2)}`;
    steps = {
      mobileTitle: 'PermataMobile X',
      mobileSteps: [
        'Buka aplikasi PermataMobile X.',
        'Pilih menu Bayar Tagihan > Virtual Account.',
        'Masukkan nomor Permata VA di atas dan masukkan PIN.',
      ],
      atmTitle: 'ATM Permata',
      atmSteps: [
        'Masukkan kartu ATM Permata dan PIN.',
        'Pilih Pembayaran > Virtual Account.',
        'Masukkan nomor VA di atas dan konfirmasi.',
      ],
    };
  } else if (bank.includes('CIMB')) {
    companyCode = '1199';
    bankName = 'CIMB Niaga Virtual Account';
    rawNumber = `1199${cleanId}${timeSeed}${randomSuffix.toString().slice(-2)}`;
    steps = {
      mobileTitle: 'OCTO Mobile by CIMB Niaga',
      mobileSteps: [
        'Buka aplikasi OCTO Mobile by CIMB Niaga.',
        'Pilih menu Transfer > Rekening Virtual Account.',
        'Masukkan nomor VA di atas dan konfirmasi dengan PIN OCTO.',
      ],
      atmTitle: 'ATM CIMB Niaga',
      atmSteps: [
        'Masukkan kartu ATM CIMB Niaga dan PIN.',
        'Pilih Transfer > Rekening CIMB Niaga Lain > Rekening Virtual Account.',
        'Masukkan nomor VA dan ikuti petunjuk layar.',
      ],
    };
  } else {
    companyCode = '8801';
    rawNumber = `8801${cleanId}${timeSeed}${randomSuffix.toString().slice(-1)}`;
  }

  // Format with space every 4 digits for easy reading: "12608 0812 3456 7890" or "88708 0812 3456 7890"
  const formattedVaNumber = rawNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

  return {
    bankName,
    bankCode: bank,
    companyCode,
    vaNumber: rawNumber,
    formattedVaNumber,
    referenceId: `REF-${bank}-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${randomSuffix}`,
    expiryHours: 24,
    steps,
  };
}

export const PaymentInstructionModal: React.FC<PaymentInstructionModalProps> = ({
  isOpen,
  paymentMethod,
  amount,
  serviceName,
  customerId,
  onSuccess,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [instructionTab, setInstructionTab] = useState<'mobile' | 'atm'>('mobile');

  // Realtime Countdown state in seconds (24 hours = 86400 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(86399);

  // Realtime VA configuration
  const [vaData, setVaData] = useState<VABankConfig>(() =>
    generateRealtimeVA(paymentMethod.bankCode || paymentMethod.badge || 'BCA', customerId)
  );

  const initVA = useCallback(() => {
    const config = generateRealtimeVA(
      paymentMethod.bankCode || paymentMethod.badge || 'BCA',
      customerId
    );
    setVaData(config);
    setSecondsRemaining(86399);
  }, [paymentMethod.bankCode, paymentMethod.badge, customerId]);

  // Generate / refresh VA whenever modal opens or bank changes
  useEffect(() => {
    if (isOpen) {
      initVA();
    }
  }, [isOpen, initVA]);

  // Realtime tick countdown every second
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  // Format seconds into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formattedAmount = new Intl.NumberFormat('id-ID').format(amount);

  const handleCopyVA = () => {
    navigator.clipboard.writeText(vaData.vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      initVA();
      setIsRegenerating(false);
    }, 300);
  };

  const handleSimulatePayment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onSuccess(vaData.formattedVaNumber);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-[2px] animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-3.5 sm:pb-4 border-b border-gray-100">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#f13b2c] px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instruksi Pembayaran Realtime</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {paymentMethod.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Selesaikan pembayaran untuk {serviceName}
          </p>
        </div>

        {/* Realtime Status Bar */}
        <div className="flex items-center justify-between text-[11px] py-2 px-3 bg-gray-50 rounded-lg mt-3 border border-gray-100">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Realtime Billing Aktif</span>
          </div>
          <span className="font-mono text-gray-400 text-[10px]">
            {vaData.referenceId}
          </span>
        </div>

        {/* Amount & Realtime Countdown Box */}
        <div className="my-3 p-3.5 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-500 block">Total Pembayaran</span>
            <span className="text-lg sm:text-xl font-bold text-[#f13b2c]">
              Rp {formattedAmount}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-gray-400 block flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-[#f13b2c]" /> Sisa Waktu
            </span>
            <span className="text-xs font-mono font-bold text-gray-800 bg-white/80 px-2 py-0.5 rounded border border-red-100 mt-0.5 block">
              {formatTime(secondsRemaining)}
            </span>
          </div>
        </div>

        {/* VA Content with Realtime Generator per Bank */}
        {paymentMethod.category === 'va' && (
          <div className="space-y-4">
            <div className="p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                  <span>Nomor Virtual Account {vaData.bankName}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    paymentMethod.badgeBg || 'bg-blue-600'
                  } ${paymentMethod.badgeText || 'text-white'}`}
                >
                  {paymentMethod.badge || 'VA'}
                </span>
              </div>

              {/* Realtime Formatted VA Number */}
              <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-xs flex flex-col xs:flex-row xs:items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <span className="text-base sm:text-lg md:text-xl font-mono font-bold tracking-wider text-gray-900 block select-all truncate">
                    {vaData.formattedVaNumber}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    Kode Perusahaan: {vaData.companyCode} (SIMS PPOB)
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    title="Generate ulang nomor VA baru secara Realtime"
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-[#f13b2c] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyVA}
                    className="flex items-center gap-1 text-xs font-bold text-[#f13b2c] hover:text-[#d3281a] px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                <span>Dibuat: Baru Saja (Realtime)</span>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="text-[11px] font-semibold text-[#f13b2c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Ubah Nomor VA</span>
                </button>
              </div>
            </div>

            {/* Transfer Steps per Bank with Interactive Tabs */}
            <div className="p-3.5 bg-white border border-gray-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold text-gray-800">
                  Petunjuk Transfer {paymentMethod.bankCode || 'Bank'}:
                </span>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setInstructionTab('mobile')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                      instructionTab === 'mobile'
                        ? 'bg-[#f13b2c] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Mobile Banking
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstructionTab('atm')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                      instructionTab === 'atm'
                        ? 'bg-[#f13b2c] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ATM
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-2">
                {instructionTab === 'mobile'
                  ? vaData.steps.mobileSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-2 text-left">
                        <span className="font-bold text-[#f13b2c]">{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))
                  : vaData.steps.atmSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-2 text-left">
                        <span className="font-bold text-[#f13b2c]">{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        )}

        {/* QRIS Content */}
        {paymentMethod.id === 'qris' && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-white rounded-xl border border-gray-200 inline-block shadow-sm">
              <div className="w-48 h-48 mx-auto bg-gray-900 rounded-lg p-2.5 flex flex-col items-center justify-between relative overflow-hidden">
                <div className="w-full flex justify-between">
                  <div className="w-12 h-12 border-4 border-white bg-gray-900 p-1.5 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white"></div>
                  </div>
                  <div className="w-12 h-12 border-4 border-white bg-gray-900 p-1.5 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white"></div>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center shadow">
                  <QrCode className="w-7 h-7 text-[#ea1c24]" />
                </div>

                <div className="w-full flex justify-between items-end">
                  <div className="w-12 h-12 border-4 border-white bg-gray-900 p-1.5 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white"></div>
                  </div>
                  <div className="text-[9px] font-bold text-white tracking-widest uppercase">
                    QRIS REALTIME
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 font-medium">
                NMID: ID102039485729102
              </p>
            </div>

            <p className="text-xs text-gray-600 px-4">
              Pindai QRIS di atas menggunakan aplikasi <b>GoPay, OVO, DANA, BCA, Mandiri, ShopeePay</b> atau mobile banking lainnya.
            </p>
          </div>
        )}

        {/* E-Wallet Content */}
        {paymentMethod.category === 'ewallet' && paymentMethod.id !== 'qris' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-left">
              <span className="text-xs text-gray-500 block mb-1">Akun E-Wallet Terhubung</span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-gray-900 block">
                    {paymentMethod.name}
                  </span>
                  <span className="text-xs text-gray-600 font-mono">
                    0812 •••• 7890
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    paymentMethod.badgeBg || 'bg-red-500'
                  } ${paymentMethod.badgeText || 'text-white'}`}
                >
                  {paymentMethod.badge}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 text-left">
              Pembayaran akan diproses secara otomatis memotong saldo akun <b>{paymentMethod.name}</b> Anda.
            </p>
          </div>
        )}

        {/* Card Content */}
        {paymentMethod.category === 'card' && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl shadow-md text-left">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold tracking-wider text-gray-300">
                  KARTU DEBIT / KREDIT
                </span>
                <span className="text-xs font-bold text-amber-400">VISA / MASTERCARD</span>
              </div>
              <div className="font-mono text-base tracking-widest mb-3">
                •••• •••• •••• 8842
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>BERLAKU: 08/29</span>
                <span>CVV: •••</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 text-left">
              Pembayaran aman dengan enkripsi SSL 256-bit dan 3D Secure OTP.
            </p>
          </div>
        )}

        {/* Action Simulation Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={handleSimulatePayment}
            disabled={isSimulating}
            className="w-full py-3 bg-[#52c41a] hover:bg-[#45a816] text-white font-bold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSimulating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memverifikasi Pembayaran Realtime...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulasi Bayar Sekarang (Instan)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Tutup & Bayar Nanti
          </button>
        </div>
      </div>
    </div>
  );
};
