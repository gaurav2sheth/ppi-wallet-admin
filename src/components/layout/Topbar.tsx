import { useEffect, useState } from 'react';
import { apiReachable, getApiBase, isBackendConfigured } from '../../api/client';

export default function Topbar() {
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1500);
    return () => clearInterval(id);
  }, []);

  const status = !isBackendConfigured()
    ? { label: 'Mock data', color: 'bg-slate-400' }
    : apiReachable
      ? { label: 'Live backend', color: 'bg-emerald-500' }
      : { label: 'Backend offline · mock fallback', color: 'bg-amber-500' };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4">
      <div className="text-sm text-slate-700">Welcome back, Admin</div>
      <div className="ml-auto flex items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          {status.label}
        </span>
        <span className="text-slate-400 hidden md:inline" title={getApiBase()}>{getApiBase()}</span>
      </div>
    </header>
  );
}
