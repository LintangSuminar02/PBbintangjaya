import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Landmark, Wallet, ArrowRight, User, Phone, Check, CreditCard, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const PaymentPage = ({ selection, setPage, API_URL, currentUser, quickSearch }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: quickSearch?.name || currentUser?.name || currentUser?.username || '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [bookedData, setBookedData] = useState(null);

  const totalAmount = selection ? selection.price : 0;

  // Pastikan script snap sudah ter-load
  useEffect(() => {
    // Memeriksa jika script snap belum ada di window (hanya untuk berjaga-jaga)
    if (!window.snap) {
      console.warn("Midtrans Snap script is not loaded correctly from index.html.");
    }
  }, []);

  const handlePay = async () => {
    if (!formData.name || !formData.phone) {
      addToast('Mohon lengkapi Nama dan Nomor WhatsApp Anda.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Panggil backend untuk membuat transaksi Snap
      const res = await fetch(`${API_URL}/payment/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser?.id || null,
          slots: selection.all_slots,
          total_price: totalAmount,
          customer_phone: formData.phone,
          customer_full_name: formData.name,
          court_name: selection.court_name
        })
      });

      const data = await res.json();

      if (data.success && data.token) {
        // Panggil Snap UI Midtrans
        window.snap.pay(data.token, {
          onSuccess: function (result) {
            addToast('Pembayaran Berhasil Dikonfirmasi!', 'success');
            setBookedData({
              name: formData.name,
              phone: formData.phone,
              court_name: selection.court_name,
              total_price: totalAmount,
              method: 'Midtrans Online Payment',
              slots: selection.all_slots,
              order_id: data.order_id
            });
          },
          onPending: function (result) {
            addToast('Menunggu Pembayaran. Silakan selesaikan pembayaran Anda.', 'info');
            setPage('my-bookings');
          },
          onError: function (result) {
            addToast('Pembayaran Gagal.', 'error');
          },
          onClose: function () {
            addToast('Anda menutup popup pembayaran tanpa menyelesaikannya.', 'error');
            setPage('my-bookings');
          }
        });
      } else {
        addToast(data.message || 'Gagal memproses pembayaran (slot mungkin sudah dipesan).', 'error');
      }
    } catch (err) {
      addToast('Terjadi kesalahan koneksi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (bookedData) {
    const adminPhone = "6287786722209";
    const slotsText = bookedData.slots.map(s => `  * ${s.dayName}, ${s.date} (${s.time})`).join('\n');
    const message = `Halo Admin Hall Bintang Jaya Sport, saya baru saja melakukan pemesanan lapangan dan pembayaran telah berhasil.\n\n👤 *Nama*: ${bookedData.name}\n📞 *WA*: ${bookedData.phone}\n🏸 *Lapangan*: ${bookedData.court_name}\n💳 *Metode*: ${bookedData.method}\n🆔 *Order ID*: ${bookedData.order_id}\n💰 *Total*: Rp ${bookedData.total_price.toLocaleString()}\n\n📅 *Jadwal Terpilih*:\n${slotsText}\n\nPesanan saya sudah otomatis terkonfirmasi di sistem. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pt-24 sm:pt-32 pb-20 max-w-2xl mx-auto px-4 text-center font-sans"
      >
        <div className="bg-white p-8 sm:p-12 rounded-[32px] border border-zinc-100 shadow-2xl shadow-zinc-200/50 space-y-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-emerald-100">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-zinc-800 font-display">Pemesanan Berhasil!</h2>
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Pembayaran Terverifikasi (Otomatis Terkonfirmasi)
            </p>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Jadwal Anda sudah aman dan otomatis terkonfirmasi oleh sistem karena pembayaran dilakukan secara online.
            </p>
          </div>

          <div className="bg-zinc-50 rounded-2xl border border-zinc-100 p-6 text-left space-y-4">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/60">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">Pemesan</span>
              <span className="font-extrabold text-zinc-700">{bookedData.name} ({bookedData.phone})</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/60">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">Lapangan</span>
              <span className="font-extrabold text-zinc-700">{bookedData.court_name}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/60">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">Metode</span>
              <span className="font-extrabold text-[#1A4B9F] bg-blue-50 px-2 py-0.5 rounded-md">{bookedData.method}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-200/60">
              <span className="text-zinc-400 font-bold uppercase tracking-wider">Total Tagihan</span>
              <span className="font-black text-rose-500 text-sm">Rp {bookedData.total_price.toLocaleString()}</span>
            </div>
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Jadwal Sesi:</span>
              <div className="max-h-28 overflow-y-auto space-y-1">
                {bookedData.slots.map((s, idx) => (
                  <div key={idx} className="text-xs bg-white border border-zinc-100/50 p-2 rounded-xl flex justify-between font-medium text-zinc-600">
                    <span>{s.dayName}, {s.date}</span>
                    <span className="font-bold text-primary">{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a 
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-emerald-700"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.791-4.382 9.794-9.789.002-2.618-1.018-5.08-2.873-6.936C16.337 2.023 13.882 1.002 11.997 1c-5.41.004-9.801 4.394-9.805 9.801-.001 1.568.413 3.107 1.2 4.478l-.989 3.61 3.733-.979c1.332.727 2.766 1.045 3.911 1.045z" /></svg>
              Kirim ke WhatsApp Admin
            </a>
            <button 
              onClick={() => setPage('my-bookings')}
              className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-4 px-6 rounded-2xl font-bold text-sm transition-all"
            >
              Lihat Riwayat Pesanan
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!selection) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pt-24 sm:pt-32 pb-20 max-w-6xl mx-auto px-4 sm:px-8"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side: Summary of Booking */}
        <div className="flex-1 space-y-8">
           <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/40">
              <h3 className="text-xl font-bold text-zinc-800 mb-6 font-display">Lapangan Terpilih</h3>
              <div className="rounded-2xl overflow-hidden h-48 mb-6 relative">
                <img src={selection.court_image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <span className="text-white font-bold text-lg">{selection.court_name}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /><span className="font-medium text-zinc-600">{selection.court_location || 'HALL BINTANG JAYA SPORT'}</span></div>
                
                {/* Booked Sessions */}
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Sesi Booking ({selection.all_slots.length} Jam)</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-2">
                    {selection.all_slots.map((slot, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm p-2 bg-white rounded-xl border border-zinc-50 hover:border-blue-100 transition-all">
                        <span className="font-bold text-zinc-700">{slot.dayName}, {slot.date}</span>
                        <span className="font-mono text-primary font-black bg-blue-50 px-2 py-0.5 rounded-lg text-xs">
                          {slot.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-100 space-y-3">
                 <div className="flex justify-between text-sm"><span className="text-zinc-400 font-medium">Biaya Lapangan</span><span className="font-bold text-zinc-700">Rp {selection.price.toLocaleString()}</span></div>
                 <div className="flex justify-between text-lg pt-4 border-t border-dashed border-zinc-100"><span className="font-black text-zinc-800">Total Tagihan</span><span className="font-black text-[#1A4B9F] text-xl">Rp {totalAmount.toLocaleString()}</span></div>
              </div>
           </div>
        </div>

        {/* Right Side: Payment Form & Midtrans Gateway */}
        <div className="flex-1 bg-white p-6 sm:p-10 rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/40">
           <h3 className="text-2xl font-bold text-zinc-800 mb-8 sm:mb-10 font-display">Detail Pemesan</h3>
           <div className="space-y-6">
              
              {/* Form Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nama Pemesan</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                      placeholder="Contoh: Lintang"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-zinc-50 to-blue-50/20 p-6 rounded-3xl border border-zinc-100 flex flex-col items-center text-center space-y-4">
                <div className="bg-white p-6 w-full rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-[#1A4B9F] rounded-xl">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black block mb-1">Gateway Pembayaran</span>
                    <span className="text-lg font-black text-zinc-800 tracking-wider">Midtrans Terintegrasi</span>
                    <span className="text-xs font-bold text-zinc-600 block mt-1">Otomatis Terverifikasi</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                  Setelah menekan tombol di bawah, Anda akan diarahkan ke sistem pembayaran aman Midtrans untuk memilih metode (QRIS, VA, E-Wallet).
                </p>
              </div>

              {/* Confirm Booking Button */}
              <button 
                onClick={handlePay}
                disabled={loading || !formData.name || !formData.phone}
                className="w-full mt-6 bg-[#1A4B9F] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyiapkan Pembayaran...' : (
                  <>
                    Lanjutkan ke Pembayaran Online
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
