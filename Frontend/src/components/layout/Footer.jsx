import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const isCampaignerOrAdmin = user?.role === 'CAMPAIGNER' || user?.role === 'ADMIN';

  return (
    <footer className="bg-[#17251C] pt-16 pb-8 text-[#A3B8AC]">
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold font-serif text-2xl mb-4">
              <HeartPulse className="w-6 h-6 text-primary-fixed" /> PeduliKita
            </div>
            <p className="text-[13px] leading-relaxed mb-6">
              Platform menggalangan dana dan donasi online yang tepercaya aman. Berbagi ruang empati kebaikan seketika untuk Indonesia.
            </p>
            <div className="flex items-center gap-2 text-xs text-white">
              <ShieldCheck className="w-4 h-4 text-primary-fixed" /> Terdaftar dan diawasi lembaga kelembagaan.
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Navigasi</h4>
            <ul className="space-y-3 text-sm">
              {isCampaignerOrAdmin ? (
                <>
                  <li><span className="text-[#A3B8AC]/50 cursor-not-allowed">Beranda</span></li>
                  <li><span className="text-[#A3B8AC]/50 cursor-not-allowed">Kampanye</span></li>
                  <li><span className="text-[#A3B8AC]/50 cursor-not-allowed">Cara Kerja</span></li>
                </>
              ) : (
                <>
                  <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
                  <li><Link to="/campaigns" className="hover:text-white transition-colors">Kampanye</Link></li>
                  <li><a href="/#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a></li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Program Sosial</h4>
            <ul className="space-y-3 text-sm">
              {isCampaignerOrAdmin ? (
                <>
                  <li><span className="text-[#A3B8AC]/50 cursor-not-allowed">Bantuan Medis</span></li>
                  <li><span className="text-[#A3B8AC]/50 cursor-not-allowed">Pendidikan Anak</span></li>
                  <li><span className="text-[#A3B8AC]/50 cursor-not-allowed">Tanggap Bencana</span></li>
                  <li><span className="text-[#A3B8AC]/50 cursor-not-allowed">Fasilitas Air</span></li>
                </>
              ) : (
                <>
                  <li><Link to="/campaigns?category=Bantuan%20Medis%20&%20Kesehatan" className="hover:text-white transition-colors">Bantuan Medis</Link></li>
                  <li><Link to="/campaigns?category=Pendidikan%20&%20Fasilitas" className="hover:text-white transition-colors">Pendidikan Anak</Link></li>
                  <li><Link to="/campaigns?category=Tanggap%20Bencana%20Alam" className="hover:text-white transition-colors">Tanggap Bencana</Link></li>
                  <li><Link to="/campaigns?category=Infrastruktur%20Air%20Bersih" className="hover:text-white transition-colors">Fasilitas Air</Link></li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Keamanan</h4>
            <ul className="space-y-3 text-sm">
              <li>Verifikasi Multi Tahap</li>
              <li>Enkripsi SSL</li>
              <li>Audit Keuangan Rutin</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#24342c] pt-8 flex flex-row justify-between items-center text-xs gap-4">
          <p>&copy; {new Date().getFullYear()} Yayasan PeduliKita Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
