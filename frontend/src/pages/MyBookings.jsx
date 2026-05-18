import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarRange, History, Search, CheckCircle, Clock, XCircle, User } from 'lucide-react';

const STATUS_CONFIG = {
  Confirmed: { label: 'Terkonfirmasi', icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Pending:   { label: 'Menunggu',      icon: Clock,        bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-400'   },
  Rejected:  { label: 'Ditolak',       icon: XCircle,      bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200',    dot: 'bg-rose-400'    },
};

const MyBookings = ({ API_URL }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/bookings`);
        setBookings(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, [API_URL]);

  const filtered = bookings.filter(b => {
    const name  = (b.customer_full_name || b.customer_name || '').toLowerCase();
    const court = (b.court_name || '').toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || court.includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="pt-24 sm:pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-primary mb-2">Riwayat Pemesanan</h1>
        <p className="text-zinc-500 text-sm font-medium">Seluruh data pemesanan lapangan</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari nama pemesan atau lapangan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'Confirmed', 'Pending', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
                filterStatus === s
                  ? 'bg-[#1A4B9F] text-white border-[#1A4B9F] shadow-lg shadow-blue-200'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {s === 'all' ? 'Semua' : STATUS_CONFIG[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-zinc-400">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium">Memuat riwayat pemesanan...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
          <History className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
          <p className="text-sm text-zinc-400">Tidak ada pesanan ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b, i) => {
            const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.Pending;
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`bg-white rounded-2xl border ${cfg.border} shadow-sm hover:shadow-md transition-all overflow-hidden flex`}
              >
                {/* Status bar */}
                <div className={`w-1.5 flex-shrink-0 ${cfg.dot}`} />

                <div className="flex-1 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                      <CalendarRange className={`w-4 h-4 ${cfg.text}`} />
                    </div>

                    {/* Info utama: nama & jadwal */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <User className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                        <p className="font-bold text-zinc-800 text-sm truncate">
                          {b.customer_full_name || b.customer_name || 'Tamu'}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-primary">{b.court_name || `Lapangan ${b.court_id}`}</p>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        {b.booking_date} &nbsp;·&nbsp; {b.start_time?.slice(0,5)} – {b.end_time?.slice(0,5)}
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${cfg.bg} border ${cfg.border} w-fit sm:flex-shrink-0`}>
                    <StatusIcon className={`w-3 h-3 ${cfg.text}`} />
                    <span className={`text-[10px] font-black uppercase tracking-wider ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-center text-xs text-zinc-400 font-medium mt-8">
          Menampilkan {filtered.length} dari {bookings.length} pesanan
        </p>
      )}
    </div>
  );
};

export default MyBookings;
