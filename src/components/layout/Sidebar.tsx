import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-[var(--color-paytm-navy)] text-white flex flex-col">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-[var(--color-paytm-cyan)] flex items-center justify-center font-bold text-[var(--color-paytm-navy)]">P</div>
        <div>
          <div className="font-semibold leading-tight">PPI Wallet</div>
          <div className="text-xs text-white/60">Admin</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 text-[11px] text-white/50">
        v0.1.0 · {new Date().getFullYear()}
      </div>
    </aside>
  );
}
