import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarRange,
  CreditCard,
  Trophy,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Bell,
  ShieldCheck,
  Menu,
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

// --- Tab Components ---
import OverviewTab        from './tabs/OverviewTab';
import ScheduleTab        from './tabs/ScheduleTab';
import BookingsTab        from './tabs/BookingsTab';
import CourtsTab          from './tabs/CourtsTab';
import SettingsTab        from './tabs/SettingsTab';
import MemberScheduleTab  from './tabs/MemberScheduleTab';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Helper: Ambil tanggal Senin-Minggu (Bebas Timezone)
function getWeekDates(offset = 0) {
  const dates = [];
  const now = new Date();
  now.setHours(12, 0, 0, 0); 
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff + (offset * 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}


// ─────────────────────────────────────────────────
// Sidebar navigation config
// ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',  label: 'Ringkasan',           icon: LayoutDashboard },
  { id: 'schedule',  label: 'Jadwal Lapangan',      icon: CalendarRange   },
  { id: 'bookings',  label: 'Kelola Pesanan',       icon: CreditCard      },
  { id: 'members',   label: 'Jadwal Member PB',     icon: ShieldCheck     },
  { id: 'courts',    label: 'Manajemen Lapangan',   icon: Trophy          },
];

const TAB_TITLES = {
  overview: 'Ringkasan Dasbor',
  schedule: 'Jadwal Real-time',
  bookings: 'Kelola Pesanan',
  members:  'Jadwal Tetap Member PB',
  courts:   'Manajemen Lapangan',
  settings: 'Pengaturan Sistem',
};

