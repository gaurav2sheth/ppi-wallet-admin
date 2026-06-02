import type { PropsWithChildren } from 'react';

type Tone = 'slate' | 'green' | 'amber' | 'red' | 'cyan' | 'violet';
const TONES: Record<Tone, string> = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  red:   'bg-rose-50 text-rose-700 border-rose-200',
  cyan:  'bg-cyan-50 text-cyan-700 border-cyan-200',
  violet:'bg-violet-50 text-violet-700 border-violet-200',
};

export default function Badge({ tone = 'slate', children }: PropsWithChildren<{ tone?: Tone }>) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function stateTone(state: string): Tone {
  switch (state) {
    case 'ACTIVE': return 'green';
    case 'SUSPENDED': return 'red';
    case 'DORMANT': return 'amber';
    case 'EXPIRED': case 'CLOSED': return 'slate';
    default: return 'slate';
  }
}

export function kycTone(tier: string): Tone {
  return tier === 'FULL' ? 'cyan' : 'amber';
}
