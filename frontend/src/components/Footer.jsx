import React from 'react';

const Footer = () => (
  <footer className="bg-zinc-900 text-zinc-400 py-12 px-8 border-t border-zinc-800">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-center md:text-left flex flex-col items-center md:items-start gap-2">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain grayscale opacity-50 mb-2" />
        <span className="text-2xl font-bold text-white block">PB Bintang Jaya</span>
        <p className="text-sm">© 2026 PB Bintang Jaya and Lintang STW. All rights reserved.</p>
      </div>
      <div className="flex gap-10 flex-wrap justify-center font-bold text-xs uppercase tracking-widest">
        <a href="#" className="hover:text-white transition-colors">Ketentuan Layanan</a>
        <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
        <a href="#" className="hover:text-white transition-colors">Hubungi Dukungan</a>
      </div>
    </div>
  </footer>
);

export default Footer;
