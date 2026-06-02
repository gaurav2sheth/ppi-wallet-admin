import { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatPaise } from '../utils/format';
import { PPI_LIMITS } from '../utils/constants';

type Result = {
  allowed: boolean;
  reason?: string;
  capPaise: bigint;
  effectivePaise: bigint;
};

function validate(amountRupees: number, currentBalanceRupees: number, monthlyLoadedRupees: number, kycTier: 'FULL' | 'MINIMUM'): Result {
  const cap = kycTier === 'FULL' ? PPI_LIMITS.BALANCE_CAP_FULL_KYC : PPI_LIMITS.BALANCE_CAP_MIN_KYC;
  const monthlyCap = PPI_LIMITS.MONTHLY_LOAD_FULL_KYC;
  const amount = BigInt(Math.round(amountRupees * 100));
  const balance = BigInt(Math.round(currentBalanceRupees * 100));
  const monthly = BigInt(Math.round(monthlyLoadedRupees * 100));

  if (amount <= 0n) return { allowed: false, reason: 'Amount must be positive.', capPaise: cap, effectivePaise: 0n };
  if (balance + amount > cap) return { allowed: false, reason: `Would exceed ${kycTier === 'FULL' ? '₹1L' : '₹10K'} balance cap.`, capPaise: cap, effectivePaise: balance + amount };
  if (kycTier === 'FULL' && monthly + amount > monthlyCap) return { allowed: false, reason: 'Would exceed ₹2L monthly load limit.', capPaise: monthlyCap, effectivePaise: monthly + amount };
  return { allowed: true, capPaise: cap, effectivePaise: balance + amount };
}

export default function LoadGuardPage() {
  const [amount, setAmount] = useState(5000);
  const [balance, setBalance] = useState(20000);
  const [monthly, setMonthly] = useState(50000);
  const [kyc, setKyc] = useState<'FULL' | 'MINIMUM'>('FULL');

  const r = validate(amount, balance, monthly, kyc);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Load Guard</h1>
        <p className="text-sm text-slate-500">Simulate RBI PPI load validation. Mirrors the rules enforced in the wallet app and backend.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Inputs">
          <div className="space-y-4 text-sm">
            <Field label="KYC tier">
              <select value={kyc} onChange={(e) => setKyc(e.target.value as 'FULL' | 'MINIMUM')} className="h-9 px-3 border border-slate-200 rounded-lg w-full">
                <option value="FULL">Full KYC (₹1L cap)</option>
                <option value="MINIMUM">Min KYC (₹10K cap)</option>
              </select>
            </Field>
            <Field label="Load amount (₹)">
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="h-9 px-3 border border-slate-200 rounded-lg w-full" />
            </Field>
            <Field label="Current balance (₹)">
              <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="h-9 px-3 border border-slate-200 rounded-lg w-full" />
            </Field>
            <Field label="Loaded this month (₹)">
              <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="h-9 px-3 border border-slate-200 rounded-lg w-full" />
            </Field>
          </div>
        </Card>

        <Card title="Decision">
          <div className="text-center py-6">
            <Badge tone={r.allowed ? 'green' : 'red'}>{r.allowed ? 'ALLOWED' : 'BLOCKED'}</Badge>
            <div className="mt-3 text-sm text-slate-700">{r.reason ?? 'Load passes all PPI checks.'}</div>
            <div className="mt-6 text-xs text-slate-500">Resulting balance / total: {formatPaise(r.effectivePaise.toString())}</div>
            <div className="text-xs text-slate-500">Cap: {formatPaise(r.capPaise.toString())}</div>
          </div>
        </Card>
      </div>

      <Card title="RBI PPI rules summary">
        <ul className="text-sm text-slate-700 space-y-2 list-disc pl-5">
          <li>Balance cap is ₹1,00,000 for Full-KYC and ₹10,000 for Min-KYC wallets.</li>
          <li>Aggregate monthly load is capped at ₹2,00,000 for Full-KYC.</li>
          <li>NCMC Transit has an independent ₹3,000 cap and does not draw from the main wallet for transit MCCs.</li>
          <li>FASTag uses a per-vehicle ₹300 security deposit; toll deductions hit main wallet first.</li>
        </ul>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-500 mb-1 block">{label}</span>
      {children}
    </label>
  );
}
