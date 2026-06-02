import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../api/admin.api';
import type { SubWallet, SubWalletType } from '../types/api.types';
import Card from '../components/ui/Card';
import Stat from '../components/ui/Stat';
import Spinner, { EmptyState } from '../components/ui/Spinner';
import { formatPaise, formatPaiseCompact, shortId } from '../utils/format';
import { SUB_WALLET_ICONS, SUB_WALLET_LABELS } from '../utils/constants';

const ALL_TYPES: SubWalletType[] = ['FOOD', 'NCMC', 'FASTAG', 'GIFT', 'FUEL'];

export default function SubWalletsPage() {
  const [rows, setRows] = useState<SubWallet[] | null>(null);
  const [filter, setFilter] = useState<SubWalletType | ''>('');

  useEffect(() => {
    let alive = true;
    adminApi.listSubWallets().then(r => { if (alive) setRows(r); });
    return () => { alive = false; };
  }, []);

  const groups = useMemo(() => {
    const m = new Map<SubWalletType, { total: bigint; count: number }>();
    if (rows) for (const r of rows) {
      const g = m.get(r.type) ?? { total: 0n, count: 0 };
      g.total += BigInt(r.balance_paise);
      g.count += 1;
      m.set(r.type, g);
    }
    return m;
  }, [rows]);

  const filtered = useMemo(() => rows?.filter(r => !filter || r.type === filter) ?? [], [rows, filter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Sub-Wallets</h1>
        <p className="text-sm text-slate-500">Corporate benefits & specialised wallets (Food, NCMC, FASTag, Gift, Fuel).</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {ALL_TYPES.map((t) => {
          const g = groups.get(t) ?? { total: 0n, count: 0 };
          return (
            <button key={t} onClick={() => setFilter(filter === t ? '' : t)} className="text-left">
              <Stat
                label={`${SUB_WALLET_ICONS[t] ?? ''} ${SUB_WALLET_LABELS[t]}`}
                value={formatPaiseCompact(g.total.toString())}
                hint={`${g.count} wallets`}
                tone={filter === t ? 'good' : 'default'}
              />
            </button>
          );
        })}
      </div>

      <Card title={filter ? `${SUB_WALLET_LABELS[filter]} wallets` : 'All sub-wallets'} padding="none">
        {!rows ? (
          <div className="p-8 flex items-center justify-center gap-2 text-slate-500"><Spinner /> Loading sub-wallets…</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No sub-wallets" />
        ) : (
          <div className="overflow-x-auto scroll-thin">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="text-left px-4 py-2.5">Type</th>
                  <th className="text-left px-4 py-2.5">Wallet</th>
                  <th className="text-left px-4 py-2.5">User</th>
                  <th className="text-right px-4 py-2.5">Balance</th>
                  <th className="text-right px-4 py-2.5">Cap</th>
                  <th className="text-left px-4 py-2.5">Expiry</th>
                  <th className="text-left px-4 py-2.5">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r, i) => (
                  <tr key={`${r.wallet_id}_${r.type}_${i}`} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">{SUB_WALLET_ICONS[r.type]} {SUB_WALLET_LABELS[r.type]}</td>
                    <td className="px-4 py-2.5 text-xs font-mono text-slate-600">{shortId(r.wallet_id)}</td>
                    <td className="px-4 py-2.5 text-xs font-mono text-slate-600">{shortId(r.user_id)}</td>
                    <td className="px-4 py-2.5 text-right">{formatPaise(r.balance_paise)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{r.cap_paise ? formatPaise(r.cap_paise) : '—'}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.expiry_date ?? '—'}</td>
                    <td className="px-4 py-2.5">{r.is_active ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
