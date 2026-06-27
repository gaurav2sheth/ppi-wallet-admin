import Card from '../components/ui/Card';
import { getApiBase, isBackendConfigured, apiReachable } from '../api/client';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500">Environment configuration and platform info.</p>
      </div>

      <Card title="Backend">
        <dl className="text-sm space-y-2">
          <Row k="API base" v={<span className="font-mono">{getApiBase()}</span>} />
          <Row k="Configured" v={isBackendConfigured() ? 'Yes (VITE_API_URL set)' : 'No — using mock data'} />
          <Row k="Reachable" v={apiReachable ? 'Yes' : 'No (will fall back to mock)'} />
        </dl>
      </Card>

      <Card title="About">
        <p className="text-sm text-slate-700">
          PPI Wallet Admin v0.1.0. Designed to inspect and operate the consumer wallet platform.
          Reads from the Render Express backend when available and falls back to local seed data otherwise.
        </p>
      </Card>

      <Card title="Useful links">
        <ul className="text-sm space-y-1.5">
          <li>· Wallet app (consumer): <a className="text-cyan-700 hover:underline" href="https://gaurav2sheth.github.io/ppi-wallet-app/" target="_blank" rel="noreferrer">gaurav2sheth.github.io/ppi-wallet-app</a></li>
          <li>· Backend health: <a className="text-cyan-700 hover:underline" href="https://ppi-wallet-api.onrender.com/health" target="_blank" rel="noreferrer">ppi-wallet-api.onrender.com/health</a></li>
          <li>· Source: <a className="text-cyan-700 hover:underline" href="https://github.com/gaurav2sheth/ppi-wallet-app" target="_blank" rel="noreferrer">github.com/gaurav2sheth/ppi-wallet-app</a></li>
        </ul>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-slate-800 text-right">{v}</dd>
    </div>
  );
}
