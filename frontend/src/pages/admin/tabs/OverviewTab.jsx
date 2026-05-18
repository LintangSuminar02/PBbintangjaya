import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, CalendarRange, Users, Trophy } from 'lucide-react';

const OverviewTab = ({ bookings = [], courts = [], loading = false }) => {
  // Hard-check for arrays
  const bData = Array.isArray(bookings) ? bookings : [];
  const cData = Array.isArray(courts)   ? courts   : [];

  const stats = [
    {
      label: 'Total Pendapatan',
      val: 'Rp ' + (bData.filter(b => b?.status === 'Confirmed').reduce((acc, b) => acc + (Number(b?.total_price) || 0), 0)).toLocaleString(),
      icon: CreditCard, color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Pesanan Aktif',
      val: String(bData.filter(b => b?.status === 'Pending').length),
      icon: CalendarRange, color: 'bg-emerald-50 text-emerald-600'
    },
    {
      label: 'Lapangan Aktif',
      val: String(cData.filter(c => c?.status === 'Active').length),
      icon: Trophy, color: 'bg-rose-50 text-rose-600'
    },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-zinc-500 text-xs font-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-zinc-800">{loading ? '...' : stat.val}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-50">
          <h3 className="text-xl font-bold text-zinc-800">Antrian Pesanan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8F9FB]">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">WAKTU</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PELANGGAN</th>
                <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {bData.slice(0, 5).map((booking, i) => (
                <tr key={i} className="hover:bg-zinc-50/50">
                  <td className="px-8 py-6 text-xs font-medium text-zinc-400 font-mono">
                    {booking?.created_at ? new Date(booking.created_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-zinc-700">{booking?.customer_full_name || 'Umum'}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      booking?.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {booking?.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {bData.length === 0 && (
                <tr><td colSpan="3" className="px-8 py-10 text-center text-zinc-400 text-sm">Belum ada pesanan masuk.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
