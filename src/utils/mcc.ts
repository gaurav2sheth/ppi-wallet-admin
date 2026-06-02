// Mirrors the wallet app's MCC categorisation, simplified for admin views.

export type MccCategory =
  | 'Taxi/Ride' | 'Food & Dining' | 'Groceries' | 'Shopping' | 'Fuel'
  | 'Travel' | 'Entertainment' | 'Health' | 'Education' | 'Utilities'
  | 'Money Transfer' | 'Refunds' | 'Recharge' | 'Insurance' | 'Bank Transfer'
  | 'Wallet Top-up' | 'Subscription' | 'Government' | 'Others';

const KEYWORDS: Array<[MccCategory, RegExp]> = [
  ['Taxi/Ride', /uber|ola|rapido|cab|taxi|auto/i],
  ['Food & Dining', /swiggy|zomato|restaurant|cafe|pizza|domino|kfc|mcdonald|food/i],
  ['Groceries', /bigbasket|blinkit|zepto|grofers|grocery|supermarket|dmart/i],
  ['Shopping', /amazon|flipkart|myntra|ajio|shop|mall|nykaa/i],
  ['Fuel', /hp|indian oil|iocl|bpcl|shell|petrol|fuel/i],
  ['Travel', /irctc|makemytrip|cleartrip|goibibo|flight|hotel|train/i],
  ['Entertainment', /bookmy|pvr|inox|netflix|prime video|spotify|hotstar/i],
  ['Health', /apollo|pharmeasy|1mg|medplus|hospital|clinic|pharmacy/i],
  ['Education', /byju|unacademy|vedantu|school|college|tuition/i],
  ['Utilities', /electricity|water|gas|broadband|dth|bill/i],
  ['Money Transfer', /transfer|p2p|send/i],
  ['Refunds', /refund|reversal/i],
  ['Recharge', /recharge|mobile|airtel|jio|vi/i],
  ['Insurance', /insurance|premium|lic/i],
  ['Bank Transfer', /bank|imps|neft|rtgs/i],
  ['Wallet Top-up', /wallet|top-?up|add money/i],
  ['Subscription', /subscription|monthly|annual/i],
  ['Government', /tax|gst|government|gov/i],
];

export function categorize(description: string | null | undefined): MccCategory {
  if (!description) return 'Others';
  for (const [cat, rx] of KEYWORDS) if (rx.test(description)) return cat;
  return 'Others';
}

export const CATEGORY_COLOR: Record<MccCategory, string> = {
  'Taxi/Ride': '#F59E0B',
  'Food & Dining': '#EF4444',
  'Groceries': '#10B981',
  'Shopping': '#8B5CF6',
  'Fuel': '#0EA5E9',
  'Travel': '#3B82F6',
  'Entertainment': '#EC4899',
  'Health': '#14B8A6',
  'Education': '#6366F1',
  'Utilities': '#0891B2',
  'Money Transfer': '#475569',
  'Refunds': '#22C55E',
  'Recharge': '#A855F7',
  'Insurance': '#D97706',
  'Bank Transfer': '#1E40AF',
  'Wallet Top-up': '#00B9F1',
  'Subscription': '#7C3AED',
  'Government': '#9CA3AF',
  'Others': '#64748B',
};
