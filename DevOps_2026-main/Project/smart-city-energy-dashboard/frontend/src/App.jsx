import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import DashboardLayout from './layout/DashboardLayout';
import AdminPanelPage from './pages/AdminPanelPage';
import BuildingsPage from './pages/BuildingsPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import EnergyAnalyticsPage from './pages/EnergyAnalyticsPage';
import LoginPage from './pages/LoginPage';
import PredictionPage from './pages/PredictionPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('smartcity_theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('smartcity_theme', theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout theme={theme} toggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />}>
          <Route index element={<DashboardPage />} />
          <Route path="/analytics" element={<EnergyAnalyticsPage />} />
          <Route path="/buildings" element={<BuildingsPage />} />
          <Route path="/predictions" element={<PredictionPage />} />
          <Route element={<RoleRoute role="admin" />}>
            <Route path="/admin" element={<AdminPanelPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
