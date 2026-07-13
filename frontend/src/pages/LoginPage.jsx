import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Users, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const LoginPage = ({ onLogin, API_URL }) => {
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        addToast('Selamat datang kembali, Admin!', 'success');
        onLogin();
      } else {
        addToast(data.message || 'Username atau password salah', 'error');
      }
    } catch (err) {
      addToast('Gagal terhubung ke server', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-[80vh] flex items-center justify-center pt-20 px-8"
    >
      <div className="bg-white p-10 rounded-[32px] shadow-2xl border border-zinc-100 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#1A4B9F]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#1A4B9F]" />
          </div>
          <h2 className="text-3xl font-bold text-[#1A4B9F] mb-2">Login Admin</h2>
          <p className="text-zinc-400 text-sm">Akses terbatas untuk personel HALL BINTANG JAYA SPORT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Username</label>
            <div className="relative">
               <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
               <input 
                 type="text" 
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full bg-zinc-50 rounded-2xl py-4 pl-12 pr-4 border border-zinc-100 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                 placeholder="admin_bintang"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Kata Sandi</label>
            <div className="relative">
               <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
               <input 
                 type={showPassword ? "text" : "password"} 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-zinc-50 rounded-2xl py-4 pl-12 pr-12 border border-zinc-100 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                 placeholder="••••••••"
               />
               <button 
                 type="button" 
                 onClick={() => setShowPassword(!showPassword)} 
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
               >
                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#1A4B9F] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Mengautentikasi...' : 'Masuk ke Dasbor'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginPage;
