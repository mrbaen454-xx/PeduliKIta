import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import campaignService from '../../services/campaignService';
import donationService from '../../services/donationService';
import { Loading, ErrorMessage } from '../../components/common/UIStates';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  ArrowLeft, MapPin, CheckCircle2, Shield, UploadCloud, 
  Trash2, Building, Clock, Activity, FileText, Copy
} from 'lucide-react';

const DonationFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    amount: '',
    message: '',
    isAnonymous: false
  });
  const [proofFile, setProofFile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { message: 'Silakan masuk untuk melakukan donasi.' } });
      return;
    }
    
    const fetchDetail = async () => {
      try {
        const res = await campaignService.getCampaignById(id);
        setCampaign(res.data);
      } catch (err) {
        setError('Gagal memuat informasi kampanye.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB', 'error');
        return;
      }
      setProofFile(file);
    }
  };

  const removeFile = () => {
    setProofFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast(`Berhasil menyalin rekening: ${text}`, 'success');
  };

  const presetAmounts = [50000, 100000, 250000, 500000];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) < 10000) {
      setSubmitError('Minimal donasi adalah Rp 10.000');
      return;
    }
    if (!proofFile) {
      setSubmitError('Bukti transfer wajib diunggah untuk verifikasi.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const data = new FormData();
    data.append('campaignId', id);
    data.append('amount', formData.amount);
    data.append('message', formData.message);
    data.append('isAnonymous', formData.isAnonymous);
    data.append('proofImage', proofFile);

    try {
      await donationService.createDonation(data);
      showToast('Donasi berhasil dikirim dan menunggu verifikasi admin!', 'success');
      navigate(user.role === 'DONOR' ? '/donor/donations' : '/');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Gagal mengirim donasi.');
      showToast(err.response?.data?.message || 'Gagal mengirim donasi.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loading /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-background"><ErrorMessage message={error} /></div>;
  if (!campaign) return null;

  const progress = Math.min(((campaign.collected_amount || 0) / (campaign.target_amount || 1)) * 100, 100);
  const remaining = Math.max((campaign.target_amount || 0) - (campaign.collected_amount || 0), 0);
  
  // Calculate days remaining
  const daysRemaining = campaign.end_date ? Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  
  // Get file size in MB
  const fileSizeInMB = proofFile ? (proofFile.size / (1024 * 1024)).toFixed(1) : 0;

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-primary-fixed selection:text-on-primary-fixed pb-24">
      <main className="px-4 md:px-6 lg:px-8 max-w-[1240px] mx-auto pt-6">
        


        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: CAMPAIGN SUMMARY */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
              <div className="relative h-64">
                <img 
                  src={getImageUrl(campaign.image_url)} 
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 bg-surface-container-lowest/95 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur">
                      <Shield className="w-3.5 h-3.5" /> Terverifikasi
                    </div>
                    <div className="bg-error-container/95 text-on-error-container px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur max-w-fit">
                      {campaign.category?.name || 'Tanggap Bencana'}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="flex items-center gap-1 text-white text-xs font-bold drop-shadow-md">
                    <MapPin className="w-3.5 h-3.5" /> Demak & Kudus, Jawa Tengah
                  </div>
                  <div className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {campaign.status}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h1 className="text-headline-sm font-serif font-bold text-on-surface mb-6 leading-tight">
                  {campaign.title}
                </h1>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-primary font-bold">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-outline uppercase tracking-wider font-bold mb-0.5">Penggalang Dana Terpercaya</p>
                    <p className="text-[13px] font-bold text-on-surface">{campaign.campaigner?.name || 'Relawan Siaga Bencana Jawa Tengah'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold tracking-wider text-outline uppercase">Dana Terkumpul</span>
                <span className="text-xs font-bold text-primary">{Math.round(progress)}% Tercapai</span>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-stat-lg font-bold text-primary">{formatCurrency(campaign.collected_amount)}</span>
                <span className="text-[13px] font-medium text-outline">/ {formatCurrency(campaign.target_amount)}</span>
              </div>
              
              <div className="w-full bg-surface-container rounded-full h-2.5 mb-4 overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center text-xs font-medium mb-6">
                <span className="text-on-surface-variant">Sisa Target: <strong className="text-on-surface">{formatCurrency(remaining)}</strong></span>
                {daysRemaining > 0 && (
                  <span className="flex items-center gap-1 text-on-surface-variant">
                    <Clock className="w-3.5 h-3.5" /> {daysRemaining} Hari Lagi
                  </span>
                )}
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex gap-3 text-xs text-on-surface-variant leading-relaxed">
                <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p>Setiap rupiah disalurkan secara berkala langsung untuk pembelian tangki air bersih keliling, makanan siap saji, dan obat-obatan warga pengungsi.</p>
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
              <div className="flex items-center gap-2 mb-3">
                <Building className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-on-surface">Rekening Resmi Penampungan Donasi</h3>
              </div>
              <p className="text-[13px] text-on-surface-variant mb-5">
                Silakan lakukan transfer mandiri ke rekening-rekening resmi yayasan sebelum mengunggah struk bukti transfer:
              </p>
              
              <div className="space-y-3">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">BCA (Bank Central Asia)</p>
                    <p className="text-stat-md font-bold text-on-surface tracking-widest mb-1">8420 891 002</p>
                    <p className="text-xs text-on-surface-variant">a.n. Yayasan PeduliKita Indonesia</p>
                  </div>
                  <button onClick={() => copyToClipboard('8420891002')} className="px-3 py-1.5 bg-surface-container-low text-primary border border-outline-variant rounded text-xs font-bold hover:bg-surface-container transition-colors flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </button>
                </div>
                
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Bank Mandiri</p>
                    <p className="text-stat-md font-bold text-on-surface tracking-widest mb-1">137 00 9923 1184</p>
                    <p className="text-xs text-on-surface-variant">a.n. Yayasan PeduliKita Indonesia</p>
                  </div>
                  <button onClick={() => copyToClipboard('1370099231184')} className="px-3 py-1.5 bg-surface-container-low text-primary border border-outline-variant rounded text-xs font-bold hover:bg-surface-container transition-colors flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
              <div className="p-6 md:p-8 border-b border-outline-variant">
                <p className="text-xs font-bold tracking-wider text-primary uppercase mb-2">Formulir Amal Manual</p>
                <h2 className="text-headline-md font-serif font-bold text-on-surface mb-2">Salurkan Kebaikan Anda</h2>
                <p className="text-sm text-on-surface-variant">Isi rincian donasi dan sertakan foto bukti transfer untuk kami catat dan verifikasi.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
                
                {/* 1. Nominal Donasi */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-bold text-on-surface">1. Nominal Donasi <span className="text-error">*</span></label>
                    <span className="text-xs font-medium text-outline">Min. Rp 10.000</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {presetAmounts.map((amt) => {
                      const isSelected = Number(formData.amount) === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormData({ ...formData, amount: amt })}
                          className={`py-2.5 rounded font-bold text-sm transition-colors border ${
                            isSelected 
                              ? 'bg-primary text-white border-primary shadow-sm' 
                              : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container hover:border-primary/30'
                          }`}
                        >
                          Rp {amt.toLocaleString('id-ID')}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className={`relative flex items-center bg-surface-container-lowest rounded-lg border-2 transition-colors ${Number(formData.amount) > 0 ? 'border-primary/30 bg-primary-fixed/5' : 'border-outline-variant hover:border-outline'}`}>
                    <span className="pl-6 font-bold text-xl text-on-surface-variant">Rp</span>
                    <input
                      name="amount"
                      type="number"
                      min="10000"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Masukkan nominal lainnya..."
                      required
                      className="w-full py-5 px-4 bg-transparent text-stat-lg font-bold text-on-surface focus:outline-none placeholder:text-outline/50 placeholder:font-medium placeholder:text-[18px]"
                    />
                  </div>
                </div>

                {/* 2. Pesan Dukungan */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-sm font-bold text-on-surface">2. Doa atau Pesan Dukungan <span className="font-normal text-outline">(Opsional)</span></label>
                    <span className="text-xs font-medium text-outline">{formData.message.length} / 250</span>
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    maxLength="250"
                    rows="4"
                    placeholder="Tuliskan doa kebaikan atau kata penyemangat untuk saudara kita di Demak & Kudus..."
                    className="w-full p-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-colors text-sm placeholder:text-outline"
                  ></textarea>
                </div>

                {/* Anonymous Toggle */}
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 flex items-center justify-between cursor-pointer" onClick={() => setFormData(prev => ({...prev, isAnonymous: !prev.isAnonymous}))}>
                  <div>
                    <p className="font-bold text-sm text-on-surface mb-0.5">Donasi sebagai Hamba Allah (Anonim)</p>
                    <p className="text-xs text-on-surface-variant">Nama Anda tidak akan ditampilkan secara publik di daftar pendukung dan transparansi umum.</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${formData.isAnonymous ? 'bg-primary' : 'bg-outline-variant'}`}>
                    <div className={`w-4 h-4 bg-surface-container-lowest rounded-full transition-transform ${formData.isAnonymous ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>

                {/* 3. Unggah Bukti */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-bold text-on-surface">3. Unggah Bukti Transfer <span className="text-error">*</span></label>
                    <span className="text-xs font-medium text-outline">JPG, PNG, PDF maks. 5MB</span>
                  </div>
                  
                  {!proofFile ? (
                    <div 
                      className="border-2 border-dashed border-primary/30 bg-primary-fixed/10 hover:bg-primary-fixed/20 transition-colors rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer text-center group"
                      onClick={() => document.getElementById('proof-upload').click()}
                    >
                      <div className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center text-primary shadow-sm mb-4 group-hover:scale-105 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-sm text-on-surface mb-1">Klik untuk pilih berkas atau seret ke sini</p>
                      <p className="text-xs text-on-surface-variant">Pastikan tanggal dan nominal transfer tampak jelas</p>
                    </div>
                  ) : (
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 bg-primary-fixed rounded flex items-center justify-center text-primary shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[13px] text-on-surface truncate">{proofFile.name}</p>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1">
                            {fileSizeInMB} MB <span className="w-1 h-1 bg-outline rounded-full"></span> 
                            <span className="text-primary font-bold">Berhasil dilampirkan</span>
                          </p>
                        </div>
                      </div>
                      <button type="button" onClick={removeFile} className="p-2 text-outline hover:text-error hover:bg-error-container/50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <input id="proof-upload" ref={fileInputRef} name="proofImage" type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only" onChange={handleFileChange} />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-lg bg-primary hover:bg-primary-container text-white font-bold text-base shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Mengirim Data...' : 'Kirim Donasi & Bukti Transfer'}
                  </button>
                  <p className="text-center text-xs text-outline mt-3">
                    Dengan mengirim donasi, Anda menyetujui syarat penyaluran bantuan kemanusiaan PeduliKita.
                  </p>
                </div>

              </form>
            </div>

            {/* Verification Steps */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-on-surface">Alur Verifikasi Donasi Transparan</h3>
              </div>
              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                PeduliKita menerapkan audit manual ketat guna memastikan pertanggungjawaban dana publik 100% tepat sasaran:
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mb-3">1</div>
                  <h4 className="font-bold text-xs text-on-surface mb-2">Unggah Bukti</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Donatur mengisi formulir dan menyertakan foto struk pembayaran asli.</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center">2</div>
                    <span className="bg-error-container/80 text-on-error-container px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Status: Pending</span>
                  </div>
                  <h4 className="font-bold text-xs text-on-surface mb-2">Audit Internal</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Admin memeriksa kesesuaian mutasi rekening vs bukti yang dikirim.</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center">3</div>
                    <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Verified</span>
                  </div>
                  <h4 className="font-bold text-xs text-on-surface mb-2">Tercatat Sah</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Total donasi kampanye terbaru otomatis di laman publik.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-outline font-medium pt-4 border-t border-outline-variant/50">
                <Shield className="w-3.5 h-3.5" /> Diawasi dan diaudit oleh Akuntan Publik Independen setiap akhir kuartal.
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DonationFormPage;
