import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, Calendar, Verified, Bolt, Users, ArrowRight, Star, X, ChevronDown, 
  ChevronLeft, ChevronRight, MapPin, Footprints, Sparkles, Trophy, 
  MessageSquareX, Droplet, Trash2, CigaretteOff, Clock 
} from 'lucide-react';

const LandingPage = ({ setPage, courts, setQuickSearch, setTargetCourtId }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    setQuickSearch({ name, date });
    setPage('schedule');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-hero-pattern">
        <div className="max-w-4xl px-8 text-center text-white z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6 drop-shadow-lg leading-tight text-white"
          >
            Tingkatkan Permainan Anda dengan Pemesanan Presisi
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg mb-10 max-w-2xl mx-auto drop-shadow-md text-white"
          >
            Akses lapangan bulu tangkis premium di Purbalingga. Ketersediaan instan, penjadwalan mulus, dan fasilitas kelas turnamen di ujung jari Anda.
          </motion.p>
          
          {/* Search Bar / Quick Access */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-1 max-w-3xl mx-auto border-2 border-primary-container"
          >
            <div className="flex items-center flex-1 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-zinc-100">
              <User className="w-5 h-5 text-primary mr-3" />
              <input 
                className="w-full border-none focus:ring-0 text-zinc-800 font-medium bg-transparent outline-none" 
                placeholder="Nama Pemesan" 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex items-center flex-1 px-6 py-4 w-full">
              <Calendar className="w-5 h-5 text-primary mr-3" />
              <input 
                className="w-full border-none focus:ring-0 text-zinc-800 font-medium bg-transparent outline-none appearance-none" 
                placeholder="Pilih Tanggal" 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-primary hover:bg-primary-container text-white font-bold px-10 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 w-full md:w-auto uppercase tracking-wider"
            >
              Cari Lapangan
            </button>
          </motion.div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-zinc-50 py-8 border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-center gap-16">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Verified className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-[#1A4B9F] text-xs uppercase tracking-wider">KARPET SINTETIS PRO</p>
              <p className="text-sm text-outline">Standar turnamen BWF</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Bolt className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-[#1A4B9F] text-xs uppercase tracking-wider">BOOKING INSTAN</p>
              <p className="text-sm text-outline">Tanpa wajib login</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <Users className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-[#1A4B9F] text-xs uppercase tracking-wider">FASILITAS NYAMAN</p>
              <p className="text-sm text-outline">Kantin, Toilet, & Parkir</p>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Courts */}
      <section className="py-20 max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl text-zinc-900 mb-2 font-bold">Lapangan Elit Unggulan</h2>
            <p className="text-outline">Fasilitas berperingkat teratas untuk permainan kompetitif dan rekreasi.</p>
          </div>
          <button onClick={() => setPage('schedule')} className="text-primary font-bold flex items-center gap-2 hover:underline group">
            Lihat Semua Lapangan <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courts.map((court, i) => (
            <motion.div 
              key={court.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="h-48 relative overflow-hidden">
                <img src={court.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={court.name} />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-primary" /> 4.9
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-zinc-900 mb-1">{court.name}</h3>
                <div className="flex items-center text-xs text-outline mb-4">
                  <MapPin className="w-3 h-3 mr-1" /> {court.location}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-50">
                  <div>
                    <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Mulai dari</p>
                    <p className="font-bold text-primary">Rp {court.price?.toLocaleString()}/Jam</p>
                  </div>
                  <button onClick={() => { setTargetCourtId(court.id); setPage('schedule'); }} className="bg-primary-container/20 text-primary p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-[#1A4B9F] uppercase tracking-[0.3em] mb-3">Ketentuan & Etika</h2>
            <h3 className="text-4xl font-bold text-zinc-900">Tata Tertib Hall</h3>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto text-sm font-medium">Mohon dipatuhi demi kenyamanan dan keamanan bersama selama berada di area PB Bintang Jaya.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'Footprints', title: 'Alas Kaki', desc: 'Harap melepas alas kaki di pintu masuk hall.', color: 'text-zinc-600', bg: 'bg-white' },
              { icon: 'Sparkles', title: 'Kebersihan', desc: 'Wajib menjaga kebersihan di seluruh area hall.', color: 'text-amber-500', bg: 'bg-white' },
              { icon: 'Trophy', title: 'Sportifitas', desc: 'Menjunjung tinggi nilai sportifitas saat bermain.', color: 'text-blue-500', bg: 'bg-white' },
              { icon: 'MessageSquareX', title: 'Tutur Kata', desc: 'Dilarang berkata kasar atau jorok saat bermain.', color: 'text-emerald-500', bg: 'bg-white' },
              { icon: 'Droplet', title: 'Larangan Meludah', desc: 'Dilarang keras meludah di area lapangan.', color: 'text-rose-500', bg: 'bg-white' },
              { icon: 'Trash2', title: 'Buang Sampah', desc: 'Buanglah sampah pada tempat yang disediakan.', color: 'text-blue-600', bg: 'bg-white' },
              { icon: 'CigaretteOff', title: 'Bebas Rokok', desc: 'Dilarang merokok saat lapangan penuh / turnamen.', color: 'text-orange-600', bg: 'bg-white' },
              { icon: 'Clock', title: 'Tepat Waktu', desc: 'Hadir tepat waktu sesuai jadwal yang disepakati.', color: 'text-zinc-800', bg: 'bg-white' },
            ].map((rule, i) => {
              const Icon = { 
                Footprints: Footprints, 
                Sparkles: Sparkles, 
                Trophy: Trophy, 
                MessageSquareX: MessageSquareX, 
                Droplet: Droplet, 
                Trash2: Trash2, 
                CigaretteOff: CigaretteOff, 
                Clock: Clock 
              }[rule.icon];

              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`${rule.bg} p-8 rounded-[32px] border border-zinc-100/50 hover:border-primary/20 hover:shadow-xl hover:shadow-blue-900/5 transition-all group`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-zinc-50 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${rule.color}`} />
                  </div>
                  <h4 className="font-bold text-zinc-900 mb-2">{rule.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">{rule.desc}</p>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-16 p-8 bg-white rounded-[32px] border border-zinc-100 text-center shadow-sm">
            <p className="text-sm font-bold text-[#1A4B9F]">Terima kasih atas kerja sama dan kepatuhan Anda terhadap aturan kami.</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
