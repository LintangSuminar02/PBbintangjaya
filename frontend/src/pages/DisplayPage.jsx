import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const HOURS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];
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
        <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] leading-none">MEMBER PB</span>
        <span className="tv-cell-label font-black text-purple-900 leading-tight mt-1 line-clamp-2 uppercase">{slot.label}</span>
      </div>
    );
    if (slot.type === 'confirmed') return (
      <div className="h-full rounded-2xl bg-blue-100 border-2 border-blue-300 flex flex-col items-center justify-center text-center px-2 py-2 shadow-sm">
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] leading-none">TERKONFIRMASI</span>
        <span className="tv-cell-label font-black text-blue-900 leading-tight mt-1 line-clamp-2 uppercase">{slot.label}</span>
      </div>
    );
    if (slot.type === 'pending') return (
      <div className="h-full rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 flex flex-col items-center justify-center text-center px-2 py-2">
        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] leading-none">ANTRIAN</span>
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
                e.target.parentElement.innerHTML = '<span style="font-size: 32px">🏸</span>';
                e.target.parentElement.style.background = 'linear-gradient(135deg, #3B82F6, #1D4ED8)';
              }}
            />
          </div>
          <div className="tv-brand">
            <div className="tv-brand-title">PB Bintang Jaya</div>
            <div className="tv-brand-subtitle">Papan Jadwal Live Monitor</div>
          </div>
          
          {currentSlide && (
            <div className="tv-monitor-info">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: 2 }}>Monitoring</span>
                <span style={{ fontSize: 28, fontWeight: 950, color: '#1E3A8A', lineHeight: 1 }}>LAPANGAN {currentSlide.courtIdx + 1}</span>
              </div>
              <div style={{ width: 2, height: 40, background: '#E2E8F0' }} className="hidden sm:block" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: 2 }}>Waktu</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#1E3A8A', lineHeight: 1 }}>{currentSlide.hours[0]} - {currentSlide.hours[currentSlide.hours.length - 1]}</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }} className="flex-col sm:flex-row align-stretch sm:align-center">
          <div className="tv-clock-container">
            <div className="tv-clock-val">
              {clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              <span style={{ fontSize: 32, opacity: 0.6, marginLeft: 4 }}>:{clock.toLocaleTimeString('id-ID', { second: '2-digit' })}</span>
            </div>
            <div className="tv-clock-date">
              {DAY_NAMES[todayIdx]}, {weekDates[todayIdx]}
            </div>
          </div>

          <div className="tv-header-actions">
            <button onClick={toggleFS} style={{ padding: 16, borderRadius: 20, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: '#fff', transition: 'all 0.2s' }}>
              <Maximize2 size={32} />
            </button>
            {onExit && (
              <button onClick={onExit} style={{ padding: '12px 24px', borderRadius: 20, background: 'rgba(248,113,113,0.2)', border: 'none', cursor: 'pointer', color: '#FCA5A5', fontSize: 16, fontWeight: 900 }}>
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
                  <th key={day} className="tv-th-day" style={{ background: isToday ? '#059669' : '#1A4B9F', borderRadius: di === 6 ? '0 24px 24px 0' : 0 }}>
                    <div>{day}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: isToday ? '#A7F3D0' : '#93C5FD', marginTop: 6, letterSpacing: 1 }}>
                      {weekDates[di].split('-').slice(1).reverse().join('/')}{isToday ? ' ◀' : ''}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody key={activeSlideIdx} className="fade-in-slide">
            {currentSlide && currentSlide.hours.map((time, hi) => {
              const isNow  = String(currentHourInt).padStart(2, '0') + ':00' === time;
              const rowBg  = isNow  ? '#ECFDF5' : (hi % 2 === 0 ? '#fff' : '#F9FBFF');

              return (
                <tr key={time} style={{ height: `${100 / PAGE_SIZE}%` }}>
                  {hi === 0 ? (
                    <td
                      rowSpan={currentSlide.hours.length}
                      className="tv-td-lap"
                    >
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 4 }}>LAP</div>
                      <div className="tv-td-lap-num">{currentSlide.courtIdx + 1}</div>
                      <div className="tv-td-lap-status" style={{ color: currentSlide.court.status === 'Active' ? '#6EE7B7' : '#FCD34D' }}>{currentSlide.court.status}</div>
                    </td>
                  ) : null}

                  <td className="tv-td-jam" style={{ background: isNow ? '#ECFDF5' : rowBg }}>
                    <div className="tv-td-jam-val" style={{ color: isNow ? '#059669' : '#1E3A8A' }}>{time}</div>
                    {isNow && <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#10B981', margin: '12px auto 0', animation: 'pulse-glow 1.5s infinite' }} />}
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
            { color: '#FEF3C7', border: '#FCD34D', label: 'Antrian (FCFS)', dashed: true },
            { color: '#EDE9FE', border: '#C4B5FD', label: 'Jadwal Member PB' },
            { color: '#F9FAFB', border: '#E2E8F0', label: 'Kosong / Tersedia', dashed: true },
          ].map(({ color, border, label, dashed }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: color, border: `3px ${dashed ? 'dashed' : 'solid'} ${border}`, boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }} className="flex-shrink-0" />
              <span style={{ fontSize: 14, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: 2 }}>{label}</span>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="flex-col sm:flex-row align-center">
          {/* Slide Indicators */}
          <div style={{ display: 'flex', gap: 12 }}>
            {slides.map((_, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i === activeSlideIdx ? '#1A4B9F' : '#E2E8F0', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: i === activeSlideIdx ? 'scale(1.3)' : 'scale(1)' }} />
            ))}
          </div>
          <div style={{ width: 2, height: 32, background: '#E2E8F0' }} className="hidden sm:block" />
          <div style={{ fontSize: 14, fontWeight: 900, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981', animation: 'pulse-glow 2s infinite' }} />
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
        }
        .tv-header {
          background: #1A4B9F; padding: 16px 32px; display: flex;
          align-items: center; justify-content: space-between; flex-shrink: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .tv-header-left { display: flex; align-items: center; gap: 20px; }
        .tv-logo-wrapper {
          width: 64px; height: 64px; border-radius: 18px; background: #fff;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }
        .tv-brand { display: flex; flex-direction: column; text-align: left; }
        .tv-brand-title { color: #fff; font-weight: 950; font-size: 32px; line-height: 1; letter-spacing: -0.5px; }
        .tv-brand-subtitle { color: #93C5FD; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; margin-top: 4px; }
        .tv-monitor-info {
          margin-left: 40px; padding: 12px 32px; background: #fff; border-radius: 24px;
          display: flex; align-items: center; gap: 20px; box-shadow: 0 12px 32px rgba(0,0,0,0.2);
          text-align: left;
        }
        .tv-clock-container { text-align: right; }
        .tv-clock-val { color: #fff; font-weight: 950; font-size: 64px; font-variant-numeric: tabular-nums; line-height: 0.9; }
        .tv-clock-date { color: #93C5FD; font-size: 16px; font-weight: 800; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .tv-header-actions { display: flex; align-items: center; gap: 12px; }
        .tv-table-wrapper { flex: 1; overflow: hidden; padding: 24px 32px; }
        .tv-table { width: 100%; height: 100%; border-collapse: separate; border-spacing: 0 12px; }
        .tv-th-lap { background: #1A4B9F; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; padding: 20px 12px; border-radius: 24px 0 0 24px; width: 100px; text-align: center; }
        .tv-th-jam { background: #1A4B9F; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; padding: 20px 12px; width: 140px; text-align: center; }
        .tv-th-day { background: #1A4B9F; color: #fff; font-size: 20px; font-weight: 950; text-transform: uppercase; padding: 20px 12px; text-align: center; border-left: 2px solid rgba(255,255,255,0.1); }
        .tv-td-lap { background: #1A4B9F; text-align: center; vertical-align: middle; border-radius: 24px 0 0 24px; padding: 24px 12px; }
        .tv-td-lap-num { color: #fff; font-size: 96px; font-weight: 950; line-height: 1; margin-top: 10px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
        .tv-td-lap-status { color: #6EE7B7; font-size: 14px; font-weight: 900; text-transform: uppercase; margin-top: 24px; background: rgba(255,255,255,0.15); border-radius: 16px; padding: 10px 20px; display: inline-block; border: 1px solid rgba(255,255,255,0.1); }
        .tv-td-jam { text-align: center; padding: 12px; border-left: 4px solid #E0E7FF; width: 140px; }
        .tv-td-jam-val { font-size: 42px; font-weight: 950; font-family: monospace; color: #1E3A8A; line-height: 1; }
        .tv-td-cell { padding: 12px; border-left: 1px solid #E2E8F0; }
        .tv-footer { background: #fff; border-top: 2px solid #E2E8F0; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .tv-legend-items { display: flex; gap: 60px; }
        .tv-cell-label { font-size: 18px; }
        .tv-cell-empty-label { font-size: 14px; }

        /* RESPONSIVE STYLES (Mobile & Tablet / Lebar Layar < 1024px) */
        @media (max-width: 1024px) {
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
          .tv-th-jam { width: 80px; padding: 12px 4px; font-size: 10px; }
          .tv-th-day { font-size: 14px; padding: 12px 8px; }
          .tv-td-lap { padding: 12px 6px; width: 60px; }
          .tv-td-lap-num { font-size: 40px; }
          .tv-td-lap-status { font-size: 10px; padding: 4px 8px; margin-top: 10px; }
          .tv-td-jam { width: 80px; padding: 8px; }
          .tv-td-jam-val { font-size: 22px; }
          .tv-cell-label { font-size: 12px; }
          .tv-cell-empty-label { font-size: 9px; }
          .tv-footer { flex-direction: column; gap: 16px; padding: 16px; text-align: center; }
          .tv-legend-items { flex-wrap: wrap; justify-content: center; gap: 16px 24px; }
          .tv-legend-items > div { gap: 8px !important; }
          .tv-legend-items span { font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
}
