// Local seed data + helpers. Used as fallback when the Render backend
// does not expose admin list endpoints, or when running offline.

import type {
  AdminCustomer, AdminMetrics, LedgerEntry, LedgerResponse,
  SubWallet, WalletStatusResponse, KycStatusResponse, KycTier, WalletState,
} from '../types/api.types';

const NAMES = [
  'Aarav Sharma', 'Diya Patel', 'Vihaan Kumar', 'Ananya Singh', 'Reyansh Gupta',
  'Saanvi Reddy', 'Arjun Iyer', 'Kavya Nair', 'Ishaan Verma', 'Myra Joshi',
  'Aditya Rao', 'Anika Bose', 'Kabir Mehta', 'Tara Khan', 'Yuvan Pillai',
];
const CITIES = ['Mumbai', 'Bengaluru', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'];
const STATES: WalletState[] = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'ACTIVE', 'SUSPENDED', 'DORMANT'];
const KYC: KycTier[] = ['FULL', 'FULL', 'FULL', 'MINIMUM'];

const MERCHANTS = [
  { name: 'Swiggy', desc: 'Swiggy food order' },
  { name: 'Zomato', desc: 'Zomato dinner' },
  { name: 'Uber', desc: 'Uber cab to office' },
  { name: 'Ola', desc: 'Ola auto fare' },
  { name: 'BigBasket', desc: 'BigBasket grocery' },
  { name: 'Amazon', desc: 'Amazon shopping' },
  { name: 'Flipkart', desc: 'Flipkart purchase' },
  { name: 'BookMyShow', desc: 'BookMyShow PVR ticket' },
  { name: 'IRCTC', desc: 'IRCTC train booking' },
  { name: 'Apollo', desc: 'Apollo pharmacy' },
  { name: 'HP Petrol', desc: 'HP fuel top-up' },
  { name: 'Indian Oil', desc: 'Indian Oil petrol' },
  { name: 'Airtel', desc: 'Airtel mobile recharge' },
  { name: 'Jio', desc: 'Jio postpaid bill' },
  { name: 'BESCOM', desc: 'BESCOM electricity bill' },
  { name: 'Metro', desc: 'Bengaluru Metro fare' },
  { name: 'FASTag toll', desc: 'NH-48 toll plaza' },
  { name: 'Netflix', desc: 'Netflix monthly subscription' },
  { name: 'PharmEasy', desc: 'PharmEasy medicines' },
];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

function id(prefix: string, n: number): string {
  return `${prefix}_${n.toString(36).padStart(8, '0')}`;
}

function hoursAgo(h: number): string { return new Date(Date.now() - h * 3600_000).toISOString(); }

let cachedSeed: {
  customers: AdminCustomer[];
  ledgersByWallet: Record<string, LedgerEntry[]>;
  subWallets: SubWallet[];
} | null = null;

