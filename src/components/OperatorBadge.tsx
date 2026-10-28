import React from 'react';

interface OperatorBadgeProps {
  operatorName?: string;
  size?: 'sm' | 'md';
}

export const OperatorBadge: React.FC<OperatorBadgeProps> = ({
  operatorName,
  size = 'md',
}) => {
  if (!operatorName) return null;

  const normalized = operatorName.toLowerCase();

  // Telkomsel
  if (normalized.includes('telkomsel')) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg px-2.5 py-1 bg-[#EE1B24] text-white shadow-xs ${
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>Telkomsel</span>
      </div>
    );
  }

  // Indosat IM3
  if (normalized.includes('indosat')) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg px-2.5 py-1 bg-[#FFD600] text-gray-900 border border-yellow-400 shadow-xs ${
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#ED1C24]"></span>
        <span>Indosat IM3</span>
      </div>
    );
  }

  // XL Axiata
  if (normalized.includes('xl')) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg px-2.5 py-1 bg-[#00519E] text-white shadow-xs ${
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        }`}
      >
        <span className="text-[#88D32A] font-black tracking-tighter">XL</span>
        <span>Axiata</span>
      </div>
    );
  }

  // AXIS
  if (normalized.includes('axis')) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg px-2.5 py-1 bg-[#6A2D8B] text-white shadow-xs ${
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        }`}
      >
        <span className="font-extrabold tracking-wide">AXIS</span>
      </div>
    );
  }

  // Tri (3)
  if (normalized.includes('tri') || normalized.includes('3')) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg px-2.5 py-1 bg-black text-white border border-gray-700 shadow-xs ${
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        }`}
      >
        <span className="w-3.5 h-3.5 rounded-full bg-[#ED1C24] text-white text-[10px] flex items-center justify-center font-black">
          3
        </span>
        <span>Tri (3)</span>
      </div>
    );
  }

  // Smartfren
  if (normalized.includes('smartfren')) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg px-2.5 py-1 bg-[#E6007E] text-white shadow-xs ${
          size === 'sm' ? 'text-[10px]' : 'text-xs'
        }`}
      >
        <span className="tracking-tight font-extrabold">smartfren.</span>
      </div>
    );
  }

  // Fallback
  return (
    <div
      className={`inline-flex items-center gap-1 font-bold rounded-lg px-2 py-1 bg-red-50 text-[#f13b2c] border border-red-200 ${
        size === 'sm' ? 'text-[10px]' : 'text-xs'
      }`}
    >
      <span>{operatorName}</span>
    </div>
  );
};
