import React, { useEffect, useState } from 'react';
import { ProfileBalanceCard } from '../components/ProfileBalanceCard';
import type { TransactionRecord } from '../types';
import { apiService } from '../services/api';

const MONTH_FILTERS = [
  'Semua',
  'Maret',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
];

export const Transaction: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 5;

  const fetchTransactions = async (newOffset: number, append = false) => {
    setIsLoading(true);
    try {
      const res = await apiService.getTransactionHistory(newOffset, limit);
      if (res.data) {
        const records = res.data.records || [];
        if (append) {
          setTransactions((prev) => [...prev, ...records]);
        } else {
          setTransactions(records);
        }
        if (records.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (e) {
      console.error('Failed to load transaction history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(0, false);
    setOffset(0);
  }, []);

  const handleShowMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchTransactions(nextOffset, true);
  };

  // Format date helper: "17 Agustus 2023 13:10 WIB"
  const formatDateIndo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
    } catch {
      return dateStr;
    }
  };

  // Filter records by month if filter selected
  const filteredTransactions = transactions.filter((item) => {
    if (activeFilter === 'Semua') return true;
    try {
      const d = new Date(item.created_on);
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      return months[d.getMonth()] === activeFilter;
    } catch {
      return true;
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-5 sm:py-8 space-y-7 sm:space-y-10">
      {/* Profile & Saldo Card */}
      <ProfileBalanceCard />

      {/* Transaction History Section */}
      <section className="w-full pt-1 sm:pt-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight mb-3 sm:mb-4">
          Semua Transaksi
        </h2>

        {/* Month Filter Tabs (matching page 17) */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2.5 mb-5 select-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {MONTH_FILTERS.map((month) => {
            const isActive = activeFilter === month;
            return (
              <button
                key={month}
                type="button"
                onClick={() => setActiveFilter(month)}
                className={`text-xs sm:text-sm font-semibold transition-all focus:outline-none whitespace-nowrap cursor-pointer px-3.5 py-1.5 rounded-full ${
                  isActive
                    ? 'bg-gray-900 text-white font-bold shadow-xs'
                    : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                }`}
              >
                {month}
              </button>
            );
          })}
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-xs sm:text-sm">
            Maaf tidak ada histori transaksi saat ini
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx, idx) => {
              const isTopUp = tx.transaction_type === 'TOPUP';
              const formattedAmount = new Intl.NumberFormat('id-ID').format(tx.total_amount);

              return (
                <div
                  key={tx.invoice_number || idx}
                  className="w-full p-4 sm:p-5 border border-gray-200 rounded-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 shadow-xs transition-shadow hover:shadow-sm"
                >
                  <div className="flex flex-col gap-1">
                    <span
                      className={`font-bold text-base sm:text-lg tracking-tight ${
                        isTopUp ? 'text-[#52c41a]' : 'text-[#f13b2c]'
                      }`}
                    >
                      {isTopUp ? `+ Rp.${formattedAmount}` : `- Rp.${formattedAmount}`}
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-400 font-normal">
                      {formatDateIndo(tx.created_on)}
                    </span>
                  </div>

                  <div className="sm:text-right flex flex-col sm:items-end items-start border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                    <span className="text-xs sm:text-sm font-medium text-gray-800">
                      {tx.description}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      {tx.customer_id && (
                        <span className="text-[11px] text-gray-400 font-mono">
                          No: {tx.customer_id}
                        </span>
                      )}
                      {tx.payment_method && (
                        <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                          {tx.payment_method}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Show More Button */}
        {hasMore && filteredTransactions.length > 0 && activeFilter === 'Semua' && (
          <div className="text-center pt-6">
            <button
              type="button"
              onClick={handleShowMore}
              disabled={isLoading}
              className="text-[#f13b2c] hover:underline font-bold text-xs sm:text-sm focus:outline-none disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Memuat...' : 'Show more'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
