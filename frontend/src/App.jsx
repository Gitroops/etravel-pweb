import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TravelProvider, useTravel } from './context/TravelContext';
import Navbar from './components/common/Navbar';
import AdminSidebar from './components/common/AdminSidebar';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import HomePage from './pages/buyer/HomePage';
import ExplorePage from './pages/buyer/ExplorePage';
import CartPage from './pages/buyer/CartPage';
import ScheduleWizardPage from './pages/buyer/ScheduleWizardPage';
import OrdersPage from './pages/buyer/OrdersPage';
import AccountPage from './pages/buyer/AccountPage';

import AdminDestinations from './pages/admin/AdminDestinations';
import AdminPricing from './pages/admin/AdminPricing';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPromos from './pages/admin/AdminPromos';
import AdminArticles from './pages/admin/AdminArticles';
import AdminUsers from './pages/admin/AdminUsers';

function AppLayout() {
  const { role } = useTravel();

  return (
    <Routes>
      {/* Halaman Autentikasi (Tanpa Navbar/Sidebar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/daftar" element={<RegisterPage />} />

      {/* Layout Admin */}
      {role === 'admin' ? (
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF9F6]">
              <AdminSidebar />
              <main className="flex-1 p-4 sm:p-8 max-w-5xl">
                <Routes>
                  <Route path="/admin/destinasi" element={<AdminDestinations />} />
                  <Route path="/admin/harga" element={<AdminPricing />} />
                  <Route path="/admin/pesanan" element={<AdminOrders />} />
                  <Route path="/admin/promo" element={<AdminPromos />} />
                  <Route path="/admin/artikel" element={<AdminArticles />} />
                  <Route path="/admin/pengguna" element={<AdminUsers />} />
                  <Route path="*" element={<Navigate to="/admin/destinasi" replace />} />
                </Routes>
              </main>
            </div>
          }
        />
      ) : (
        /* Layout Pembeli */
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/cari" element={<ExplorePage />} />
                  <Route path="/keranjang" element={<CartPage />} />
                  <Route path="/atur-jadwal" element={<ScheduleWizardPage />} />
                  <Route path="/pesanan" element={<OrdersPage />} />
                  <Route path="/akun" element={<AccountPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          }
        />
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <TravelProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TravelProvider>
  );
}