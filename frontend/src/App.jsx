import React, { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';

// --- Components ---
import Header from './components/Header';
import Footer from './components/Footer';

// --- Pages ---
import LandingPage    from './pages/LandingPage';
import SchedulePage   from './pages/SchedulePage';
import PaymentPage    from './pages/PaymentPage';
import MyBookings     from './pages/MyBookings';
import LoginPage      from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DisplayPage    from './pages/DisplayPage';

import { ToastProvider } from './context/ToastContext';

// --- Global Config ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('explore');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [courts, setCourts] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [quickSearch, setQuickSearch] = useState({ date: '', name: '' });
  const [targetCourtId, setTargetCourtId] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/courts`)
      .then(res => res.json())
      .then(data => setCourts(data))
      .catch(err => console.error(err));
  }, [currentPage]);

  // ── Admin auth ───────────────────────────────────
  const handleLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
    setCurrentPage('admin-dashboard');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
    setCurrentPage('explore');
  };

  // ── Booking flow ─────────────────────────────────
  const handleBookingConfirm = (slot) => {
    setSelectedSlot(slot);
    setCurrentPage('payment');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white">
        {currentPage !== 'admin-dashboard' && currentPage !== 'display' && (
          <Header currentPage={currentPage} setPage={setCurrentPage} API_URL={API_URL} />
        )}
        <main>
          {currentPage === 'explore'  && <LandingPage setPage={setCurrentPage} courts={courts} setQuickSearch={setQuickSearch} setTargetCourtId={setTargetCourtId} />}
          {currentPage === 'schedule' && (
            <SchedulePage courts={courts} onConfirm={handleBookingConfirm} API_URL={API_URL} quickSearch={quickSearch} targetCourtId={targetCourtId} setTargetCourtId={setTargetCourtId} />
          )}
          {currentPage === 'payment' && (
            <PaymentPage selection={selectedSlot} setPage={setCurrentPage} API_URL={API_URL} quickSearch={quickSearch} />
          )}
          {currentPage === 'my-bookings' && <MyBookings API_URL={API_URL} />}
          {currentPage === 'admin-dashboard' && (
            isAdmin
              ? <AdminDashboard onLogout={handleLogout} API_URL={API_URL} />
              : <LoginPage onLogin={handleLogin} API_URL={API_URL} />
          )}
        </main>

        {currentPage !== 'admin-dashboard' && currentPage !== 'display' && <Footer />}

        {/* Display Mode — fullscreen overlay */}
        {currentPage === 'display' && (
          <DisplayPage onExit={() => setCurrentPage('explore')} />
        )}

        {currentPage !== 'admin-dashboard' && currentPage !== 'display' && (
          <button
            onClick={() => setCurrentPage('display')}
            title="Tampilan Layar Monitor (Fullscreen)"
            className="fixed bottom-8 right-8 bg-[#1A4B9F] hover:bg-[#1A4B9F]/90 text-white w-16 h-16 rounded-full shadow-2xl shadow-blue-900/50 flex items-center justify-center hover:scale-110 transition-all z-50 group"
          >
            <Monitor className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>
    </ToastProvider>
  );
}
