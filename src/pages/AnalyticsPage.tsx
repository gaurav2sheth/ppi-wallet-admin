import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../api/admin.api';
import type { LedgerEntry } from '../types/api.types';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { formatPaise, formatPaiseCompact } from '../utils/format';
import { categorize, CATEGORY_COLOR, type MccCategory } from '../utils/mcc';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

type Row = LedgerEntry & { wallet_id: string; customer_name: string };

export default function AnalyticsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let alive = true;
    adminApi.listAllTransactions().then(r => { if (alive) setRows(r); });
    return () => { alive = false; };
  }, []);

  const { categoryData, dailyData, topMerchants } = useMemo(() => {
    if (!rows) return { categoryData: [], dailyData: [], topMerchants: [] };
    const debits = rows.filter(r => r.entry_type === 'DEBIT');

    const catMap = new Map<MccCategory, bigint>();
    for (const r of debits) {
      const cat = categorize(r.description);
      catMap.set(cat, (catMap.get(cat) ?? 0n) + BigInt(r.amount_paise));
    }
    const categoryData = [...catMap.entries()]
      .map(([name, paise]) => ({ name, value: Number(paise / 100n), color: CATEGORY_COLOR[name] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const dayMap = new Map<string, bigint>();
    for (const r of debits) {
      const day = r.created_at.slice(0, 10);
      dayMap.set(day, (dayMap.get(day) ?? 0n) + BigInt(r.amount_paise));
    }
    const dailyData = [...dayMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, paise]) => ({ date: date.slice(5), value: Number(paise / 100n) }));

    const merchMap = new Map<string, { count: number; amount: bigint }>();
    for (const r of debits) {
      const key = (r.description ?? 'Unknown').split(/[\s—-]/).slice(0, 2).join(' ');
      const g = merchMap.get(key) ?? { count: 0, amount: 0n };
      g.count += 1;
      g.amount += BigInt(r.amount_paise);
      merchMap.set(key, g);
    }
    const topMerchants = [...merchMap.entries()]
      .sort((a, b) => Number(b[1].amount - a[1].amount))
      .slice(0, 8)
      .map(([name, g]) => ({ name, count: g.count, amount: g.amount.toString() }));

    return { categoryData, dailyData, topMerchants };
  }, [rows]);

  if (!rows) return <div className="flex items-center gap-2 text-slate-500"><Spinner /> Loading analytics…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500">Spend breakdown by category, daily trend, and top merchants across the platform.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Spend by category">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2}>
                  {categoryData.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Daily spend (last 14 days)">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={dailyData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatPaiseCompact(BigInt(v) * 100n)} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                <Bar dataKey="value" fill="#00B9F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Top merchants" padding="none">
        <ul className="divide-y divide-slate-100">
          {topMerchants.map((m, i) => (
            <li key={m.name} className="flex items-center gap-4 px-5 py-3">
              <div className="w-6 text-slate-400 text-xs font-mono">{(i + 1).toString().padStart(2, '0')}</div>
              <div className="flex-1 text-sm text-slate-800">{m.name}</div>
              <div className="text-xs text-slate-500 w-24 text-right">{m.count} txns</div>
              <div className="text-sm font-medium text-slate-900 w-32 text-right">{formatPaise(m.amount)}</div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
