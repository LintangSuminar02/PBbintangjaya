import React, { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Shield, Key, Mail, User, X, Check, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SettingsTab = ({ API_URL }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'admin'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('API did not return an array:', data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingUser ? `${API_URL}/users/${editingUser.id}` : `${API_URL}/users`;
      const method = editingUser ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ username: '', password: '', name: '', email: '', role: 'admin' });
        fetchUsers();
      } else {
        alert(data.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // Biarkan kosong jika tidak ingin ganti
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'admin'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus admin ini?')) return;
    try {
      const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchUsers();
    } catch (err) {
      alert('Gagal menghapus');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1A4B9F] mb-1">Manajemen Admin</h1>
          <p className="text-zinc-400 text-sm font-medium">Kelola akun pengelola yang memiliki akses ke sistem PB Bintang Jaya.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({ username: '', password: '', name: '', email: '', role: 'admin' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#1A4B9F] text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Tambah Admin
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Admin</th>
              <th className="p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Kontak</th>
              <th className="p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Peran</th>
              <th className="p-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1A4B9F]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-800">{user.name || 'Admin'}</p>
                      <p className="text-xs text-zinc-400 font-mono">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Mail className="w-4 h-4 opacity-40" />
                    <span className="text-sm font-medium">{user.email || '-'}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full border border-emerald-100">
                    {user.role}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="p-2 text-zinc-400 hover:text-[#1A4B9F] hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-20 text-center">
            <Shield className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
            <p className="text-zinc-400 font-bold">Belum ada akun admin terdaftar</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <div>
                  <h3 className="text-xl font-bold text-[#1A4B9F]">{editingUser ? 'Edit Admin' : 'Tambah Admin'}</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Identitas & Keamanan</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                      <input 
                        required
                        type="text" 
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                        placeholder="admin_bintang"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Password {editingUser && '(Kosongkan jika tidak diubah)'}</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                      <input 
                        required={!editingUser}
                        type="password" 
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                        placeholder="Budi Jaya"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                        placeholder="admin@mail.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-2xl font-bold text-zinc-400 hover:bg-zinc-50 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#1A4B9F] text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Proses...' : editingUser ? 'Update Admin' : 'Buat Akun'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsTab;
