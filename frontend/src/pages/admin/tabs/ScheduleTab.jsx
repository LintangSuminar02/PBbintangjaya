import React from 'react';
import { motion } from 'motion/react';

const DAY_NAMES = ['SENIN','SELASA','RABU','KAMIS',"JUM'AT",'SABTU','MINGGU'];
const HOURS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];

const ScheduleTab = ({ courts = [], bookings = [], memberSchedules = [], weekDates = [], weekOffset = 0 }) => {
  return (
    <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col h-[60vh] md:h-[70vh]">
      {/* Container untuk scroll horizontal dan vertikal */}
      <div className="overflow-auto flex-1">
        <div className="min-w-[1000px] relative">
          
          {/* Header Tanggal - Sticky Top */}
          <div className="grid grid-cols-[80px_80px_repeat(7,1fr)] bg-[#F8F9FB] border-b border-zinc-100 font-black text-[9px] text-zinc-400 uppercase tracking-widest sticky top-0 z-30">
            <div className="p-3 border-r border-zinc-100 text-center bg-[#F8F9FB]">LAP</div>
            <div className="p-3 border-r border-zinc-100 text-center bg-[#F8F9FB]">JAM</div>
            {DAY_NAMES.map((day, i) => (
              <div key={i} className="p-3 text-center border-r border-zinc-100 last:border-r-0 bg-[#F8F9FB]">
                <p className="text-zinc-800">{day}</p>
                <p className="text-[8px] text-zinc-400 mt-0.5">{weekDates[i] || '-'}</p>
              </div>
            ))}
          </div>

          {/* Body Grid */}
          <div className="flex flex-col">
            {courts.map((court, cIdx) => (
              <div key={court.id} className="relative">
                {/* Lapangan Divider Header - Sticky Left & Content */}
                <div className="bg-[#1A4B9F] text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 sticky left-0 z-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {court.name}
                </div>

                {HOURS.map((time) => (
                  <div key={time} className="grid grid-cols-[80px_80px_repeat(7,1fr)] hover:bg-zinc-50/50 transition-colors border-b border-zinc-50">
                    <div className="p-2 flex items-center justify-center border-r border-zinc-100 font-black text-xl text-zinc-100 bg-zinc-50/10 italic sticky left-0 z-10 bg-white">{cIdx + 1}</div>
                    <div className="p-2 flex items-center justify-center border-r border-zinc-100 font-mono text-[9px] font-bold text-rose-500 bg-zinc-50/5 sticky left-[80px] z-10 bg-white">{time}</div>
                    
                    {/* Slot Hari */}
                    {Array.from({ length: 7 }).map((_, dIdx) => {
                      const date = weekDates[dIdx];
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

                      return (
                        <div key={dIdx} className="p-0.5 border-r border-zinc-100 last:border-r-0 min-h-[50px]">
                          {member ? (
                            <div className="h-full w-full rounded-lg bg-purple-50 border border-purple-100 flex flex-col items-center justify-center text-center p-1">
                              <span className="text-[6px] font-black text-purple-300 uppercase">MEMBER</span>
                              <span className="text-[8px] font-black text-purple-700 leading-tight line-clamp-1 uppercase">{member.member_name}</span>
                            </div>
                          ) : booking ? (
                            <div className={`h-full w-full rounded-lg border flex flex-col items-center justify-center text-center p-1 ${
                              booking.status === 'Confirmed' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'
                            }`}>
                              <span className="text-[6px] font-black text-zinc-300 uppercase">{booking.status === 'Confirmed' ? 'FIX' : 'ANTRI'}</span>
                              <span className={`text-[8px] font-black uppercase leading-tight line-clamp-1 ${
                                booking.status === 'Confirmed' ? 'text-blue-700' : 'text-amber-700'
                              }`}>{booking.customer_full_name || 'BOOKED'}</span>
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-lg border border-dashed border-zinc-50 flex items-center justify-center opacity-30">
                              <span className="text-[6px] font-black text-zinc-200 uppercase tracking-tighter italic">Kosong</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer info kecil */}
      <div className="bg-zinc-50 px-4 md:px-6 py-2 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Geser secara horizontal & vertikal untuk melihat jadwal lengkap</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[9px] font-bold text-zinc-500">FIX</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[9px] font-bold text-zinc-500">ANTRI</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500" /><span className="text-[9px] font-bold text-zinc-500">MEMBER</span></div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;
