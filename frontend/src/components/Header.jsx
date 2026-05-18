import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Clock, CheckCircle, Calendar, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Header = ({ currentPage, setPage, API_URL }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`${API_URL}/bookings`);
        const data = await res.json();
        // Ambil 5 pesanan terkonfirmasi terbaru
        const confirmed = data
          .filter(b => b.status === 'Confirmed')
          .sort((a, b) => b.id - a.id)
          .slice(0, 5);
        
        if (recentActivities.length > 0 && confirmed.length > 0 && confirmed[0].id !== recentActivities[0].id) {
          setHasNew(true);
        }
        setRecentActivities(confirmed);
      } catch (err) { console.error(err); }
    };

    fetchActivities();
    const iv = setInterval(fetchActivities, 15000);
    return () => clearInterval(iv);
  }, [API_URL, recentActivities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (currentPage === 'admin-dashboard') return null;

  return (
    <header className="bg-white border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-8 h-20 fixed top-0 z-50">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setPage('explore')}>
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
          <span className="font-display text-lg md:text-2xl font-bold text-primary">PB Bintang Jaya</span>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <button 
            onClick={() => setPage('explore')}
            className={`font-medium transition-colors ${currentPage === 'explore' ? 'text-primary border-b-2 border-primary pb-1' : 'text-outline hover:text-primary'}`}
          >
            Eksplor
          </button>
          <button 
            onClick={() => setPage('schedule')}
            className={`font-medium transition-colors ${currentPage === 'schedule' ? 'text-primary border-b-2 border-primary pb-1' : 'text-outline hover:text-primary'}`}
          >
            Jadwal
          </button>
          <button 
            onClick={() => setPage('my-bookings')}
            className={`font-medium transition-colors ${currentPage === 'my-bookings' ? 'text-primary border-b-2 border-primary pb-1' : 'text-outline hover:text-primary'}`}
          >
            Pesanan Saya
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-zinc-50 rounded-full px-6 py-2 border border-zinc-200">
          <Search className="w-5 h-5 text-zinc-400" />
          <input className="bg-transparent border-none focus:ring-0 text-sm w-48 ml-3 outline-none font-medium" placeholder="Cari lapangan..." type="text"/>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasNew(false);
            }}
            className="p-2.5 rounded-full hover:bg-zinc-100 transition-all relative group"
          >
            <Bell className={`w-6 h-6 ${hasNew ? 'text-primary animate-bounce' : 'text-zinc-400 group-hover:text-primary'}`} />
            {hasNew && <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-[320px] bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden z-[60]"
              >
                <div className="p-5 border-b border-zinc-50 bg-[#1A4B9F]/5">
                  <h4 className="font-bold text-[#1A4B9F] flex items-center gap-2 text-sm">
                    <Bell className="w-4 h-4" /> Aktivitas Terbaru
                  </h4>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {recentActivities.length === 0 ? (
                    <div className="p-10 text-center text-zinc-400">
                      <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      <p className="text-xs font-medium">Belum ada aktivitas terbaru</p>
                    </div>
                  ) : (
                    recentActivities.map((act) => (
                      <div key={act.id} className="p-4 border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-default">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-800 line-clamp-1">{act.customer_full_name} baru saja booking!</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400 font-bold">
                              <span className="text-[#1A4B9F]">{act.court_name}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {act.booking_date}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 bg-zinc-50 text-center">
                  <button onClick={() => {setPage('schedule'); setShowNotifications(false);}} className="text-[10px] font-black uppercase tracking-widest text-[#1A4B9F] hover:underline">
                    Lihat Semua Jadwal
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden cursor-pointer shadow-lg shadow-blue-900/10 active:scale-95 transition-all" onClick={() => setPage('admin-dashboard')}>
          <img alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEZw5EISOdOpPdN12KRdGtn_XgICqY13ENWvvv3VpmKBUE0Y_k6q9a75aMD088FWO2oWeE27-V8O2HXD7S0oAvwFgi7IQoTPH1MqLBLEZ2RY_auiSbUjQr8rGd8AulKd8JxzqPagNnyujRXoGHySYzpWiu0VbmF0sP-A_apBNPYX1ltuAJ5V4WtxKIqZNHUBGYOQPoXrXAkHWnckka30NHck87h7_X5KE41fz_dF1Woiwb7nr9Czu9a8XcdHtEK3q99iYZz7R_OEnE" className="w-full h-full object-cover" />
        </div>

        {/* Hamburger Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2.5 rounded-full hover:bg-zinc-100 transition-all text-zinc-400 hover:text-primary md:hidden active:scale-95"
          title="Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full bg-white border-b border-outline-variant shadow-xl z-40 px-8 py-6 flex flex-col gap-4 md:hidden"
          >
            <button 
              onClick={() => { setPage('explore'); setIsMobileMenuOpen(false); }}
              className={`font-semibold text-left py-2.5 border-b border-zinc-50 ${currentPage === 'explore' ? 'text-primary' : 'text-zinc-600 hover:text-primary'}`}
            >
              Eksplor
            </button>
            <button 
              onClick={() => { setPage('schedule'); setIsMobileMenuOpen(false); }}
              className={`font-semibold text-left py-2.5 border-b border-zinc-50 ${currentPage === 'schedule' ? 'text-primary' : 'text-zinc-600 hover:text-primary'}`}
            >
              Jadwal
            </button>
            <button 
              onClick={() => { setPage('my-bookings'); setIsMobileMenuOpen(false); }}
              className={`font-semibold text-left py-2.5 border-b border-zinc-50 ${currentPage === 'my-bookings' ? 'text-primary' : 'text-zinc-600 hover:text-primary'}`}
            >
              Pesanan Saya
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
