import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  txnSearch: string;
  txnType: '' | 'CREDIT' | 'DEBIT';
  txnRange: 'today' | '7d' | '30d' | 'all';
  setTxnSearch: (s: string) => void;
  setTxnType: (t: AdminState['txnType']) => void;
  setTxnRange: (r: AdminState['txnRange']) => void;

  customerSearch: string;
  setCustomerSearch: (s: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      txnSearch: '',
      txnType: '',
      txnRange: '7d',
      setTxnSearch: (s) => set({ txnSearch: s }),
      setTxnType: (t) => set({ txnType: t }),
      setTxnRange: (r) => set({ txnRange: r }),
      customerSearch: '',
      setCustomerSearch: (s) => set({ customerSearch: s }),
    }),
    { name: 'admin_filters' },
  ),
);
