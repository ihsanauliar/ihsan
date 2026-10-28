import React from 'react';
import { Check, X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  type: 'confirm' | 'success' | 'failed';
  title: string;
  amount: number | string;
  subtitle?: string;
  customerId?: string;
  paymentMethod?: string;
  invoiceNumber?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  type,
  title,
  amount,
  subtitle,
  customerId,
  paymentMethod,
  invoiceNumber,
  confirmLabel = 'Ya, lanjutkan',
  cancelLabel = 'Batalkan',
  onConfirm,
  onCancel,
  onClose,
}) => {
  if (!isOpen) return null;

  const formattedAmount =
    typeof amount === 'number'
      ? new Intl.NumberFormat('id-ID').format(amount)
      : amount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px] animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 sm:p-7 text-center shadow-2xl transform transition-all animate-scaleUp">
        {/* Icon */}
        <div className="flex justify-center mb-3 sm:mb-4">
          {type === 'confirm' && (
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/assets/Logo.png" alt="Confirm" className="w-10 h-10 object-contain" />
            </div>
          )}

          {type === 'success' && (
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#52c41a] flex items-center justify-center text-white shadow-md">
              <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            </div>
          )}

          {type === 'failed' && (
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#f13b2c] flex items-center justify-center text-white shadow-md">
              <X className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            </div>
          )}
        </div>

        {/* Title / Description */}
        <p className="text-gray-600 text-xs sm:text-sm font-normal mb-1">
          {title}
        </p>

        {/* Amount Display */}
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight break-all">
          Rp{formattedAmount} {type === 'confirm' ? '?' : ''}
        </h3>

        {/* Subtitle (e.g. berhasil / gagal) */}
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}

        {/* Transaction Summary Card */}
        {(customerId || paymentMethod || invoiceNumber) && (
          <div className="mt-3.5 sm:mt-4 p-3 sm:p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-left text-xs space-y-2">
            {invoiceNumber && (
              <div className="flex justify-between items-center text-gray-500">
                <span>No. Invoice</span>
                <span className="font-mono text-gray-700 font-medium">{invoiceNumber}</span>
              </div>
            )}
            {customerId && (
              <div className="flex justify-between items-center text-gray-500">
                <span>ID / No. Tagihan</span>
                <span className="font-mono font-semibold text-gray-800">{customerId}</span>
              </div>
            )}
            {paymentMethod && (
              <div className="flex justify-between items-center text-gray-500">
                <span>Metode Pembayaran</span>
                <span className="font-semibold text-gray-800">{paymentMethod}</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 sm:mt-6 flex flex-col gap-2.5">
          {type === 'confirm' && (
            <>
              <button
                type="button"
                onClick={onConfirm}
                className="w-full text-[#f13b2c] hover:text-[#d3281a] font-bold text-sm py-2.5 min-h-[44px] transition-colors focus:outline-none cursor-pointer flex items-center justify-center active:scale-95"
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full text-gray-400 hover:text-gray-600 font-semibold text-xs py-2 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
              >
                {cancelLabel}
              </button>
            </>
          )}

          {(type === 'success' || type === 'failed') && (
            <button
              type="button"
              onClick={onClose}
              className="w-full text-[#f13b2c] hover:text-[#d3281a] font-bold text-sm py-2.5 min-h-[44px] transition-colors focus:outline-none cursor-pointer flex items-center justify-center active:scale-95"
            >
              Kembali ke Beranda
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
