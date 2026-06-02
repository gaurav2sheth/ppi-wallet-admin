import type { PropsWithChildren, ReactNode } from 'react';

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  padding?: 'default' | 'tight' | 'none';
}

export default function Card({ title, subtitle, action, className = '', padding = 'default', children }: PropsWithChildren<CardProps>) {
  const pad = padding === 'none' ? '' : padding === 'tight' ? 'p-4' : 'p-5';
  return (
    <section className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      {(title || action) && (
        <header className="px-5 pt-4 pb-3 flex items-center gap-3 border-b border-slate-100">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-slate-800 truncate">{title}</h2>}
            {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
          </div>
          {action && <div className="ml-auto shrink-0">{action}</div>}
        </header>
      )}
      <div className={pad}>{children}</div>
    </section>
  );
}
