import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const HOURS = ['07.00-08.00', '08.00-09.00', '09.00-10.00', '10.00-11.00', '11.00-12.00', '12.00-13.00', '13.00-14.00', '14.00-15.00', '15.00-16.00', '16.00-17.00', '17.00-18.00', '18.00-19.00', '19.00-20.00', '20.00-21.00', '21.00-22.00'];
const DAY_NAMES = ['SENIN','SELASA','RABU','KAMIS',"JUM'AT",'SABTU','MINGGU'];
const PAGE_SIZE = 6; // Menampilkan 6 jam per slide agar font bisa sangat besar

function getWeekDates() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${dd}`);
  }
  return dates;
}

function getTodayIdx() {
  const d = new Date().getDay(); // 0=Sun
  return d === 0 ? 6 : d - 1;   // Mon=0 .. Sun=6
}

export default function DisplayPage({ onExit }) {
  const [courts,          setCourts]          = useState([]);
  const [bookings,        setBookings]        = useState([]);
  const [memberSchedules, setMemberSchedules] = useState([]);
  const [clock,           setClock]           = useState(new Date());
  const [lastRefresh,     setLastRefresh]     = useState(new Date());
  const [online,          setOnline]          = useState(true);
  const [isFullscreen,    setIsFullscreen]    = useState(false);
  const [activeSlideIdx,   setActiveSlideIdx]  = useState(0);
  const ref = useRef(null);

  const weekDates  = getWeekDates();
  const todayIdx   = getTodayIdx();
  const currentHourInt = clock.getHours();
  
  const isPastHour = (time) => parseInt(time, 10) < currentHourInt;

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchAll = async () => {
    try {
      const [rC, rB, rM] = await Promise.all([
        fetch(`${API_URL}/courts`),
        fetch(`${API_URL}/bookings`),
        fetch(`${API_URL}/member-schedules`),
      ]);
      const c = await rC.json(); setCourts(Array.isArray(c) ? c : []);
      const b = await rB.json(); setBookings(Array.isArray(b) ? b : []);
      const m = await rM.json(); setMemberSchedules(Array.isArray(m) ? m : []);
      setLastRefresh(new Date());
      setOnline(true);
    } catch {
      setOnline(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const iv = setInterval(fetchAll, 30000);
    return () => clearInterval(iv);
  }, []);

  // Generate Slides: Tiap Slide = { court, courtIdx, hourSubset, pageLabel }
  const visibleHours = HOURS.filter(h => !isPastHour(h));
  const slides = [];
  courts.forEach((court, ci) => {
    for (let i = 0; i < visibleHours.length; i += PAGE_SIZE) {
      const subset = visibleHours.slice(i, i + PAGE_SIZE);
      slides.push({
        court,
        courtIdx: ci,
        hours: subset,
        pageLabel: `Sesi ${Math.floor(i / PAGE_SIZE) + 1}`
      });
    }
  });

  useEffect(() => {
    if (slides.length <= 1) return;
    const slideIv = setInterval(() => {
      setActiveSlideIdx(prev => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(slideIv);
  }, [slides.length]);

  const toggleFS = () => {
    if (!document.fullscreenElement) ref.current?.requestFullscreen();
    else document.exitFullscreen();
  };
  
  useEffect(() => {
    const fn = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fn);
    return () => document.removeEventListener('fullscreenchange', fn);
  }, []);

  function getSlot(courtId, time, dayIdx) {
    const jsDay    = dayIdx === 6 ? 0 : dayIdx + 1;
    const memberDay = jsDay === 0 ? 7 : jsDay;
    const targetDate = weekDates[dayIdx];
    const slotH  = parseInt(time, 10);

    const mem = memberSchedules.find(m =>
      Number(m.is_active) === 1 &&
      Number(m.court_id)  === Number(courtId) &&
      Number(m.day_of_week) === memberDay &&
      slotH >= parseInt(m.start_time, 10) &&
      slotH <  parseInt(m.end_time,   10)
    );
    if (mem) return { type: 'member', label: mem.member_name || 'Member PB' };

    const bk = bookings.find(b => {
      if (!b.booking_date) return false;
      const bDateStr = b.booking_date.includes('T') ? b.booking_date.split('T')[0] : b.booking_date.toString().slice(0, 10);
      const bStart = parseInt(b.start_time, 10);
      const bEnd   = parseInt(b.end_time, 10);
      return (
        (b.status === 'Pending' || b.status === 'Confirmed') &&
        Number(b.court_id) === Number(courtId) &&
        bDateStr === targetDate &&
        slotH >= bStart &&
        slotH <  bEnd
      );
    });
    if (bk) return {
      type:  bk.status === 'Confirmed' ? 'confirmed' : 'pending',
      label: bk.customer_full_name || bk.customer_name || 'BOOKED',
    };
    return { type: 'empty', label: '' };
  }

  function Cell({ slot }) {
    if (slot.type === 'member') return (
      <div className="h-full rounded-2xl bg-purple-100 border-2 border-purple-300 flex flex-col items-center justify-center text-center px-2 py-2 shadow-sm">
        <span className="tv-cell-badge text-purple-400 uppercase tracking-[0.2em] leading-none">MEMBER PB</span>
        <span className="tv-cell-label font-black text-purple-900 leading-tight mt-1 line-clamp-2 uppercase">{slot.label}</span>
      </div>
    );
    if (slot.type === 'confirmed') return (
      <div className="h-full rounded-2xl bg-blue-100 border-2 border-blue-300 flex flex-col items-center justify-center text-center px-2 py-2 shadow-sm">
        <span className="tv-cell-badge text-blue-400 uppercase tracking-[0.2em] leading-none">TERKONFIRMASI</span>
        <span className="tv-cell-label font-black text-blue-900 leading-tight mt-1 line-clamp-2 uppercase">{slot.label}</span>
      </div>
    );
    if (slot.type === 'pending') return (
      <div className="h-full rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center text-center px-2 py-2">
        <span className="tv-cell-badge text-amber-500 uppercase tracking-[0.2em] leading-none">ANTRIAN</span>
        <span className="tv-cell-label font-black text-amber-800 leading-tight mt-1 line-clamp-2 uppercase">{slot.label}</span>
      </div>
    );
    return (
      <div className="h-full rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center">
        <span className="tv-cell-empty-label text-zinc-300 uppercase tracking-widest font-black opacity-40">— KOSONG —</span>
      </div>
    );
  }

  // Jika belum ada slides (loading)
  const currentSlide = slides[activeSlideIdx] || null;

  return (
    <div
      ref={ref}
      className="tv-container"
    >
      {/* ── TOP NAV ────────────────────────────────────────────── */}
      <div className="tv-header">
        <div className="tv-header-left">
          <div className="tv-logo-wrapper">
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span style="font-size: 2vw">🏸</span>';
                e.target.parentElement.style.background = 'linear-gradient(135deg, #3B82F6, #1D4ED8)';
              }}
            />
          </div>
          <div className="tv-brand">
            <div className="tv-brand-title">HALL BINTANG JAYA SPORT</div>
            <div className="tv-brand-subtitle">Papan Jadwal Live Monitor</div>
          </div>
          
          {currentSlide && (
            <div className="tv-monitor-info">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="tv-monitor-label">Monitoring</span>
                <span className="tv-monitor-court">LAPANGAN {currentSlide.courtIdx + 1}</span>
              </div>
              <div className="tv-monitor-divider hidden sm:block" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="tv-monitor-label">Waktu</span>
                <span className="tv-monitor-time">
                  {currentSlide.hours[0]?.split('-')[0]} - {currentSlide.hours[currentSlide.hours.length - 1]?.split('-')[1]}
                </span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.5vw, 40px)' }} className="flex-col sm:flex-row align-stretch sm:align-center">
          <div className="tv-clock-container">
            <div className="tv-clock-val">
              {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              <span className="tv-clock-sec">:{clock.toLocaleTimeString('id-ID', { second: '2-digit' })}</span>
            </div>
            <div className="tv-clock-date">
              {DAY_NAMES[todayIdx]}, {weekDates[todayIdx]}
            </div>
          </div>

          <div className="tv-header-actions">
            <button onClick={toggleFS} className="tv-btn-fs">
              <Maximize2 size={24} style={{ width: 'clamp(20px, 2.2vh, 32px)', height: 'clamp(20px, 2.2vh, 32px)' }} />
            </button>
            {onExit && (
              <button onClick={onExit} className="tv-btn-exit">
                KELUAR
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── GRID ──────────────────────────────────────────────── */}
      <div className="tv-table-wrapper">
        <table className="tv-table">
          <thead>
            <tr>
              <th className="tv-th-lap">LAP</th>
              <th className="tv-th-jam">JAM</th>
              {DAY_NAMES.map((day, di) => {
                const isToday = di === todayIdx;
                return (
                  <th key={day} className="tv-th-day" style={{ background: isToday ? '#059669' : '#1A4B9F', borderRadius: di === 6 ? '0 clamp(16px, 2vh, 24px) clamp(16px, 2vh, 24px) 0' : 0 }}>
                    <div>{day}</div>
                    <div className="tv-th-date" style={{ color: isToday ? '#A7F3D0' : '#93C5FD' }}>
                      {weekDates[di].split('-').slice(1).reverse().join('/')}{isToday ? ' ◀' : ''}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody key={activeSlideIdx} className="fade-in-slide">
            {currentSlide && currentSlide.hours.map((time, hi) => {
              const isNow  = currentHourInt === parseInt(time, 10);
              const rowBg  = isNow  ? '#ECFDF5' : (hi % 2 === 0 ? '#fff' : '#F9FBFF');

              return (
                <tr key={time} style={{ height: `${100 / PAGE_SIZE}%` }}>
                  {hi === 0 ? (
                    <td
                      rowSpan={currentSlide.hours.length}
                      className="tv-td-lap"
                    >
                      <div className="tv-td-lap-header">LAP</div>
                      <div className="tv-td-lap-num">{currentSlide.courtIdx + 1}</div>
                      <div className="tv-td-lap-status" style={{ color: currentSlide.court.status === 'Active' ? '#6EE7B7' : '#FCD34D' }}>{currentSlide.court.status}</div>
                    </td>
                  ) : null}

                  <td className="tv-td-jam" style={{ background: isNow ? '#ECFDF5' : rowBg }}>
                    <div className="tv-td-jam-val" style={{ color: isNow ? '#059669' : '#1E3A8A' }}>{time}</div>
                    {isNow && <div style={{ width: 'clamp(10px, 1.5vh, 18px)', height: 'clamp(10px, 1.5vh, 18px)', borderRadius: '50%', background: '#10B981', margin: 'clamp(6px, 1vh, 12px) auto 0', animation: 'pulse-glow 1.5s infinite' }} />}
                  </td>

                  {[0,1,2,3,4,5,6].map(di => {
                    const slot    = getSlot(currentSlide.court.id, time, di);
                    const isToday = di === todayIdx;
                    const cellBg  = isNow ? (isToday ? '#D1FAE5' : '#ECFDF5') : (isToday ? '#F0FDF4' : rowBg);
                    return (
                      <td key={di} className="tv-td-cell" style={{ background: cellBg, height: '100%' }}>
                        <Cell slot={slot} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <div className="tv-footer">
        <div className="tv-legend-items">
          {[
            { color: '#BFDBFE', border: '#93C3FD', label: 'Terkonfirmasi' },
            { color: '#EDE9FE', border: '#C4B5FD', label: 'Jadwal Member PB' },
            { color: '#F9FAFB', border: '#E2E8F0', label: 'Kosong / Tersedia', dashed: true },
          ].map(({ color, border, label, dashed }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1.2vw, 16px)' }}>
              <div style={{ width: 'clamp(20px, 2.8vh, 32px)', height: 'clamp(20px, 2.8vh, 32px)', borderRadius: 'clamp(6px, 0.8vh, 10px)', background: color, border: `3px ${dashed ? 'dashed' : 'solid'} ${border}`, boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }} className="flex-shrink-0" />
              <span className="tv-legend-label">{label}</span>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.5vw, 32px)' }} className="flex-col sm:flex-row align-center">
          {/* Slide Indicators */}
          <div style={{ display: 'flex', gap: 'clamp(8px, 1vw, 12px)' }}>
            {slides.map((_, i) => (
              <div key={i} style={{ width: 'clamp(8px, 1.2vh, 14px)', height: 'clamp(8px, 1.2vh, 14px)', borderRadius: '50%', background: i === activeSlideIdx ? '#1A4B9F' : '#E2E8F0', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: i === activeSlideIdx ? 'scale(1.3)' : 'scale(1)' }} />
            ))}
          </div>
          <div style={{ width: 2, height: 'clamp(20px, 3vh, 32px)', background: '#E2E8F0' }} className="hidden sm:block" />
          <div className="tv-sync-text">
            <div style={{ width: 'clamp(8px, 1.2vh, 12px)', height: 'clamp(8px, 1.2vh, 12px)', borderRadius: '50%', background: '#10B981', animation: 'pulse-glow 2s infinite' }} />
            SINKRONISASI AKTIF · {lastRefresh.toLocaleTimeString('id-ID')}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow { 0%,100%{opacity:1; transform:scale(1);} 50%{opacity:0.5; transform:scale(1.2);} }
        @keyframes fadeInSlide { 
          from { opacity: 0; transform: scale(0.98) translateY(20px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
        .fade-in-slide { animation: fadeInSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        /* Custom scrollbar for TV */
        ::-webkit-scrollbar { width: 0px; background: transparent; }

        /* DEFAULT TV STYLES (Layar Lebar / Desktop TV Monitor) */
        .tv-container {
          position: fixed; inset: 0; z-index: 9999; background: #F0F4FF;
          font-family: 'Inter', sans-serif; display: flex; flex-direction: column; overflow: hidden;
          user-select: none;
        }
        .tv-header {
          background: #1A4B9F; padding: clamp(10px, 1.5vh, 20px) clamp(16px, 2vw, 32px); display: flex;
          align-items: center; justify-content: space-between; flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .tv-header-left { display: flex; align-items: center; gap: clamp(12px, 1.5vw, 24px); }
        .tv-logo-wrapper {
          width: clamp(48px, 6vh, 80px); height: clamp(48px, 6vh, 80px); border-radius: clamp(12px, 1.5vh, 20px); background: #fff;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }
        .tv-brand { display: flex; flex-direction: column; text-align: left; }
        .tv-brand-title { color: #fff; font-weight: 950; font-size: clamp(20px, 3vh, 36px); line-height: 1; letter-spacing: -0.5px; }
        .tv-brand-subtitle { color: #93C5FD; font-weight: 800; font-size: clamp(9px, 1.1vh, 13px); text-transform: uppercase; letter-spacing: 3px; margin-top: 4px; }
        
        .tv-monitor-info {
          margin-left: clamp(20px, 2.5vw, 40px); padding: clamp(8px, 1.2vh, 16px) clamp(16px, 2vw, 32px); background: #fff; border-radius: clamp(16px, 2vh, 28px);
          display: flex; align-items: center; gap: clamp(12px, 1.5vw, 24px); box-shadow: 0 12px 32px rgba(0,0,0,0.15);
          text-align: left;
        }
        .tv-monitor-label { font-size: clamp(9px, 1.2vh, 14px); font-weight: 900; color: #64748B; text-transform: uppercase; letter-spacing: 2px; }
        .tv-monitor-court { font-size: clamp(16px, 2.5vh, 32px); font-weight: 950; color: #1E3A8A; line-height: 1; }
        .tv-monitor-divider { width: 2px; height: clamp(24px, 4vh, 48px); background: #E2E8F0; }
        .tv-monitor-time { font-size: clamp(14px, 2vh, 24px); font-weight: 800; color: #1E3A8A; line-height: 1; }

        .tv-clock-container { text-align: right; }
        .tv-clock-val { color: #fff; font-weight: 950; font-size: clamp(36px, 6.5vh, 80px); font-variant-numeric: tabular-nums; line-height: 0.9; }
        .tv-clock-sec { font-size: 0.55em; opacity: 0.6; margin-left: 4px; font-weight: 700; }
        .tv-clock-date { color: #93C5FD; font-size: clamp(11px, 1.6vh, 18px); font-weight: 800; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px; }
        
        .tv-header-actions { display: flex; align-items: center; gap: 12px; }
        .tv-btn-fs { padding: clamp(10px, 1.5vh, 16px); border-radius: clamp(12px, 1.8vh, 20px); background: rgba(255,255,255,0.1); border: none; cursor: pointer; color: #fff; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .tv-btn-fs:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }
        .tv-btn-exit { padding: clamp(10px, 1.2vh, 14px) clamp(16px, 1.8vw, 24px); border-radius: clamp(12px, 1.8vh, 20px); background: rgba(248,113,113,0.2); border: none; cursor: pointer; color: #FCA5A5; font-size: clamp(12px, 1.6vh, 18px); font-weight: 900; transition: all 0.2s; }
        .tv-btn-exit:hover { background: rgba(248,113,113,0.3); color: #fff; transform: scale(1.05); }

        .tv-table-wrapper { flex: 1; overflow: hidden; padding: clamp(12px, 1.8vh, 24px) clamp(16px, 2vw, 32px); }
        .tv-table { width: 100%; height: 100%; border-collapse: separate; border-spacing: 0 clamp(8px, 1.2vh, 14px); }
        
        .tv-th-lap { background: #1A4B9F; color: rgba(255,255,255,0.6); font-size: clamp(9px, 1.2vh, 13px); font-weight: 900; text-transform: uppercase; letter-spacing: 3px; padding: clamp(12px, 1.8vh, 24px) 12px; border-radius: clamp(16px, 2vh, 24px) 0 0 clamp(16px, 2vh, 24px); width: clamp(80px, 8vw, 120px); text-align: center; }
        .tv-th-jam { background: #1A4B9F; color: rgba(255,255,255,0.6); font-size: clamp(9px, 1.2vh, 13px); font-weight: 900; text-transform: uppercase; letter-spacing: 3px; padding: clamp(12px, 1.8vh, 24px) 12px; width: clamp(160px, 15vw, 240px); text-align: center; }
        .tv-th-day { background: #1A4B9F; color: #fff; font-size: clamp(14px, 2.2vh, 24px); font-weight: 950; text-transform: uppercase; padding: clamp(12px, 1.8vh, 24px) 12px; text-align: center; border-left: 2px solid rgba(255,255,255,0.1); }
        .tv-th-date { font-size: clamp(10px, 1.4vh, 16px); font-weight: 800; margin-top: 6px; letter-spacing: 1px; }

        .tv-td-lap { background: #1A4B9F; text-align: center; vertical-align: middle; border-radius: clamp(16px, 2vh, 24px) 0 0 clamp(16px, 2vh, 24px); padding: clamp(16px, 2vh, 24px) 12px; }
        .tv-td-lap-header { color: rgba(255,255,255,0.4); font-size: clamp(10px, 1.4vh, 16px); font-weight: 900; text-transform: uppercase; letter-spacing: 4px; }
        .tv-td-lap-num { color: #fff; font-size: clamp(60px, 11vh, 130px); font-weight: 950; line-height: 1; margin-top: 10px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
        .tv-td-lap-status { color: #6EE7B7; font-size: clamp(10px, 1.3vh, 16px); font-weight: 900; text-transform: uppercase; margin-top: clamp(12px, 2vh, 24px); background: rgba(255,255,255,0.15); border-radius: clamp(10px, 1.5vh, 16px); padding: clamp(6px, 0.8vh, 12px) clamp(12px, 1.5vw, 24px); display: inline-block; border: 1px solid rgba(255,255,255,0.1); }
        
        .tv-td-jam { text-align: center; padding: 12px; border-left: 4px solid #E0E7FF; width: clamp(160px, 15vw, 240px); }
        .tv-td-jam-val { font-size: clamp(16px, 2.8vh, 34px); font-weight: 950; font-family: monospace; color: #1E3A8A; line-height: 1; }
        .tv-td-cell { padding: clamp(6px, 0.8vh, 12px); border-left: 1px solid #E2E8F0; }
        
        .tv-cell-badge { font-size: clamp(8px, 1vh, 11px); font-weight: 900; letter-spacing: 0.15em; line-height: none; }
        .tv-cell-label { font-size: clamp(12px, 1.8vh, 22px); font-weight: 950; }
        .tv-cell-empty-label { font-size: clamp(10px, 1.3vh, 16px); font-weight: 900; }

        .tv-footer { background: #fff; border-top: 2px solid #E2E8F0; padding: clamp(12px, 1.8vh, 24px) clamp(16px, 2vw, 32px); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .tv-legend-items { display: flex; gap: clamp(24px, 3.5vw, 60px); }
        .tv-legend-label { font-size: clamp(10px, 1.4vh, 16px); font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 2px; }
        .tv-sync-text { font-size: clamp(10px, 1.4vh, 16px); font-weight: 900; color: #94A3B8; display: flex; align-items: center; gap: 10px; }

        /* RESPONSIVE STYLES (Mobile & Tablet / Lebar Layar dalam Posisi Portrait atau Sangat Sempit) */
        @media (orientation: portrait) or (max-width: 767px) {
          .tv-container { overflow-y: auto; position: relative; height: auto; min-height: 100vh; }
          .tv-header { padding: 16px; flex-direction: column; gap: 16px; align-items: stretch; text-align: center; }
          .tv-header-left { flex-direction: column; gap: 12px; align-items: center; }
          .tv-logo-wrapper { width: 48px; height: 48px; border-radius: 12px; }
          .tv-brand { text-align: center; }
          .tv-brand-title { font-size: 22px; text-align: center; }
          .tv-brand-subtitle { font-size: 10px; letter-spacing: 2px; }
          .tv-monitor-info { margin-left: 0; padding: 10px 16px; border-radius: 16px; gap: 12px; justify-content: center; }
          .tv-monitor-info span { font-size: 14px !important; }
          .tv-clock-container { text-align: center; margin-top: 4px; }
          .tv-clock-val { font-size: 36px; }
          .tv-clock-date { font-size: 13px; margin-top: 4px; }
          .tv-header-actions { justify-content: center; margin-top: 8px; }
          .tv-table-wrapper { overflow-x: auto; padding: 12px 16px; }
          .tv-table { width: 980px; height: auto; border-spacing: 0 8px; }
          .tv-th-lap { width: 60px; padding: 12px 4px; font-size: 10px; }
          .tv-th-jam { width: 130px; padding: 12px 4px; font-size: 10px; }
          .tv-th-day { font-size: 14px; padding: 12px 8px; }
          .tv-td-lap { padding: 12px 6px; width: 60px; }
          .tv-td-lap-num { font-size: 40px; }
          .tv-td-lap-status { font-size: 10px; padding: 4px 8px; margin-top: 10px; }
          .tv-td-jam { width: 130px; padding: 8px; }
          .tv-td-jam-val { font-size: 14px; }
          .tv-cell-label { font-size: 12px !important; }
          .tv-cell-empty-label { font-size: 9px !important; }
          .tv-footer { flex-direction: column; gap: 16px; padding: 16px; text-align: center; }
          .tv-legend-items { flex-wrap: wrap; justify-content: center; gap: 16px 24px; }
          .tv-legend-items > div { gap: 8px !important; }
          .tv-legend-items span { font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
}
