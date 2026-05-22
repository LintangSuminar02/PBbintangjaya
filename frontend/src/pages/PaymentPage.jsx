import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Calendar, Landmark, Wallet, ArrowRight, User, Phone, Upload, Check, Eye } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Standard QRIS EMVCo CRC16 Generator Helper
const getCRC16 = (str) => {
  let crc = 0xFFFF;
  for (let c = 0; c < str.length; c++) {
    const code = str.charCodeAt(c);
    for (let i = 0; i < 8; i++) {
      const bit = ((code >> (7 - i)) & 1) === 1;
      const c15 = ((crc >> 15) & 1) === 1;
      crc <<= 1;
      if (c15 ^ bit) {
        crc ^= 0x1021;
      }
    }
  }
  crc &= 0xFFFF;
  let hex = crc.toString(16).toUpperCase();
  return hex.padStart(4, '0');
};

const generateQRIS = (baseQRIS, amount) => {
  const idx6304 = baseQRIS.indexOf("6304");
  if (idx6304 === -1) return baseQRIS;
  
  // 1. Slice up to 6304 to exclude the old CRC
  let qrisWithoutCRC = baseQRIS.slice(0, idx6304 + 4);
  
  // 2. Correct the corrupted Tag 53 "9303360" to standard "5303360" (currency) if still present
  qrisWithoutCRC = qrisWithoutCRC.replace("9303360", "5303360");
  
  // 3. Switch Point of Initiation Method from Static (11) to Dynamic (12)
  qrisWithoutCRC = qrisWithoutCRC.replace("010211", "010212");
  
  // 4. Inject Tag 54 (Transaction Amount)
  const currencyTag = "5303360";
  const idxCurrency = qrisWithoutCRC.indexOf(currencyTag);
  if (idxCurrency !== -1) {
    const insertPos = idxCurrency + currencyTag.length;
    const priceStr = Math.round(amount).toString();
    const priceTag = `54${priceStr.length.toString().padStart(2, '0')}${priceStr}`;
    
    // Inject amount tag directly after Tag 53 (currency)
    qrisWithoutCRC = qrisWithoutCRC.slice(0, insertPos) + priceTag + qrisWithoutCRC.slice(insertPos);
  }
  
  // 5. Generate correct CRC16 CCITT
  const crc = getCRC16(qrisWithoutCRC);
  return qrisWithoutCRC + crc;
};

const PaymentPage = ({ selection, setPage, API_URL, currentUser, quickSearch }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: quickSearch?.name || currentUser?.name || currentUser?.username || '',
    phone: '',
    method: 'E-Wallet' // Default to dynamic QRIS
  });
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState('');
  const [proofBase64, setProofBase64] = useState('');
  const [loading, setLoading] = useState(false);

  // User's static QRIS string from partner (corrected)
  const partnerBaseQRIS = "00020101021126580013ID.CO.BRI.WWW01189360000200428541380208428541380303UMI51440014ID.CO.QRIS.WWW0215ID10265166622140303UMI5204781553033605802ID5923HALL BINTANG JAYA SPORT6011PURBALINGGA61055337262070703A0163045F9C";

  // Total bill calculation (no service tax/admin fee as requested by partner)
  const totalAmount = selection ? selection.price : 0;

  // Generate dynamic QRIS string matching total amount
  const dynamicQRIS = generateQRIS(partnerBaseQRIS, totalAmount);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(dynamicQRIS)}`;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('File bukti transfer maksimal berukuran 5 MB.', 'error');
        return;
      }
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setProofBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePay = async () => {
    if (!formData.name || !formData.phone) {
      addToast('Mohon lengkapi Nama dan Nomor WhatsApp Anda.', 'error');
      return;
    }
    if (!proofBase64) {
      addToast('Mohon unggah foto bukti pembayaran terlebih dahulu.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Loop through all selected slots and book each one
      const bookingPromises = selection.all_slots.map(slot => {
        const startTimeStr = `${parseInt(slot.time).toString().padStart(2, '0')}:00`;
        const endTimeStr = `${(parseInt(slot.time) + 1).toString().padStart(2, '0')}:00`;
        
        return fetch(`${API_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            court_id: slot.court_id,
            booking_date: slot.date,
            start_time: startTimeStr,
            end_time: endTimeStr,
            total_price: slot.price,
            payment_method: formData.method,
            customer_phone: formData.phone,
            customer_full_name: formData.name,
            payment_proof_base64: proofBase64
          })
        }).then(res => res.json());
      });

      const results = await Promise.all(bookingPromises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        addToast(`Pemesanan ${results.length} Slot Berhasil Dikonfirmasi!`, 'success');
        setPage('my-bookings');
      } else {
        addToast('Beberapa slot gagal diajukan. Silakan cek riwayat Anda.', 'error');
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

        {/* Right Side: Payment Form & QRIS / Bank Transfer Details */}
        <div className="flex-1 bg-white p-6 sm:p-10 rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/40">
           <h3 className="text-2xl font-bold text-zinc-800 mb-8 sm:mb-10 font-display">Selesaikan Pembayaran</h3>
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

              {/* Dynamic QRIS Box (Direct QRIS Only) */}
              <div className="bg-gradient-to-br from-zinc-50 to-blue-50/20 p-6 rounded-3xl border border-zinc-100 flex flex-col items-center text-center space-y-4">
                <div className="bg-white p-3 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 relative group">
                  <img src={qrCodeUrl} className="w-[220px] h-[220px]" alt="Dynamic QRIS Barcode" />
                  <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <div className="text-center p-4">
                      <Wallet className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                      <span className="text-xs font-black text-zinc-700 block uppercase">QRIS Dinamis</span>
                      <span className="text-[10px] text-zinc-400 mt-1 block">Scan Langsung Terisi Rp {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-primary animate-pulse">
                    GPN QRIS Terverifikasi
                  </span>
                  <h4 className="text-sm font-bold text-zinc-700">HALL BINTANG JAYA SPORT</h4>
                  <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                    Scan kode QR di atas via aplikasi m-banking atau e-wallet (Gopay/OVO/DANA/ShopeePay). Tagihan otomatis muncul sebesar **Rp {totalAmount.toLocaleString()}**.
                  </p>
                </div>
              </div>

              {/* Upload Proof Card */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Unggah Bukti Pembayaran</label>
                <div className="border-2 border-dashed border-zinc-200 hover:border-primary rounded-3xl p-6 bg-zinc-50/30 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {proofPreview ? (
                    <div className="space-y-3 w-full">
                      <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-zinc-200 shadow-md">
                        <img src={proofPreview} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-zinc-700 block truncate">{proofFile?.name}</span>
                        <span className="text-[10px] text-zinc-400">{(proofFile?.size / 1024 / 1024).toFixed(2)} MB • Klik untuk ganti foto</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-zinc-700 block">Pilih / Seret Foto Bukti Transfer</span>
                        <span className="text-[10px] text-zinc-400 mt-1 block">Format JPG, PNG (Maksimal 5 MB)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Booking Button */}
              <button 
                onClick={handlePay}
                disabled={loading || !proofBase64}
                className="w-full mt-6 bg-[#1A4B9F] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Mengirim Data...' : (
                  <>
                    {!proofBase64 ? 'Unggah Bukti Pembayaran Dahulu' : 'Kirim & Ajukan Pemesanan'}
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