// ─────────────────────────────────────────────────
// Main AdminDashboard — state & data orchestrator
// ─────────────────────────────────────────────────
const AdminDashboard = ({ onLogout, API_URL }) => {
  const { addToast } = useToast();
  const [activeTab,    setActiveTab]    = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bookings,     setBookings]     = useState([]);
  const [courts,       setCourts]       = useState([]);
  const [settings,     setSettings]     = useState({});
  const [memberSchedules, setMemberSchedules] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [editingCourt, setEditingCourt] = useState(null);
  const [weekOffset,   setWeekOffset]   = useState(0);
  const [searchTerm,   setSearchTerm]   = useState('');

  const weekDates = getWeekDates(weekOffset);


  // ── Data fetching ──────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resB, resC, resS, resM] = await Promise.all([
        fetch(`${API_URL}/bookings`),
        fetch(`${API_URL}/courts`),
        fetch(`${API_URL}/settings`),
        fetch(`${API_URL}/member-schedules`),
      ]);
      const bData = await resB.json();
      const cData = await resC.json();
      const sData = await resS.json();
      const mData = await resM.json();
      setBookings(Array.isArray(bData) ? bData : []);
      setCourts(Array.isArray(cData) ? cData : []);
      setSettings(sData && !sData.error ? sData : {});
      setMemberSchedules(Array.isArray(mData) ? mData : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Listen for realtime updates
  useEffect(() => {
    fetchData();
    
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'member_schedules' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courts' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  // Refresh immediately on tab switch to data-heavy tabs
  useEffect(() => {
    if (['schedule', 'bookings', 'overview', 'members'].includes(activeTab)) fetchData();
  }, [activeTab]);

  // ── Handlers ───────────────────────────────────
  const handleConfirm = async (id) => {
    const res = await fetch(`${API_URL}/bookings/${id}/confirm`, { method: 'PATCH' });
    const data = await res.json();
    if (data.success) {
      addToast('Pesanan berhasil dikonfirmasi!', 'success');
      fetchData();
    } else {
      addToast(data.message || 'Gagal konfirmasi', 'error');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Tolak pesanan ini?')) return;
    await fetch(`${API_URL}/bookings/${id}/reject`, { method: 'PATCH' });
    fetchData();
  };

  const handleTogglePayment = async (id, newStatus) => {
    await fetch(`${API_URL}/bookings/${id}/payment`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ payment_status: newStatus }),
    });
    fetchData();
  };

  const handleUpdateCourt = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/courts/${editingCourt.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(editingCourt),
    });
    const data = await res.json();
    if (data.success) {
      addToast('Data lapangan berhasil diperbarui', 'success');
      setEditingCourt(null);
      fetchData();
    } else {
      addToast('Gagal memperbarui lapangan: ' + (data.message || data.error), 'error');
    }
  };

  const handleAddCourt = async (courtData) => {
    const res = await fetch(`${API_URL}/courts`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(courtData),
    });
    const data = await res.json();
    if (data.success) {
      addToast('Lapangan baru berhasil ditambahkan', 'success');
      fetchData();
    } else {
      addToast('Gagal menambah lapangan: ' + (data.message || data.error), 'error');
    }
  };

  const handleDeleteCourt = async (id) => {
    const res = await fetch(`${API_URL}/courts/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      addToast('Lapangan berhasil dihapus', 'success');
      fetchData();
    } else {
      addToast(data.message || 'Gagal menghapus lapangan.', 'error');
    }
  };

  // ── Filtered Data (Memoized for performance) ─────────────────
  const filteredCourts = React.useMemo(() => {
    return courts.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courts, searchTerm]);

  const filteredBookings = React.useMemo(() => {
    return bookings.filter(b => 
      b.customer_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.court_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toString().includes(searchTerm)
    );
  }, [bookings, searchTerm]);

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;



  // ── Render ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">

      {/* Sidebar Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────── */}
      <aside 
        className={`w-64 bg-white border-r border-zinc-200 flex flex-col fixed h-full z-40 transition-transform duration-300 lg:translate-x-0 lg:flex ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A4B9F] flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span style="font-size: 20px">🏸</span>';
                  }}
                />
              </div>
              <h1 className="text-2xl font-bold text-[#1A4B9F]">HALL BINTANG JAYA SPORT</h1>
            </div>
          </div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Real-time DB
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === id ? 'bg-[#1A4B9F] text-white' : 'text-zinc-500 hover:bg-zinc-50'
              }`}
            >
              <Icon className="w-5 h-5" /> {label}
            </button>
          ))}

          <div className="pt-8 pb-2">
            <p className="px-4 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Administrasi</p>
          </div>
          <button
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'settings' ? 'bg-[#1A4B9F] text-white' : 'text-zinc-500 hover:bg-zinc-50'
            }`}
          >
            <SettingsIcon className="w-5 h-5" /> Pengaturan
          </button>
          <button
            onClick={() => { onLogout(); setIsSidebarOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-rose-500 hover:bg-rose-50"
          >
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </nav>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full overflow-hidden">

        {/* Top bar */}
        <header className="h-20 bg-[#F8F9FB] flex items-center justify-between px-4 sm:px-8 md:px-10 sticky top-0 z-20 border-b border-zinc-100 gap-4">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            {/* Hamburger Button for Mobile/Tablet */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-[#1A4B9F] transition-all active:scale-95 flex-shrink-0"
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm sm:text-lg md:text-xl font-bold text-zinc-800 truncate">{TAB_TITLES[activeTab]}</h2>
            
            {activeTab === 'schedule' && (
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-100 shadow-sm ml-1 sm:ml-4 scale-75 sm:scale-90 flex-shrink-0">
                <button onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))} className="p-1 rounded-lg hover:bg-zinc-50 text-zinc-500"><ChevronLeft className="w-4 h-4"/></button>
                <div className="px-1.5 sm:px-3 font-bold text-[9px] sm:text-[11px] text-zinc-500 uppercase tracking-widest whitespace-nowrap">W-{weekOffset + 1}</div>
                <button onClick={() => setWeekOffset(prev => Math.min(4, prev + 1))} className="p-1 rounded-lg hover:bg-zinc-50 text-zinc-500"><ChevronRight className="w-4 h-4"/></button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'courts' ? 'Cari...' : activeTab === 'bookings' ? 'Cari...' : 'Cari...'}
                className="bg-white border border-zinc-200 rounded-lg py-2 pl-9 pr-2 text-xs w-28 sm:w-48 md:w-64 outline-none focus:ring-1 focus:ring-[#1A4B9F] transition-all"
              />
            </div>
            <button 
              className="relative p-2 text-zinc-400 hover:text-[#1A4B9F] transition-colors"
              title="Notifikasi"
              onClick={() => setActiveTab('bookings')}
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </header>

        {/* Tab content */}
        <div className="p-4 sm:p-6 md:p-10 space-y-6 md:space-y-10">
          {activeTab === 'overview' && (
            <OverviewTab bookings={bookings} courts={courts} loading={loading} />
          )}
          {activeTab === 'schedule' && (
            <ScheduleTab 
              courts={courts} 
              bookings={bookings} 
              memberSchedules={memberSchedules} 
              weekDates={weekDates} 
              weekOffset={weekOffset} 
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={filteredBookings}
              onConfirm={handleConfirm}
              onReject={handleReject}
              onTogglePayment={handleTogglePayment}
              API_URL={API_URL}
            />
          )}
          {activeTab === 'members' && (
            <MemberScheduleTab courts={courts} API_URL={API_URL} />
          )}
          {activeTab === 'courts' && (
            <CourtsTab
              courts={filteredCourts}
              editingCourt={editingCourt}
              setEditingCourt={setEditingCourt}
              onUpdateCourt={handleUpdateCourt}
              onAddCourt={handleAddCourt}
              onDeleteCourt={handleDeleteCourt}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab settings={settings} API_URL={API_URL} onSaved={fetchData} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
