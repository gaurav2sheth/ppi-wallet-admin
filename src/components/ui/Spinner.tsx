export default function Spinner({ size = 18 }: { size?: number }) {
  return (
    <svg className="animate-spin text-slate-400" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" />
      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-12 text-slate-500">
      <div className="text-sm font-medium text-slate-700">{title}</div>
      {hint && <div className="text-xs mt-1">{hint}</div>}
    </div>
  );
}
