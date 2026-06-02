import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/admin.api';
import type { LedgerEntry } from '../types/api.types';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner, { EmptyState } from '../components/ui/Spinner';
import { formatPaise, formatDateTime, shortId } from '../utils/format';
import { categorize } from '../utils/mcc';
import { useAdminStore } from '../store/admin.store';

type Row = LedgerEntry & { wallet_id: string; customer_name: string };

export default function TransactionsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const { txnSearch, txnType, txnRange, setTxnSearch, setTxnType, setTxnRange } = useAdminStore();

  useEffect(() => {
    let alive = true;
    adminApi.listAllTransactions().then((r) => { if (alive) setRows(r); });
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const now = Date.now();
    const cutoff = txnRange === 'today' ? now - 86400_000
      : txnRange === '7d' ? now - 7 * 86400_000
      : txnRange === '30d' ? now - 30 * 86400_000
      : 0;
    const q = txnSearch.toLowerCase().trim();
    return rows.filter((r) => {
      if (cutoff && new Date(r.created_at).getTime() < cutoff) return false;
      if (txnType && r.entry_type !== txnType) return false;
      if (q && !(r.description ?? '').toLowerCase().includes(q) && !r.customer_name.toLowerCase().includes(q) && !r.wallet_id.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, txnSearch, txnType, txnRange]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Transactions</h1>
        <p className="text-sm text-slate-500">All ledger entries across wallets. Filterable by type, range, and free text.</p>
      </div>

      <Card padding="none">
        <div className="p-4 flex flex-wrap gap-3 items-center border-b border-slate-100">
          <input
            value={txnSearch}
            onChange={(e) => setTxnSearch(e.target.value)}
            placeholder="Search merchant, customer, or wallet ID"
            className="flex-1 min-w-[240px] h-9 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <select
            value={txnType}
            onChange={(e) => setTxnType(e.target.value as '' | 'CREDIT' | 'DEBIT')}
            className="h-9 px-3 text-sm rounded-lg border border-slate-200"
          >
            <option value="">All types</option>
            <option value="CREDIT">Credit</option>
            <option value="DEBIT">Debit</option>
          </select>
          <select
            value={txnRange}
            onChange={(e) => setTxnRange(e.target.value as 'today' | '7d' | '30d' | 'all')}
            className="h-9 px-3 text-sm rounded-lg border border-slate-200"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
          <span className="ml-auto text-xs text-slate-500">{filtered.length} of {rows?.length ?? 0}</span>
        </div>

        {!rows ? (
          <div className="p-8 flex items-center justify-center gap-2 text-slate-500"><Spinner /> Loading transactions…</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No transactions" hint="Adjust filters or pick a wider date range." />
        ) : (
          <div className="overflow-x-auto scroll-thin">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="text-left px-4 py-2.5">Time</th>
                  <th className="text-left px-4 py-2.5">Customer</th>
                  <th className="text-left px-4 py-2.5">Description</th>
                  <th className="text-left px-4 py-2.5">Category</th>
                  <th className="text-left px-4 py-2.5">Type</th>
                  <th className="text-right px-4 py-2.5">Amount</th>
                  <th className="text-left px-4 py-2.5">Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.slice(0, 250).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{formatDateTime(t.created_at)}</td>
                    <td className="px-4 py-2.5">
                      <Link className="text-cyan-700 hover:underline" to={`/customers/${t.wallet_id}`}>{t.customer_name}</Link>
                    </td>
                    <td className="px-4 py-2.5 text-slate-800 max-w-[260px] truncate">{t.description}</td>
                    <td className="px-4 py-2.5 text-slate-600">{categorize(t.description)}</td>
                    <td className="px-4 py-2.5">
                      <Badge tone={t.entry_type === 'CREDIT' ? 'green' : 'slate'}>{t.entry_type}</Badge>
                    </td>
                    <td className={`px-4 py-2.5 text-right font-medium ${t.entry_type === 'CREDIT' ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {t.entry_type === 'CREDIT' ? '+' : '−'}{formatPaise(t.amount_paise)}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">{shortId(t.reference_id ?? t.id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 250 && (
              <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-100">
                Showing first 250 — refine filters to see more.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
