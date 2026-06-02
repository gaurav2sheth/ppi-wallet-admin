import { Routes, Route, Navigate } from 'react-router-dom';
import AdminShell from './components/layout/AdminShell';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import SubWalletsPage from './pages/SubWalletsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoadGuardPage from './pages/LoadGuardPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:walletId" element={<CustomerDetailPage />} />
        <Route path="/sub-wallets" element={<SubWalletsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/load-guard" element={<LoadGuardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
