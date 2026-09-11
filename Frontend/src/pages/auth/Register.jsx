import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';
import { ShieldCheck, Lock, Eye, EyeOff, AtSign, User, Users, CheckCircle2 } from 'lucide-react';
import ModernSelect from '../../components/common/ModernSelect';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DONOR'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Removed the manual viewport scale override as it breaks responsiveness 
    // globally when unmounting.
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authService.register(formData);
      showToast('Registrasi berhasil! Silakan masuk ke akun Anda.', 'success');
      navigate('/login', { state: { message: 'Registrasi berhasil! Silakan masuk ke akun Anda.' } });
    } catch (err) {
      showToast(err.response?.data?.message || 'Registrasi gagal. Coba email lain.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-background flex p-2 sm:p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col-reverse lg:flex-row rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)]">
      
      {/* LEFT COLUMN: Form (Mirrored for distinction) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-12 xl:p-20 relative overflow-y-auto scrollbar-hide py-8">
        <div className="w-full max-w-[420px] bg-surface-container-lowest/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-outline-variant/30">
          <h2 className="text-headline-md font-bold text-on-surface mb-2 tracking-tight">Daftar Akun Baru</h2>
          <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
            Bergabung dengan PeduliKita dan mulailah aksi nyata untuk kebaikan bersama.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Nama Lengkap <span className="text-primary">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-5 h-5 absolute left-4 text-outline" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Budi Santoso"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Alamat Email <span className="text-primary">*</span>
              </label>
              <div className="relative flex items-center">
                <AtSign className="w-5 h-5 absolute left-4 text-outline" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="budi.santoso@pedulikita.org"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Peran Pengguna <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <ModernSelect
                  options={[
                    { value: 'DONOR', label: 'Donatur (Memberi Bantuan)' },
                    { value: 'CAMPAIGNER', label: 'Penggalang Dana (Membuat Kampanye)' }
                  ]}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  icon={Users}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Kata Sandi <span className="text-primary">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 absolute left-4 text-outline" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-11 pr-12 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium tracking-widest placeholder:tracking-normal transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-outline hover:text-on-surface-variant transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-base transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {loading ? 'Memproses Pendaftaran...' : 'Daftar Akun'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <hr className="w-full border-outline-variant" />
            <span className="p-2 px-4 text-xs text-outline font-medium whitespace-nowrap">Sudah memiliki akun?</span>
            <hr className="w-full border-outline-variant" />
          </div>

          <Link
            to="/login"
            className="mt-6 w-full flex justify-center py-3.5 bg-surface-container-lowest border border-primary/20 text-primary hover:bg-primary-fixed hover:border-primary/40 rounded-xl font-bold text-sm transition-colors"
          >
            Masuk ke Akun
          </Link>
          
        </div>
      </div>

      {/* RIGHT COLUMN: Visual & Branding */}
      <div className="hidden lg:flex w-full lg:w-1/2 flex-col justify-between p-10 xl:p-16 relative bg-surface-container-low/40 border-l border-white/50">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-primary-fixed text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            Akses Masuk Platform Terverifikasi
          </div>
          
          <h1 className="text-display-sm font-serif font-bold text-on-surface leading-tight mb-4 max-w-lg">
            Mulai Langkah Nyata, <br/>
            <span className="text-primary italic font-medium">Berdampak Bersama.</span>
          </h1>
          
          <p className="text-body-lg text-on-surface-variant max-w-md leading-relaxed">
            PeduliKita mengamankan sistem pendataan para pihak secara ketat agar setiap aliran donasi kemanusiaan dapat dipertanggungjawabkan dari hulu ke hilir.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1200&q=80" 
              alt="Penyaluran Bantuan" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center gap-1.5 text-primary-fixed mb-2 text-xs font-bold tracking-wider uppercase">
                <CheckCircle2 className="w-4 h-4" /> Komunitas yang Solid
              </div>
              <p className="text-white text-title-md font-bold leading-snug mb-1">
                "Satu tindakan nyata sekecil apa pun, bernilai jauh lebih tinggi daripada jutaan niat yang hanya diucapkan."
              </p>
              <p className="text-surface-variant text-xs opacity-80">
                Pendaftaran Terbuka PeduliKita Nusantara
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-outline-variant/50 pt-6 mt-8">
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-primary" /> Enkripsi Token JWT Standar Industri
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <Lock className="w-4 h-4 text-primary" /> Transparansi Data Lintas Sektoral
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default Register;
