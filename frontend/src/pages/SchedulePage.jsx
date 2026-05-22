import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarRange, ChevronLeft, ChevronRight, Calendar, X, Clock, MapPin } from 'lucide-react';

const DAY_NAMES = ['SENIN','SELASA','RABU','KAMIS',"JUM'AT",'SABTU','MINGGU'];
const HOURS = ['07.00-08.00', '08.00-09.00', '09.00-10.00', '10.00-11.00', '11.00-12.00', '12.00-13.00', '13.00-14.00', '14.00-15.00', '15.00-16.00', '16.00-17.00', '17.00-18.00', '18.00-19.00', '19.00-20.00', '20.00-21.00', '21.00-22.00'];

// Helper: Ambil tanggal Senin-Minggu (Bebas Timezone)
function getWeekDates(offset = 0) {
  const dates = [];
  const now = new Date();
  now.setHours(12, 0, 0, 0); // Gunakan jam 12 siang agar tidak geser hari
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

const SchedulePage = ({ courts, onConfirm, API_URL, quickSearch, targetCourtId, setTargetCourtId }) => {
  useEffect(() => {
    if (targetCourtId) {
      setTimeout(() => {
        const element = document.getElementById(`court-${targetCourtId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Clear target after scrolling
          setTimeout(() => setTargetCourtId(null), 1000);
        }
      }, 500);
    }
  }, [targetCourtId]);

  const calculateInitialOffset = () => {
    if (!quickSearch?.date) return 0;
    try {
      const searchDate = new Date(quickSearch.date);
      searchDate.setHours(12, 0, 0, 0);
      const now = new Date();
      now.setHours(12, 0, 0, 0);
      const day = now.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      const mondayNow = new Date(now);
      mondayNow.setDate(now.getDate() + diff);
      const diffTime = searchDate.getTime() - mondayNow.getTime();
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      return Math.max(0, diffWeeks);
    } catch (e) { return 0; }
  };

  const [weekOffset, setWeekOffset] = useState(calculateInitialOffset());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDayIdx, setSelectedDayIdx] = useState(todayIdx);
  const [bookings, setBookings] = useState([]);
  const [memberSchedules, setMemberSchedules] = useState([]);

  const weekDates = getWeekDates(weekOffset);
  const todayStr = new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();

  const fetchAll = async () => {
    try {
      const [resB, resM] = await Promise.all([
        fetch(`${API_URL}/bookings`),
        fetch(`${API_URL}/member-schedules`),
      ]);
      setBookings(await resB.json());
      setMemberSchedules(await resM.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 10000);
    return () => clearInterval(iv);
  }, [API_URL]);

  const getSlotPrice = (court, time) => {
    const startHour = parseInt(time.split('.')[0] || time, 10);
    if (startHour >= 17) {
      return court.price + 5000;
    }
    return court.price;
  };

  const toggleSlot = (court, time, date, dayName) => {
    const id = `${court.id}-${date}-${time}`;
    const exists = selectedSlots.find(s => s.id === id);
    if (exists) {
      setSelectedSlots(selectedSlots.filter(s => s.id !== id));
    } else {
      setSelectedSlots([...selectedSlots, { id, court_id: court.id, court_name: court.name, time, date, dayName, price: getSlotPrice(court, time) }]);
    }
  };

  const totalPrice = selectedSlots.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#1A4B9F] mb-2">Pesan Lapangan</h1>
            <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">
              {weekDates[0]} <span className="mx-2">→</span> {weekDates[6]}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
            <button onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))} className="p-2 rounded-xl hover:bg-zinc-50"><ChevronLeft/></button>
            <div className="px-4 font-bold text-sm text-zinc-600">Minggu Ke-{weekOffset + 1}</div>
            <button onClick={() => setWeekOffset(prev => Math.min(4, prev + 1))} className="p-2 rounded-xl hover:bg-zinc-50"><ChevronRight/></button>
          </div>
        </div>

        {/* Quick Access Filter Bar */}
        {quickSearch?.name && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-4 bg-[#1A4B9F] text-white p-4 rounded-2xl shadow-lg shadow-blue-900/20"
          >
            <div className="flex-1 flex items-center gap-6 px-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase opacity-60">Pemesan</span>
                <span className="font-bold">{quickSearch.name}</span>
              </div>
              <div className="w-[1px] h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase opacity-60">Tanggal</span>
                <span className="font-bold">{quickSearch.date || 'Semua Tanggal'}</span>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all"
              title="Hapus Filter"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Mobile Day Selector Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-4 md:hidden no-scrollbar">
          {DAY_NAMES.map((name, idx) => {
            const isActive = idx === selectedDayIdx;
            const isToday = weekDates[idx] === todayStr;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedDayIdx(idx)}
                className={`flex-shrink-0 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
                  isActive 
                    ? 'bg-[#1A4B9F] text-white border-[#1A4B9F] shadow-lg shadow-blue-200' 
                    : isToday 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200'
                }`}
              >
                {name}
                <span className="block text-[8px] font-medium opacity-60 mt-0.5">{weekDates[idx]}</span>
              </button>
            );
          })}
        </div>

        {/* Schedule Board */}
        <div className="bg-white rounded-[40px] shadow-2xl border-4 border-white overflow-hidden overflow-x-auto">
          <div className="w-full md:min-w-[1200px]">
            {/* Header Hari */}
            <div className="grid grid-cols-[60px_60px_1fr] md:grid-cols-[100px_100px_repeat(7,1fr)] bg-zinc-50 border-b border-zinc-100">
              <div className="p-4 md:p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100 text-center flex items-center justify-center">Lap</div>
              <div className="p-4 md:p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-100 text-center flex items-center justify-center">Waktu</div>
              
              {/* Mobile Single Day Header */}
              <div className={`p-3 text-center border-r border-zinc-100 md:hidden bg-blue-50/50 flex flex-col justify-center items-center`}>
                <p className="text-xs font-black text-zinc-800">{DAY_NAMES[selectedDayIdx]}</p>
                <p className="text-[10px] font-bold text-zinc-400">{weekDates[selectedDayIdx]}</p>
              </div>

              {/* Desktop 7 Days Header */}
              {DAY_NAMES.map((name, i) => (
                <div key={i} className={`hidden md:block p-6 text-center border-r border-zinc-100 last:border-r-0 ${
                  weekDates[i] === quickSearch?.date ? 'bg-blue-50 border-b-2 border-primary' : 
                  weekDates[i] === todayStr ? 'bg-emerald-50' : ''
                }`}>
                  <p className="text-xs font-black text-zinc-800">{name}</p>
                  <p className="text-[10px] font-bold text-zinc-400">{weekDates[i]}</p>
                </div>
              ))}
            </div>

            {/* Grid Body */}
            {courts.map((court, cIdx) => (
              <div key={court.id} id={`court-${court.id}`} className="relative scroll-mt-32">
                {/* Lapangan Divider Header */}
                <div className="bg-[#1A4B9F] text-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 sticky left-0 z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PILIH JADWAL {court.name}
                </div>

                {HOURS.map((time, tIdx) => {
                  // Helper function to render a slot
                  const renderSlot = (date, dIdx, isMobileMode) => {
                    const slotId = `${court.id}-${date}-${time}`;
                    const isPicked = selectedSlots.some(s => s.id === slotId);
                    const isPast = date < todayStr || (date === todayStr && parseInt(time) < currentHour);

                    const isMatch = (name) => {
                      if (!quickSearch?.name) return true;
                      return name?.toLowerCase().includes(quickSearch.name.toLowerCase());
                    };

                    const member = memberSchedules.find(m => 
                      m.is_active && Number(m.court_id) === Number(court.id) && 
                      Number(m.day_of_week) === (dIdx === 6 ? 7 : dIdx + 1) && 
                      parseInt(m.start_time) <= parseInt(time) && parseInt(m.end_time) > parseInt(time)
                    );
                    const booking = !member && bookings.find(b => 
                      (b.status === 'Pending' || b.status === 'Confirmed') &&
                      Number(b.court_id) === Number(court.id) && 
                      b.booking_date === date && 
                      parseInt(b.start_time) <= parseInt(time) && parseInt(b.end_time) > parseInt(time)
                    );

                    const showMember = member && isMatch(member.member_name);
                    const showBooking = booking && isMatch(booking.customer_full_name);
                    const isOccupiedByOthers = (member && !showMember) || (booking && !showBooking);

                    return (
                      <div key={dIdx} className={`p-1 border-r border-zinc-50 last:border-r-0 min-h-[80px] ${isMobileMode ? 'md:hidden' : 'hidden md:block'} ${date === todayStr ? 'bg-emerald-50/10' : ''} ${isPast ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                        {showMember ? (
                          <div className="h-full w-full rounded-xl bg-purple-100 border border-purple-200 flex flex-col items-center justify-center p-2 text-center shadow-sm">
                            <span className="text-[7px] font-black text-purple-400 uppercase mb-0.5">MEMBER PB</span>
                            <span className="text-[10px] font-black text-purple-800 uppercase leading-tight line-clamp-2">{member.member_name}</span>
                          </div>
                        ) : showBooking ? (
                          <div className={`h-full w-full rounded-xl border flex flex-col items-center justify-center p-2 text-center shadow-sm ${booking.status === 'Confirmed' ? 'bg-blue-600 border-blue-700 text-white' : 'bg-amber-50 border-amber-200'}`}>
                            {booking.status === 'Confirmed' ? (
                              <span className="text-[11px] font-black uppercase leading-tight line-clamp-2 px-1">{booking.customer_full_name}</span>
                            ) : (
                              <>
                                <span className="text-[7px] font-black uppercase mb-0.5 text-zinc-400">ANTRIAN</span>
                                <span className="text-[10px] font-black uppercase leading-tight line-clamp-2 text-amber-700">{booking.customer_full_name}</span>
                              </>
                            )}
                          </div>
                        ) : isOccupiedByOthers ? (
                          <div className="h-full w-full rounded-xl bg-zinc-50/50 border border-zinc-100 flex items-center justify-center opacity-20">
                            <span className="text-[8px] font-bold text-zinc-300">TERISI</span>
                          </div>
                        ) : (
                          <div 
                            onClick={() => !isPast && toggleSlot(court, time, date, DAY_NAMES[dIdx])}
                            className={`h-full w-full rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                              isPast ? 'bg-zinc-50 border-zinc-100 cursor-not-allowed' :
                              isPicked ? 'bg-[#1A4B9F] border-[#1A4B9F] text-white shadow-lg scale-95 cursor-pointer' : 
                              'border-zinc-100 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1 select-none">
                              <span className={`text-[9px] font-black uppercase tracking-widest ${isPast ? 'text-zinc-300' : isPicked ? 'text-white' : 'text-zinc-400'}`}>
                                {isPast ? 'TUTUP' : isPicked ? 'OK ✓' : 'KOSONG'}
                              </span>
                              {!isPast && !isPicked && (
                                <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                  {getSlotPrice(court, time) / 1000}k
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  };

                  return (
                    <div key={time} className="grid grid-cols-[60px_60px_1fr] md:grid-cols-[100px_100px_repeat(7,1fr)] hover:bg-zinc-50/30 transition-colors border-b border-zinc-50">
                      <div className="p-2 md:p-4 flex items-center justify-center border-r border-zinc-100 bg-zinc-50/20 font-black text-primary/10 text-lg md:text-2xl italic">{cIdx + 1}</div>
                      <div className="p-2 md:p-4 flex items-center justify-center border-r border-zinc-100 font-mono text-[10px] md:text-[11px] font-bold text-rose-500 bg-zinc-50/10">{time}</div>
                      
                      {/* Mobile Slot */}
                      {renderSlot(weekDates[selectedDayIdx], selectedDayIdx, true)}

                      {/* Desktop Slots */}
                      {weekDates.map((date, dIdx) => renderSlot(date, dIdx, false))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Bar (Float) */}
        {selectedSlots.length > 0 && (
          <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-[24px] md:rounded-[32px] shadow-2xl border border-zinc-100 p-3 md:p-4 flex items-center justify-between gap-4 md:gap-8 z-50 w-[92%] md:w-auto min-w-[320px]"
          >
            <div className="pl-4 md:pl-6 pr-4 md:pr-8 border-r border-zinc-100">
               <p className="text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Total {selectedSlots.length} Jam</p>
               <p className="text-lg md:text-2xl font-black text-[#1A4B9F]">Rp {totalPrice.toLocaleString()}</p>
            </div>
            <div className="flex gap-2 md:gap-4 pr-2">
               <button onClick={() => setSelectedSlots([])} className="px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-zinc-400 hover:bg-zinc-50 transition-all text-xs md:text-sm">Batal</button>
               <button onClick={() => onConfirm({ court_id: selectedSlots[0].court_id, court_name: selectedSlots[0].court_name, court_image: courts.find(c=>c.id===selectedSlots[0].court_id)?.image, date: selectedSlots[0].date, dayName: selectedSlots[0].dayName, time: selectedSlots[0].time, price: totalPrice, all_slots: selectedSlots })} className="px-6 md:px-10 py-3 md:py-4 bg-[#1A4B9F] text-white rounded-xl md:rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all text-xs md:text-sm whitespace-nowrap">Lanjut Bayar</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
