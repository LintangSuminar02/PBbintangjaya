import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Edit, X, Upload, Trash2, Plus } from 'lucide-react';

const STATUS_OPTIONS = ['Active', 'Maintenance', 'Repair'];
const TYPE_OPTIONS   = ['Sintetis', 'Parquet', 'Vinyl', 'Kayu'];

const EMPTY_COURT = {
  name: '', type: 'Sintetis', location: '', price: 35000, price_night: 40000, status: 'Active', image: ''
};

// --- SUB-COMPONENT: CourtCard ---
const CourtCard = ({ c, i, setEditingCourt, onDeleteCourt }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden group"
    >
      <div className="h-40 bg-zinc-100 relative overflow-hidden">
        {(imgError || !c.image) ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span className="text-[10px] font-bold uppercase mt-2 tracking-widest opacity-50">No Image</span>
          </div>
        ) : (
          <img 
            src={c.image} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt={c.name}
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${
            c.status === 'Active' ? 'bg-emerald-500' :
            c.status === 'Maintenance' ? 'bg-amber-500' : 'bg-rose-500'
          }`}>
            {c.status}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-zinc-800">{c.name}</h3>
        <p className="text-xs text-zinc-400 mb-4">{c.type} • {c.location || '—'}</p>
        <div className="flex justify-between items-center pt-4 border-t border-zinc-50">
          <div className="flex flex-col text-xs font-bold text-[#1A4B9F]">
            <span>☀️ Siang: Rp {c.price?.toLocaleString()}</span>
            <span>🌙 Malam: Rp {(c.price_night || (c.price + 5000))?.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditingCourt(c)} className="p-2 text-zinc-400 hover:text-[#1A4B9F] hover:bg-blue-50 rounded-lg transition-all">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => window.confirm(`Hapus ${c.name}?`) && onDeleteCourt(c.id)} className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- SUB-COMPONENT: ImageDropZone ---
const ImageDropZone = ({ obj, setter }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/30');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setter({ ...obj, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Foto Lapangan</label>
      <div
        onDragOver={e => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.add('border-blue-400', 'bg-blue-50/30'); }}
        onDragLeave={e => { e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50/30'); }}
        onDrop={handleDrop}
        className="w-full h-40 border-2 border-dashed border-zinc-100 rounded-[24px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-zinc-50 transition-all relative overflow-hidden group"
      >
        {obj.image ? (
          <>
            <img src={obj.image} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="preview" />
            <div className="relative z-10 flex flex-col items-center">
              <Upload className="w-8 h-8 text-[#1A4B9F]" />
              <p className="text-xs font-bold text-[#1A4B9F]">Ganti Foto</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 text-zinc-300" />
            <p className="text-xs font-medium text-zinc-400 mt-2">Tarik foto ke sini</p>
          </div>
        )}
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setter({ ...obj, image: reader.result });
            reader.readAsDataURL(file);
          }
        }} />
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const CourtsTab = ({ courts, editingCourt, setEditingCourt, onUpdateCourt, onAddCourt, onDeleteCourt }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCourt, setNewCourt] = useState(EMPTY_COURT);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#1A4B9F]">Manajemen Lapangan</h1>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-[#1A4B9F] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-all">
          <Plus className="w-4 h-4" /> Tambah Lapangan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courts.map((c, i) => (
          <CourtCard key={c.id} c={c} i={i} setEditingCourt={setEditingCourt} onDeleteCourt={onDeleteCourt} />
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-[#1A4B9F]">Tambah Lapangan</h3>
              <button onClick={() => setIsAdding(false)}><X className="w-6 h-6 text-zinc-400" /></button>
            </div>
            <form className="p-8 space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              await onAddCourt(newCourt);
              setNewCourt(EMPTY_COURT);
              setIsAdding(false);
            }}>
              <ImageDropZone obj={newCourt} setter={setNewCourt} />
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nama</label>
                <input type="text" value={newCourt.name} onChange={e => setNewCourt({...newCourt, name: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tipe</label>
                <select value={newCourt.type} onChange={e => setNewCourt({...newCourt, type: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none">
                  {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Harga Siang (08:00 - 17:00)</label>
                  <input type="number" value={newCourt.price} onChange={e => setNewCourt({...newCourt, price: e.target.value === '' ? '' : parseInt(e.target.value)})} className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Harga Malam (17:00 - 21:00+)</label>
                  <input type="number" value={newCourt.price_night} onChange={e => setNewCourt({...newCourt, price_night: e.target.value === '' ? '' : parseInt(e.target.value)})} className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none" required />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1A4B9F] text-white py-4 rounded-2xl font-bold shadow-xl">Simpan Lapangan</button>
            </form>
          </div>
        </div>
      )}

      {editingCourt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-[#1A4B9F]">Edit Lapangan</h3>
              <button onClick={() => setEditingCourt(null)}><X className="w-6 h-6 text-zinc-400" /></button>
            </div>
            <form className="p-8 space-y-6" onSubmit={onUpdateCourt}>
              <ImageDropZone obj={editingCourt} setter={setEditingCourt} />
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nama</label>
                <input type="text" value={editingCourt.name} onChange={e => setEditingCourt({...editingCourt, name: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tipe</label>
                <select value={editingCourt.type} onChange={e => setEditingCourt({...editingCourt, type: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none">
                  {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Harga Siang (08:00 - 17:00)</label>
                  <input type="number" value={editingCourt.price} onChange={e => setEditingCourt({...editingCourt, price: e.target.value === '' ? '' : parseInt(e.target.value)})} className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Harga Malam (17:00 - 21:00+)</label>
                  <input type="number" value={editingCourt.price_night || ''} onChange={e => setEditingCourt({...editingCourt, price_night: e.target.value === '' ? '' : parseInt(e.target.value)})} className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none" required />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1A4B9F] text-white py-4 rounded-2xl font-bold shadow-xl">Simpan Perubahan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtsTab;