function buildSeed() {
  if (cachedSeed) return cachedSeed;
  const customers: AdminCustomer[] = NAMES.map((name, idx) => {
    const wallet_id = id('w', idx + 1);
    const user_id = id('u', idx + 1);
    const balance = BigInt(randomInt(5_000, 80_000) * 100);
    return {
      wallet_id, user_id, name,
      phone: '9' + String(randomInt(100000000, 999999999)),
      email: name.toLowerCase().replace(/\s+/g, '.') + '@example.com',
      city: rand(CITIES),
      state: rand(STATES),
      kyc_tier: rand(KYC),
      balance_paise: balance.toString(),
      available_paise: balance.toString(),
      created_at: new Date(Date.now() - randomInt(30, 720) * 86400_000).toISOString(),
      last_activity_at: hoursAgo(randomInt(0, 168)),
    };
  });

  const ledgersByWallet: Record<string, LedgerEntry[]> = {};
  let txnCounter = 0;
  for (const c of customers) {
    const entries: LedgerEntry[] = [];
    let running = BigInt(c.balance_paise);
    const txnCount = randomInt(15, 40);
    for (let i = 0; i < txnCount; i++) {
      const isCredit = Math.random() < 0.25;
      const m = rand(MERCHANTS);
      const amount = BigInt(randomInt(50, isCredit ? 5000 : 800) * 100);
      const hours = i * randomInt(2, 12);
      const entry: LedgerEntry = {
        id: id('t', ++txnCounter),
        entry_type: isCredit ? 'CREDIT' : 'DEBIT',
        amount_paise: amount.toString(),
        balance_after_paise: running.toString(),
        held_paise_after: '0',
        transaction_type: isCredit ? 'ADD_MONEY' : 'MERCHANT_PAY',
        reference_id: id('r', txnCounter),
        description: isCredit ? 'Wallet Top-up' : m.desc,
        idempotency_key: id('idk', txnCounter),
        hold_id: null,
        created_at: hoursAgo(hours),
        payment_source: isCredit ? rand(['UPI - HDFC Bank', 'Debit Card', 'Net Banking']) : undefined,
      };
      entries.push(entry);
      running = isCredit ? running - amount : running + amount;
      if (running < 0n) running = 0n;
    }
    ledgersByWallet[c.wallet_id] = entries.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  const subWallets: SubWallet[] = [];
  for (const c of customers.slice(0, 8)) {
    subWallets.push(
      { wallet_id: c.wallet_id, user_id: c.user_id, type: 'FOOD',  balance_paise: String(randomInt(0, 5000) * 100), is_active: true },
      { wallet_id: c.wallet_id, user_id: c.user_id, type: 'NCMC',  balance_paise: String(randomInt(0, 3000) * 100), cap_paise: '300000', is_active: true },
      { wallet_id: c.wallet_id, user_id: c.user_id, type: 'FASTAG', balance_paise: '30000', is_active: true },
      { wallet_id: c.wallet_id, user_id: c.user_id, type: 'GIFT',  balance_paise: String(randomInt(0, 2000) * 100), expiry_date: new Date(Date.now() + 90 * 86400_000).toISOString().slice(0, 10), is_active: true },
      { wallet_id: c.wallet_id, user_id: c.user_id, type: 'FUEL',  balance_paise: String(randomInt(0, 4000) * 100), is_active: true },
    );
  }

  cachedSeed = { customers, ledgersByWallet, subWallets };
  return cachedSeed;
}

export function mockListCustomers(): AdminCustomer[] {
  return buildSeed().customers;
}

export function mockGetCustomer(walletId: string): AdminCustomer | undefined {
  return buildSeed().customers.find(c => c.wallet_id === walletId);
}

export function mockGetWalletStatus(walletId: string): WalletStatusResponse {
  const c = mockGetCustomer(walletId);
  const now = new Date().toISOString();
  if (!c) {
    return {
      wallet_id: walletId, user_id: walletId, state: 'DORMANT', kyc_tier: 'MINIMUM',
      balance_paise: '0', held_paise: '0', available_paise: '0', is_active: false,
      created_at: now, updated_at: now,
    };
  }
  return {
    wallet_id: c.wallet_id, user_id: c.user_id, state: c.state, kyc_tier: c.kyc_tier,
    balance_paise: c.balance_paise, held_paise: '0', available_paise: c.available_paise,
    is_active: c.state === 'ACTIVE',
    last_activity_at: c.last_activity_at, created_at: c.created_at, updated_at: c.last_activity_at,
  };
}

export function mockGetLedger(walletId: string, limit = 50): LedgerResponse {
  const entries = buildSeed().ledgersByWallet[walletId] ?? [];
  return {
    success: true, wallet_id: walletId,
    entries: entries.slice(0, limit),
    pagination: { next_cursor: null, has_more: entries.length > limit },
  };
}

export function mockGetKycStatus(walletId: string): KycStatusResponse {
  const c = mockGetCustomer(walletId);
  return {
    wallet_id: walletId,
    kyc_state: c?.kyc_tier === 'FULL' ? 'FULL_KYC' : 'MIN_KYC',
    kyc_tier: c?.kyc_tier ?? 'MINIMUM',
    wallet_expiry_date: c?.kyc_tier === 'FULL' ? null : new Date(Date.now() + 365 * 86400_000).toISOString().slice(0, 10),
    ckyc_number: c?.kyc_tier === 'FULL' ? '15-' + (1000000000 + randomInt(0, 8999999999)) : null,
    pan_masked: c?.kyc_tier === 'FULL' ? 'XXXXX' + randomInt(1000, 9999) + 'X' : null,
    aadhaar_verified: c?.kyc_tier === 'FULL',
  };
}

export function mockListAllTransactions(): Array<LedgerEntry & { wallet_id: string; customer_name: string }> {
  const seed = buildSeed();
  const all: Array<LedgerEntry & { wallet_id: string; customer_name: string }> = [];
  for (const c of seed.customers) {
    for (const e of seed.ledgersByWallet[c.wallet_id]) {
      all.push({ ...e, wallet_id: c.wallet_id, customer_name: c.name });
    }
  }
  return all.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function mockListSubWallets(): SubWallet[] { return buildSeed().subWallets; }

export function mockGetMetrics(): AdminMetrics {
  const seed = buildSeed();
  const today = new Date().toISOString().slice(0, 10);
  let floatTotal = 0n;
  let txnsToday = 0;
  let volumeToday = 0n;
  for (const c of seed.customers) floatTotal += BigInt(c.balance_paise);
  for (const c of seed.customers) {
    for (const e of seed.ledgersByWallet[c.wallet_id]) {
      if (e.created_at.startsWith(today)) {
        txnsToday++;
        volumeToday += BigInt(e.amount_paise);
      }
    }
  }
  const active = seed.customers.filter(c => c.state === 'ACTIVE').length;
  const fullKyc = seed.customers.filter(c => c.kyc_tier === 'FULL').length;
  return {
    totalWallets: seed.customers.length,
    activeWallets: active,
    fullKycShare: fullKyc / seed.customers.length,
    totalFloatPaise: floatTotal.toString(),
    txnsToday,
    volumeTodayPaise: volumeToday.toString(),
    failedSagasToday: randomInt(0, 3),
  };
}
