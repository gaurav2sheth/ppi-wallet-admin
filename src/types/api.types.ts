// Mirrors the wallet app's API types so the same Render backend can serve both.

export type KycTier = 'MINIMUM' | 'FULL';
export type WalletState = 'ACTIVE' | 'SUSPENDED' | 'DORMANT' | 'EXPIRED' | 'CLOSED';

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

export interface WalletStatusResponse {
  wallet_id: string;
  user_id: string;
  state: WalletState;
  kyc_tier: KycTier;
  balance_paise: string;
  held_paise: string;
  available_paise: string;
  is_active: boolean;
  wallet_expiry_date?: string;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LedgerEntry {
  id: string;
  entry_type: 'CREDIT' | 'DEBIT' | 'HOLD' | 'HOLD_RELEASE';
  amount_paise: string;
  balance_after_paise: string;
  held_paise_after: string;
  transaction_type: string;
  reference_id: string | null;
  description: string | null;
  idempotency_key: string;
  hold_id: string | null;
  created_at: string;
  payment_source?: string;
}

export interface LedgerResponse {
  success: boolean;
  wallet_id: string;
  entries: LedgerEntry[];
  pagination: { next_cursor: string | null; has_more: boolean };
}

export interface KycStatusResponse {
  wallet_id: string;
  kyc_state: string;
  kyc_tier: KycTier;
  wallet_expiry_date: string | null;
  ckyc_number: string | null;
  pan_masked: string | null;
  aadhaar_verified: boolean;
}

export interface LimitsUsageResponse {
  wallet_id: string;
  kyc_tier: string;
  current_balance_paise: string;
  monthly_p2p_mtd_paise?: string;
  annual_load_ytd_paise?: string;
}

// Admin-only synthetic types

export interface AdminCustomer {
  wallet_id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: WalletState;
  kyc_tier: KycTier;
  balance_paise: string;
  available_paise: string;
  created_at: string;
  last_activity_at: string;
}

export type SubWalletType = 'FOOD' | 'NCMC' | 'FASTAG' | 'GIFT' | 'FUEL';

export interface SubWallet {
  wallet_id: string;
  user_id: string;
  type: SubWalletType;
  balance_paise: string;
  cap_paise?: string;
  expiry_date?: string;
  is_active: boolean;
}

export interface AdminMetrics {
  totalWallets: number;
  activeWallets: number;
  fullKycShare: number;
  totalFloatPaise: string;
  txnsToday: number;
  volumeTodayPaise: string;
  failedSagasToday: number;
}
