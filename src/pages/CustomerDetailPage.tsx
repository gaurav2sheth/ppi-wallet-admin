import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adminApi } from '../api/admin.api';
import type { KycStatusResponse, LedgerEntry, WalletStatusResponse } from '../types/api.types';
import Card from '../components/ui/Card';
import Badge, { kycTone, stateTone } from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { formatPaise, formatDateTime, initials, shortId } from '../utils/format';
import { categorize } from '../utils/mcc';

export default function CustomerDetailPage() {
  const { walletId = '' } = useParams();
  const [status, setStatus] = useState<WalletStatusResponse | null>(null);
  const [kyc, setKyc] = useState<KycStatusResponse | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[] | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      adminApi.getWalletStatus(walletId),
      adminApi.getKycStatus(walletId),
      adminApi.getLedger(walletId, 100),
    ]).then(([s, k, l]) => { if (alive) { setStatus(s); setKyc(k); setLedger(l.entries); } });
    return () => { alive = false; };
  }, [walletId]);

  if (!status || !kyc || !ledger) {
    return <div className="flex items-center gap-2 text-slate-500"><Spinner /> Loading customer…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/customers" className="text-sm text-cyan-700 hover:underline">← Customers</Link>
      </div>

      <Card>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-paytm-navy)] text-white grid place-items-center font-semibold text-lg">
            {initials(walletId)}
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold text-slate-900">{shortId(walletId)}</div>
            <div className="text-xs text-slate-500 font-mono">user: {status.user_id}</div>
            <div className="flex gap-2 mt-2">
              <Badge tone={stateTone(status.state)}>{status.state}</Badge>
              <Badge tone={kycTone(status.kyc_tier)}>KYC: {status.kyc_tier}</Badge>
              {kyc.aadhaar_verified && <Badge tone="green">Aadhaar ✓</Badge>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase text-slate-500">Balance</div>
            <div className="text-2xl font-semibold text-slate-900">{formatPaise(status.balance_paise)}</div>
            <div className="text-xs text-slate-500">Available {formatPaise(status.available_paise)}</div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="KYC profile">
          <dl className="text-sm space-y-2">
            <Row k="State" v={kyc.kyc_state} />
            <Row k="Tier" v={kyc.kyc_tier} />
            <Row k="PAN (masked)" v={kyc.pan_masked ?? '—'} />
            <Row k="CKYC #" v={kyc.ckyc_number ?? '—'} />
            <Row k="Aadhaar verified" v={kyc.aadhaar_verified ? 'Yes' : 'No'} />
            <Row k="Wallet expiry" v={kyc.wallet_expiry_date ?? '—'} />
          </dl>
        </Card>
        <Card title="Wallet lifecycle">
          <dl className="text-sm space-y-2">
            <Row k="Wallet ID" v={<span className="font-mono">{walletId}</span>} />
            <Row k="State" v={status.state} />
            <Row k="Active" v={status.is_active ? 'Yes' : 'No'} />
            <Row k="Held" v={formatPaise(status.held_paise)} />
            <Row k="Created" v={formatDateTime(status.created_at)} />
            <Row k="Last activity" v={status.last_activity_at ? formatDateTime(status.last_activity_at) : '—'} />
          </dl>
        </Card>
      </div>

      <Card title="Ledger" subtitle={`${ledger.length} entries`} padding="none">
        <div className="overflow-x-auto scroll-thin">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="text-left px-4 py-2.5">Time</th>
                <th className="text-left px-4 py-2.5">Description</th>
                <th className="text-left px-4 py-2.5">Category</th>
                <th className="text-left px-4 py-2.5">Type</th>
                <th className="text-right px-4 py-2.5">Amount</th>
                <th className="text-right px-4 py-2.5">Balance after</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledger.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{formatDateTime(e.created_at)}</td>
                  <td className="px-4 py-2.5">{e.description}</td>
                  <td className="px-4 py-2.5 text-slate-600">{categorize(e.description)}</td>
                  <td className="px-4 py-2.5"><Badge tone={e.entry_type === 'CREDIT' ? 'green' : 'slate'}>{e.entry_type}</Badge></td>
                  <td className={`px-4 py-2.5 text-right font-medium ${e.entry_type === 'CREDIT' ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {e.entry_type === 'CREDIT' ? '+' : '−'}{formatPaise(e.amount_paise)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{formatPaise(e.balance_after_paise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-slate-800 text-right">{v}</dd>
    </div>
  );
}
