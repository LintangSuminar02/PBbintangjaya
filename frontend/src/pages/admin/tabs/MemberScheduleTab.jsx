import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarRange, ShieldCheck, Plus, Edit, Trash2, X, Search } from 'lucide-react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu', 'Minggu'];
const HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00'];

const emptyForm = { member_name: '', court_id: '', day_of_week: 1, start_time: '08:00', end_time: '10:00', notes: '', is_active: true };

const MemberScheduleTab = ({ courts, API_URL }) => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_URL}/member-schedules`);
      setMembers(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (m) => { setForm({ ...m }); setEditingId(m.id); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await fetch(`${API_URL}/member-schedules/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(`${API_URL}/member-schedules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setShowForm(false);
      fetchMembers();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleToggle = async (id, current) => {
    await fetch(`${API_URL}/member-schedules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    });
    fetchMembers();
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus jadwal member ini?')) return;
    await fetch(`${API_URL}/member-schedules/${id}`, { method: 'DELETE' });
    fetchMembers();
  };

  const filteredMembers = members.filter(m => 
    m.member_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A4B9F] mb-1">Jadwal Tetap Member PB</h1>
          <p className="text-zinc-500 text-sm">Jadwal ini otomatis tampil di papan setiap minggu dan tidak bisa dipesan oleh pengguna umum.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text"
              placeholder="Cari nama PB..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <button
            onClick={openAdd}
            className="bg-[#1A4B9F] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Tambah Member
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 p-5 bg-white rounded-2xl border border-zinc-100 shadow-sm w-fit">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-purple-100 border border-purple-300" />
          <span className="text-xs font-bold text-zinc-500">Jadwal Aktif Member PB</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-lg bg-zinc-100 border border-dashed border-zinc-300" />
          <span className="text-xs font-bold text-zinc-400">Jadwal Nonaktif</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F8F9FB] border-b border-zinc-100">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Nama Member</th>
              <th className="px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Lapangan</th>
              <th className="px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hari</th>
              <th className="px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Jam</th>
              <th className="px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Catatan</th>
              <th className="px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
              <th className="px-4 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredMembers.length === 0 && (
              <tr><td colSpan={7} className="px-8 py-16 text-center text-zinc-400 text-sm font-medium">Belum ada jadwal member PB atau tidak ada hasil pencarian.</td></tr>
            )}
            {filteredMembers.map((m, i) => (
              <tr key={i} className={`transition-colors ${m.is_active ? 'hover:bg-purple-50/20' : 'opacity-50 hover:bg-zinc-50'}`}>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-bold text-zinc-800">{m.member_name}</span>
                  </div>
                </td>
                <td className="px-4 py-5 text-sm font-medium text-zinc-700">
                  {courts.find(c => c.id === m.court_id)?.name || `Court ${m.court_id}`}
                </td>
                <td className="px-4 py-5">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-black">
                    {DAYS[m.day_of_week - 1]}
                  </span>
                </td>
                <td className="px-4 py-5 text-sm font-mono font-bold text-zinc-700">
                  {m.start_time?.slice(0,5)} – {m.end_time?.slice(0,5)}
                </td>
                <td className="px-4 py-5 text-sm text-zinc-400 italic">{m.notes || '—'}</td>
                <td className="px-4 py-5">
                  <button
                    onClick={() => handleToggle(m.id, m.is_active)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${m.is_active ? 'bg-purple-500' : 'bg-zinc-200'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${m.is_active ? 'left-7' : 'left-1'}`} />
                  </button>
                </td>
                <td className="px-4 py-5 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEdit(m)} className="p-2 text-zinc-400 hover:text-[#1A4B9F] hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1A4B9F]">
                {editingId ? 'Edit Jadwal Member' : 'Tambah Jadwal Member PB'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-zinc-50 rounded-full">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* Member Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nama Member / Grup</label>
                <input type="text" value={form.member_name} onChange={e => set('member_name', e.target.value)} required
                  placeholder="cth: Budi Santoso / Tim Putra Senin"
                  className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4B9F]/20 text-sm" />
              </div>

              {/* Court & Day */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Lapangan</label>
                  <select value={form.court_id} onChange={e => set('court_id', parseInt(e.target.value))} required
                    className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4B9F]/20 text-sm">
                    <option value="">Pilih Lapangan</option>
                    {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Hari</label>
                  <select value={form.day_of_week} onChange={e => set('day_of_week', parseInt(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4B9F]/20 text-sm">
                    {DAYS.map((d, i) => <option key={i} value={i + 1}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Jam Mulai</label>
                  <select value={form.start_time} onChange={e => set('start_time', e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4B9F]/20 text-sm">
                    {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Jam Selesai</label>
                  <select value={form.end_time} onChange={e => set('end_time', e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4B9F]/20 text-sm">
                    {HOURS.filter(h => h > form.start_time).map(h => <option key={h} value={h}>{h}</option>)}
                    <option value="23:00">23:00</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Catatan (Opsional)</label>
                <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="cth: Sewa rutin bulanan, PB Garuda"
                  className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4B9F]/20 text-sm" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#1A4B9F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60">
                {loading ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Jadwal Member')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MemberScheduleTab;
