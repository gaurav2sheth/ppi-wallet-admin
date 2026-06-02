// Admin API facade. Tries the Render backend first for per-wallet detail endpoints
// that are known to exist, and falls back to mock seed data for list endpoints
// (which the wallet app's documented backend doesn't currently expose).

import { api, apiReachable } from './client';
import {
  mockGetKycStatus, mockGetLedger, mockGetMetrics, mockGetWalletStatus,
  mockListAllTransactions, mockListCustomers, mockListSubWallets,
} from './mock';
import type {
  AdminCustomer, AdminMetrics, KycStatusResponse, LedgerEntry,
  LedgerResponse, SubWallet, WalletStatusResponse,
} from '../types/api.types';

async function safe<T>(p: Promise<T>, fallback: () => T): Promise<T> {
  try {
    if (!apiReachable) return fallback();
    return await p;
  } catch { return fallback(); }
}

export const adminApi = {
  listCustomers: async (): Promise<AdminCustomer[]> =>
    safe(api.get<unknown, AdminCustomer[]>('/admin/customers'), () => mockListCustomers()),

  getWalletStatus: async (walletId: string): Promise<WalletStatusResponse> =>
    safe(api.get<unknown, WalletStatusResponse>(`/wallet/status/${walletId}`), () => mockGetWalletStatus(walletId)),

  getLedger: async (walletId: string, limit = 50): Promise<LedgerResponse> =>
    safe(api.get<unknown, LedgerResponse>(`/wallet/ledger/${walletId}`, { params: { limit } }), () => mockGetLedger(walletId, limit)),

  getKycStatus: async (walletId: string): Promise<KycStatusResponse> =>
    safe(api.get<unknown, KycStatusResponse>(`/kyc/status/${walletId}`), () => mockGetKycStatus(walletId)),

  listAllTransactions: async (): Promise<Array<LedgerEntry & { wallet_id: string; customer_name: string }>> =>
    safe(api.get<unknown, Array<LedgerEntry & { wallet_id: string; customer_name: string }>>('/admin/transactions'),
      () => mockListAllTransactions()),

  listSubWallets: async (): Promise<SubWallet[]> =>
    safe(api.get<unknown, SubWallet[]>('/admin/sub-wallets'), () => mockListSubWallets()),

  getMetrics: async (): Promise<AdminMetrics> =>
    safe(api.get<unknown, AdminMetrics>('/admin/metrics'), () => mockGetMetrics()),
};
