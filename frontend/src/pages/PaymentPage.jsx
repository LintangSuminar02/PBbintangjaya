import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Landmark, Wallet, ArrowRight, User, Phone } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const PaymentPage = ({ selection, setPage, API_URL, currentUser, quickSearch }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: quickSearch?.name || currentUser?.name || currentUser?.username || '',
    phone: '',
    method: 'Bank Transfer'
  });
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!formData.name || !formData.phone) {
      addToast('Mohon lengkapi Nama dan Nomor WhatsApp Anda.', 'error');
      return;
    }
    setLoading(true);
    try {
      // Loop through all selected slots and book each one
      const bookingPromises = selection.all_slots.map(slot => {
        const startTimeStr = slot.time;
        const endTimeStr = `${(parseInt(startTimeStr) + 1).toString().padStart(2, '0')}:00`;
        
        return fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            court_id: slot.court_id,
            booking_date: slot.date,
            start_time: startTimeStr,
            end_time: endTimeStr,
            total_price: slot.price + (slot.price * 0.05),
            payment_method: formData.method,
            customer_phone: formData.phone,
            customer_full_name: formData.name
          })
        }).then(res => res.json());
      });

      const results = await Promise.all(bookingPromises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        addToast(`Pemesanan ${results.length} Slot Berhasil! Menunggu verifikasi pembayaran.`, 'success');
        setPage('my-bookings');
      } else {
        addToast('Beтельные slot gagal dipesan. Silakan cek riwayat Anda.', 'error');
      }
    } catch (err) {
      addToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!selection) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pt-32 pb-20 max-w-6xl mx-auto px-8"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
           <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/40">
              <h3 className="text-xl font-bold text-zinc-800 mb-6">Lapangan Terpilih</h3>
              <div className="rounded-2xl overflow-hidden h-48 mb-6">
                <img src={selection.court_image} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /><span className="font-medium">{selection.court_name}</span></div>
                
                {/* Tampilkan semua jam yang dipilih */}
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sesi Booking ({selection.all_slots.length} Jam)</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-2">
                    {selection.all_slots.map((slot, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm p-2 bg-white rounded-xl border border-zinc-50">
                        <span className="font-bold text-zinc-700">{slot.dayName}, {slot.date}</span>
                        <span className="font-mono text-primary font-black bg-blue-50 px-2 py-0.5 rounded-lg text-xs">
                          {slot.time} - {(parseInt(slot.time)+1).toString().padStart(2,'0')}:00
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-100 space-y-3">
                 <div className="flex justify-between text-sm"><span className="text-zinc-400">Biaya Lapangan</span><span className="font-bold">Rp {selection.price.toLocaleString()}</span></div>
                 <div className="flex justify-between text-sm"><span className="text-zinc-400">Pajak Layanan (5%)</span><span className="font-bold">Rp {(selection.price * 0.05).toLocaleString()}</span></div>
                 <div className="flex justify-between text-lg pt-4"><span className="font-bold text-zinc-800">Total Bayar</span><span className="font-black text-[#1A4B9F]">Rp {(selection.price * 1.05).toLocaleString()}</span></div>
              </div>
           </div>
        </div>

        <div className="flex-1 bg-white p-10 rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/40">
           <h3 className="text-2xl font-bold text-zinc-800 mb-10">Detail Pembayaran</h3>
           <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nama Pemesan</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    placeholder="Contoh: Lintang"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nomor WhatsApp (Aktif)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1 italic">* Admin akan menghubungi melalui nomor ini untuk konfirmasi.</p>
              </div>

              <div className="pt-4 space-y-4">
                 <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Metode Pembayaran</label>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFormData({...formData, method: 'Bank Transfer'})}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                        formData.method === 'Bank Transfer' ? 'bg-blue-50 border-primary shadow-lg shadow-blue-100' : 'bg-white border-zinc-100 opacity-60'
                      }`}
                    >
                      <Landmark className="w-6 h-6 text-primary" />
                      <span className="text-xs font-bold">Transfer Bank</span>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, method: 'E-Wallet'})}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                        formData.method === 'E-Wallet' ? 'bg-blue-50 border-primary shadow-lg shadow-blue-100' : 'bg-white border-zinc-100 opacity-60'
                      }`}
                    >
                      <Wallet className="w-6 h-6 text-primary" />
                      <span className="text-xs font-bold">E-Wallet / QRIS</span>
                    </button>
                 </div>
              </div>

              <button 
                onClick={handlePay}
                disabled={loading}
                className="w-full mt-8 bg-[#1A4B9F] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Memproses...' : (
                  <>
                    Konfirmasi Pembayaran
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
