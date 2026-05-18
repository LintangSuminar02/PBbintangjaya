import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Mail, LogIn, UserPlus } from 'lucide-react';

const UserLoginModal = ({ API_URL, onSuccess, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleLogin = async () => {
    if (!form.username || !form.password) return setError('Mohon isi semua field.');
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (data.success && data.user.role !== 'admin') {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        onSuccess(data.user);
      } else if (data.user?.role === 'admin') {
        setError('Akun admin tidak bisa digunakan untuk booking.');
      } else {
        setError(data.message || 'Username atau password salah.');
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.username || !form.password || !form.email) return setError('Mohon isi semua field.');
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password, email: form.email }),
      });
      const data = await res.json();
      if (data.success) {
        // Auto-login after register
        const loginRes = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: form.username, password: form.password }),
        });
        const loginData = await loginRes.json();
        if (loginData.success) {
          localStorage.setItem('userToken', loginData.token);
          localStorage.setItem('currentUser', JSON.stringify(loginData.user));
          onSuccess(loginData.user);
        }
      } else {
        setError(data.message || 'Gagal mendaftar. Username mungkin sudah dipakai.');
      }
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-gradient-to-r from-[#1A4B9F]/5 to-transparent">
          <div>
            <h2 className="text-xl font-black text-[#1A4B9F]">
              {mode === 'login' ? 'Login untuk Booking' : 'Daftar Akun Baru'}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {mode === 'login' ? 'Masuk untuk melanjutkan pemesanan lapangan' : 'Buat akun dan langsung booking'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-5">
          {/* Tab switcher */}
          <div className="flex bg-zinc-100 rounded-2xl p-1">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'login' ? 'bg-white shadow-sm text-[#1A4B9F]' : 'text-zinc-400'}`}
            >
              <LogIn className="w-4 h-4" /> Masuk
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${mode === 'register' ? 'bg-white shadow-sm text-[#1A4B9F]' : 'text-zinc-400'}`}
            >
              <UserPlus className="w-4 h-4" /> Daftar
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={e => set('username', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
                className="w-full bg-zinc-50 border border-zinc-100 pl-11 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4B9F]/20 text-sm"
              />
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-100 pl-11 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4B9F]/20 text-sm"
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
                className="w-full bg-zinc-50 border border-zinc-100 pl-11 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4B9F]/20 text-sm"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-[#1A4B9F] text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? 'Memproses...' : (mode === 'login' ? 'Masuk & Lanjut Booking' : 'Daftar & Mulai Booking')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLoginModal;
