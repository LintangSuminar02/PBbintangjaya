import React from 'react';
import { CheckCircle, XCircle, CreditCard, Phone, MessageSquare } from 'lucide-react';

const BookingsTab = ({ bookings, onConfirm, onReject, onTogglePayment }) => {
  const openWA = (phone) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    window.open(`https://wa.me/${waPhone}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A4B9F] mb-1">Manajemen Pesanan</h1>
          <p className="text-zinc-500 text-sm font-medium">
            Sistem FCFS Aktif: Urutan pertama (paling bawah di antrian masuk) diprioritaskan.
          </p>
        </div>
        <div className="flex gap-4 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm flex-wrap text-[10px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"/> Confirmed</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/> Pending</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block"/> Rejected</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F8F9FB] border-b border-zinc-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Urutan</th>
              <th className="px-4 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pelanggan</th>
              <th className="px-4 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">WhatsApp</th>
              <th className="px-4 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Waktu / Court</th>
              <th className="px-4 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pembayaran</th>
              <th className="px-4 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {bookings.map((row, i) => {
              const isFcfsFirst = row.status === 'Pending' &&
                [...bookings]
                  .filter(b => b.court_id === row.court_id && b.start_time === row.start_time && b.status === 'Pending')
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0]?.id === row.id;

              return (
                <tr key={row.id} className={`transition-all group ${
                  row.status === 'Rejected' ? 'opacity-40' :
                  isFcfsFirst ? 'bg-emerald-50/30 border-l-4 border-l-emerald-400' :
                  'hover:bg-zinc-50/50'
                }`}>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-black text-[#1A4B9F]">#{i + 1}</span>
                      {isFcfsFirst && (
                        <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full w-fit whitespace-nowrap">
                          ⚡ FCFS #1
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <p className="font-bold text-zinc-800 text-sm leading-none mb-1">{row.customer_full_name || row.customer_name}</p>
                    <div className="flex items-center gap-1">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        row.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                        row.status === 'Rejected'  ? 'bg-rose-50 text-rose-500' :
                                                     'bg-amber-50 text-amber-600'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <button 
                      onClick={() => openWA(row.customer_phone)}
                      className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all group/wa"
                    >
                      <MessageSquare className="w-3.5 h-3.5 group-hover/wa:scale-110 transition-transform" />
                      <span className="text-[11px] font-bold font-mono">{row.customer_phone || '-'}</span>
                    </button>
                  </td>
                  <td className="px-4 py-5">
                    <p className="font-bold text-zinc-800 text-sm">{row.court_name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      {row.start_time?.slice(0,5)} – {row.end_time?.slice(0,5)} | {row.booking_date}
                    </p>
                  </td>
                  <td className="px-4 py-5">
                    <p className="font-bold text-[#1A4B9F] text-sm">Rp {row.total_price?.toLocaleString() || '0'}</p>
                    <button
                      onClick={() => onTogglePayment(row.id, row.payment_status === 'Paid' ? 'Unpaid' : 'Paid')}
                      className={`flex items-center gap-1.5 mt-1 text-[9px] font-black uppercase transition-all ${
                        row.payment_status === 'Paid' ? 'text-emerald-500' : 'text-zinc-300 hover:text-amber-500'
                      }`}
                    >
                      <CreditCard className="w-3 h-3" />
                      {row.payment_status === 'Paid' ? 'LUNAS' : 'BELUM BAYAR'}
                    </button>
                  </td>

                  <td className="px-4 py-5 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all">
                      {row.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onConfirm(row.id)}
                            className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-200 hover:scale-110 active:scale-95 transition-all"
                            title="Konfirmasi"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onReject(row.id)}
                            className="bg-rose-50 text-rose-500 border border-rose-100 p-2 rounded-xl hover:scale-110 active:scale-95 transition-all"
                            title="Tolak"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {row.status === 'Confirmed' && (
                        <button
                          onClick={() => onReject(row.id)}
                          className="text-zinc-300 hover:text-rose-500 transition-all"
                          title="Batalkan"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="p-20 text-center text-zinc-300 font-bold">Belum ada pesanan masuk.</div>
        )}
      </div>
    </div>
  );
};

export default BookingsTab;
