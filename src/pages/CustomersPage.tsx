import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/admin.api';
import type { AdminCustomer } from '../types/api.types';
import Card from '../components/ui/Card';
import Badge, { kycTone, stateTone } from '../components/ui/Badge';
import Spinner, { EmptyState } from '../components/ui/Spinner';
import { formatPaise, formatRelative, initials } from '../utils/format';
import { useAdminStore } from '../store/admin.store';

export default function CustomersPage() {
  const [rows, setRows] = useState<AdminCustomer[] | null>(null);
  const { customerSearch, setCustomerSearch } = useAdminStore();

  useEffect(() => {
    let alive = true;
    adminApi.listCustomers().then((r) => { if (alive) setRows(r); });
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = customerSearch.toLowerCase().trim();
    if (!q) return rows;
    return rows.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.wallet_id.toLowerCase().includes(q),
    );
  }, [rows, customerSearch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Customers</h1>
        <p className="text-sm text-slate-500">PPI wallet holders with KYC and balance state.</p>
      </div>

      <Card padding="none">
        <div className="p-4 flex flex-wrap gap-3 items-center border-b border-slate-100">
          <input
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder="Search name, phone, email, wallet ID"
            className="flex-1 min-w-[240px] h-9 px-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <span className="ml-auto text-xs text-slate-500">{filtered.length} customers</span>
        </div>

        {!rows ? (
          <div className="p-8 flex items-center justify-center gap-2 text-slate-500"><Spinner /> Loading customers…</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No customers match" hint="Try a different search term." />
        ) : (
          <div className="overflow-x-auto scroll-thin">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="text-left px-4 py-2.5">Customer</th>
                  <th className="text-left px-4 py-2.5">Contact</th>
                  <th className="text-left px-4 py-2.5">City</th>
                  <th className="text-left px-4 py-2.5">KYC</th>
                  <th className="text-left px-4 py-2.5">Status</th>
                  <th className="text-right px-4 py-2.5">Balance</th>
                  <th className="text-left px-4 py-2.5">Last active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.wallet_id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <Link to={`/customers/${c.wallet_id}`} className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-paytm-navy)] text-white text-[11px] grid place-items-center font-semibold">{initials(c.name)}</div>
                        <div className="min-w-0">
                          <div className="text-slate-900 group-hover:text-cyan-700">{c.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{c.wallet_id}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      <div>{c.phone}</div>
                      <div className="text-[11px] text-slate-500">{c.email}</div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">{c.city}</td>
                    <td className="px-4 py-2.5"><Badge tone={kycTone(c.kyc_tier)}>{c.kyc_tier}</Badge></td>
                    <td className="px-4 py-2.5"><Badge tone={stateTone(c.state)}>{c.state}</Badge></td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-900">{formatPaise(c.balance_paise)}</td>
                    <td className="px-4 py-2.5 text-slate-600 text-xs">{formatRelative(c.last_activity_at)}</td>
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
