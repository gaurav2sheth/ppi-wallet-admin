import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/admin.api';
import type { AdminMetrics, LedgerEntry } from '../types/api.types';
import Card from '../components/ui/Card';
import Stat from '../components/ui/Stat';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { formatPaiseCompact, formatRelative, shortId } from '../utils/format';
import { categorize, CATEGORY_COLOR } from '../utils/mcc';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [recent, setRecent] = useState<Array<LedgerEntry & { wallet_id: string; customer_name: string }>>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([adminApi.getMetrics(), adminApi.listAllTransactions()])
      .then(([m, txns]) => { if (!alive) return; setMetrics(m); setRecent(txns.slice(0, 8)); });
    return () => { alive = false; };
  }, []);

  if (!metrics) return <div className="flex items-center gap-2 text-slate-500"><Spinner /> Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Snapshot of platform activity and compliance posture.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total wallets" value={metrics.totalWallets} hint={`${metrics.activeWallets} active`} />
        <Stat label="Full-KYC share" value={`${Math.round(metrics.fullKycShare * 100)}%`} hint="Tier-2 customers" tone="good" />
        <Stat label="Total float" value={formatPaiseCompact(metrics.totalFloatPaise)} hint="Aggregate balance" />
        <Stat label="Txns today" value={metrics.txnsToday} hint={formatPaiseCompact(metrics.volumeTodayPaise)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Recent activity" subtitle="Live feed across all wallets" className="lg:col-span-2" action={<Link to="/transactions" className="text-xs text-cyan-700 hover:underline">View all →</Link>}>
          <ul className="divide-y divide-slate-100 -mx-5">
            {recent.map((t) => {
              const cat = categorize(t.description);
              return (
                <li key={t.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-9 h-9 rounded-full grid place-items-center text-white text-[11px] font-semibold" style={{ background: CATEGORY_COLOR[cat] }}>
                    {cat.split(' ')[0].slice(0, 3).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-900 truncate">{t.description ?? 'Transaction'}</div>
                    <div className="text-xs text-slate-500 truncate">
                      <Link to={`/customers/${t.wallet_id}`} className="hover:underline">{t.customer_name}</Link>
                      <span className="mx-1">·</span>{formatRelative(t.created_at)}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${t.entry_type === 'CREDIT' ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {t.entry_type === 'CREDIT' ? '+' : '−'}{formatPaiseCompact(t.amount_paise)}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="Health & compliance">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Failed sagas (24h)</span>
              <Badge tone={metrics.failedSagasToday === 0 ? 'green' : 'amber'}>{metrics.failedSagasToday}</Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">PPI float headroom</span>
              <Badge tone="cyan">Within RBI cap</Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Backend</span>
              <Badge tone="green">Mock fallback OK</Badge>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Last refresh</span>
              <span className="text-xs text-slate-500">{formatRelative(new Date().toISOString())}</span>
            </li>
            <li className="text-[11px] text-slate-400 pt-3 border-t border-slate-100">
              Snapshot {shortId(crypto.randomUUID?.() ?? 'snap-x')}
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
