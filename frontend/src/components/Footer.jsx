import React from 'react';
import { MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-zinc-950 text-zinc-400 py-12 px-8 border-t border-zinc-800/60 font-sans">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
      
      {/* Brand Column */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain brightness-95 filter" 
            onError={(e) => {
              e.target.style.display = 'none';
            }} 
          />
          <span className="text-xl font-black text-white tracking-wide uppercase">HALL BINTANG JAYA SPORT</span>
        </div>
        <p className="text-xs text-zinc-500 max-w-sm mt-1 leading-relaxed">
          Sistem pemesanan lapangan bulu tangkis premium dengan manajemen jadwal FCFS real-time.
        </p>
        <p className="text-[11px] text-zinc-600 mt-2">
          © 2026 HALL BINTANG JAYA SPORT All rights reserved.
        </p>
      </div>

      {/* Location Column */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 w-full">
        <h4 className="text-xs font-bold text-white uppercase tracking-widest text-emerald-400">Lokasi Kami</h4>
        <a 
          href="https://maps.app.goo.gl/THsnUf3YsCd5Ptx3A"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-sm rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-lg group hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col cursor-pointer"
        >
          {/* Top Address part */}
          <div className="flex gap-3 items-start p-4 w-full">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left gap-1">
              <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                HALL BADMINTON BINTANG JAYA SPORT
              </span>
              <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors leading-relaxed">
                Dusun 1, Bojanegara, Kec. Padamara, Kabupaten Purbalingga, Jawa Tengah 53372
              </span>
            </div>
          </div>

          {/* Bottom Embedded Map Part - Clickable Overlay for Direct Link Redirect */}
          <div className="w-full h-40 relative overflow-hidden bg-zinc-950 border-t border-zinc-800/80">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.843640242226!2d109.33322237466847!3d-7.384892092624595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6559007e00a88b%3A0x710e8ef1301fe8fa!2sHALL%20BADMINTON%20BINTANG%20JAYA%20SPORT!5e0!3m2!1sid!2sid!4v1716104800000!5m2!1sid!2sid"
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(10%) contrast(90%)' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="transition-all duration-500 group-hover:scale-105"
            ></iframe>
            {/* Transparent click catcher to trigger parent anchor navigation on all platforms */}
            <div className="absolute inset-0 bg-transparent z-10"></div>
            <div className="absolute inset-0 pointer-events-none border-t border-zinc-800/80 group-hover:border-emerald-500/10 transition-all duration-300"></div>
          </div>
        </a>
      </div>

      {/* Links Column */}
      <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4 h-full md:justify-start">
        <h4 className="text-xs font-bold text-white uppercase tracking-widest text-zinc-500">Informasi</h4>
        <div className="flex flex-col gap-3 font-semibold text-xs text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Ketentuan Layanan</a>
          <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-white transition-colors">Hubungi Dukungan</a>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
