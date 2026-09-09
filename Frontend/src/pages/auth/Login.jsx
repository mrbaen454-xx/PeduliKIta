import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import authService from '../../services/authService';
import { ShieldCheck, Lock, Eye, EyeOff, AtSign, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const message = location.state?.message;

  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) meta.content = 'width=device-width, initial-scale=1.0';
    return () => {
      if (meta) meta.content = 'width=1280';
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await authService.login(formData);
      const { user, token } = res.data;
      
      login(user, token);
      showToast('Login berhasil', 'success');
      
      if (user.role === 'CAMPAIGNER') {
        navigate('/campaigner/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'DONOR') {
        navigate('/donor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-background flex p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row rounded-3xl overflow-hidden bg-[var(--color-surface-container)]/70 backdrop-blur-2xl border border-[var(--color-primary)]/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)]">
      
      {/* LEFT COLUMN: Visual & Branding */}
      <div className="hidden lg:flex w-full lg:w-1/2 flex-col justify-between p-10 xl:p-16 relative bg-surface-container-low/40">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-primary-fixed text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Akses Masuk Platform Terverifikasi
          </div>
          
          <h1 className="text-display-sm font-serif font-bold text-on-surface leading-tight mb-4 max-w-lg">
            Lanjutkan Langkah Nyata, <br/>
            <span className="text-primary italic font-medium">Hubungkan Kebaikan.</span>
          </h1>
          
          <p className="text-body-lg text-on-surface-variant max-w-md leading-relaxed">
            Masuk ke akun Anda untuk mengelola donasi kemanusiaan, memantau laporan penyaluran bantuan, atau memperbarui perkembangan program sosial gotong royong.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80" 
              alt="Penyaluran Bantuan" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center gap-1.5 text-primary-fixed mb-2 text-xs font-bold tracking-wider uppercase">
                <CheckCircle2 className="w-4 h-4" /> Dokumentasi Penyaluran Amanah Publik
              </div>
              <p className="text-white text-title-md font-bold leading-snug mb-1">
                "Bukan hanya tentang materi yang tersalurkan, tapi tentang menyalakan kembali harapan mereka yang merasa sendiri."
              </p>
              <p className="text-surface-variant text-xs opacity-80">
                Relawan Lapangan Posko PeduliKita Nusantara
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-outline-variant/50 pt-6 mt-8">
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-primary" /> Enkripsi Token JWT Standar Industri
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <Lock className="w-4 h-4 text-primary" /> Sesi Terisolasi & Akses Berbasis Peran (RBAC)
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 xl:p-20 relative overflow-y-auto scrollbar-hide">
        <div className="w-full max-w-[420px] bg-surface-container-lowest/90 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-outline-variant/30">
          <h2 className="text-headline-md font-bold text-on-surface mb-2 tracking-tight">Masuk ke Akun</h2>
          <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
            Gunakan alamat email dan kata sandi yang terdaftar di PeduliKita.
          </p>

          {message && (
            <div className="mb-6 p-4 bg-primary-fixed text-primary border border-primary/20 rounded-lg text-[13px] font-medium flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <p className="text-xs text-outline mt-2">Gunakan email yang terdaftar saat registrasi akun.</p>
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
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium tracking-widest placeholder:tracking-normal transition-all"
                  required
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
              className="w-full py-4 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-base transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Memeriksa Kredensial...' : 'Masuk ke Akun'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <hr className="w-full border-outline-variant" />
            <span className="p-2 px-4 text-xs text-outline font-medium whitespace-nowrap">Belum memiliki akun?</span>
            <hr className="w-full border-outline-variant" />
          </div>

          <Link
            to="/register"
            className="mt-6 w-full flex justify-center py-3.5 bg-surface-container-lowest border border-primary/20 text-primary hover:bg-primary-fixed hover:border-primary/40 rounded-xl font-bold text-sm transition-colors"
          >
            Daftar Akun Baru PeduliKita
          </Link>
          
          <p className="text-xs text-outline text-center mt-8 px-4 leading-relaxed">
            Autentikasi langsung via sistem terverifikasi PeduliKita. Data dan hak akses dilindungi sepenuhnya sesuai standar privasi nirlaba.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
