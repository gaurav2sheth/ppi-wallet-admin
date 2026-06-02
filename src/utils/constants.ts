export const ROUTES = {
  DASHBOARD: '/',
  TRANSACTIONS: '/transactions',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: (id: string) => `/customers/${id}`,
  SUB_WALLETS: '/sub-wallets',
  ANALYTICS: '/analytics',
  LOAD_GUARD: '/load-guard',
  SETTINGS: '/settings',
} as const;

export const NAV_ITEMS: Array<{ to: string; label: string; icon: string }> = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/transactions', label: 'Transactions', icon: 'M4 6h16M4 12h16M4 18h10' },
  { to: '/customers', label: 'Customers', icon: 'M5.5 19a6.5 6.5 0 0113 0M12 11a4 4 0 100-8 4 4 0 000 8z' },
  { to: '/sub-wallets', label: 'Sub-Wallets', icon: 'M3 7h18v10H3zM3 10h18' },
  { to: '/analytics', label: 'Analytics', icon: 'M4 19V5m6 14V9m6 10v-6m6 6v-3' },
  { to: '/load-guard', label: 'Load Guard', icon: 'M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z' },
  { to: '/settings', label: 'Settings', icon: 'M12 8a4 4 0 100 8 4 4 0 000-8zM4 12h2m12 0h2M12 4v2m0 12v2' },
];

export const STORAGE_KEYS = {
  TXN_FILTERS: 'admin_txn_filters',
  SELECTED_WALLET: 'admin_selected_wallet',
};

// PPI compliance limits in paise
export const PPI_LIMITS = {
  BALANCE_CAP_FULL_KYC: 1_00_00_000n,    // ₹1L
  BALANCE_CAP_MIN_KYC: 10_00_000n,        // ₹10K
  MONTHLY_LOAD_FULL_KYC: 2_00_00_000n,    // ₹2L
  NCMC_CAP: 3_00_000n,                    // ₹3K
  FASTAG_DEPOSIT: 30_000n,                // ₹300
};

export const SUB_WALLET_LABELS: Record<string, string> = {
  FOOD: 'Food',
  NCMC: 'NCMC Transit',
  FASTAG: 'FASTag',
  GIFT: 'Gift',
  FUEL: 'Fuel',
};

export const SUB_WALLET_ICONS: Record<string, string> = {
  FOOD: '\u{1F371}', NCMC: '\u{1F687}', FASTAG: '\u{1F6E3}️', GIFT: '\u{1F381}', FUEL: '⛽',
};
