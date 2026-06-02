import type { ReactNode } from 'react';

interface StatProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: 'default' | 'good' | 'bad' | 'warn';
}

const TONES = {
  default: 'text-slate-900',
  good: 'text-emerald-700',
  bad: 'text-rose-700',
  warn: 'text-amber-700',
};

export default function Stat({ label, value, hint, tone = 'default' }: StatProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${TONES[tone]}`}>{value}</div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  );
}
