import React, { useEffect, useState } from 'react';
import { useCampaign } from '../../context/CampaignContext';
import CampaignCard from '../../components/campaign/CampaignCard';
import { Loading, ErrorMessage, EmptyState } from '../../components/common/UIStates';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, GraduationCap, Tent, Users, Droplets, Briefcase,
  ShieldCheck, Lock, User
} from 'lucide-react';
import categoryService from '../../services/categoryService';

const getCategoryIcon = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('medis')) return HeartPulse;
  if (lower.includes('pendidikan')) return GraduationCap;
  if (lower.includes('bencana')) return Tent;
  if (lower.includes('lansia') || lower.includes('panti')) return Users;
  if (lower.includes('air') || lower.includes('infrastruktur')) return Droplets;
  return Briefcase;
};

const Home = () => {
  const {
    campaigns,
    pagination,
    loading,
    error,
    fetchCampaigns,
    setSearchKeyword,
    setSelectedCategory,
    setSelectedStatus,
    setSortOption
  } = useCampaign();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    setSearchKeyword('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSortOption('newest');
    fetchCampaigns(1, 9, { search: '', category: '', status: 'ACTIVE', sort: 'newest' });
    
    const fetchCats = async () => {
      setCategoriesLoading(true);
      try {
        const response = await categoryService.getAllCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCats();
  }, [fetchCampaigns]);

  // Featured Campaigns: Top 4
  const featuredCampaigns = campaigns.slice(0, 4);
  const listCampaigns = campaigns.slice(4, 10); // Display next up to 6

  return (
    <div className="bg-background min-h-screen text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1240px] mx-auto bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)] rounded-3xl mb-8 md:mb-12 mt-4">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-6 border border-outline-variant rounded-full px-3 py-1.5 w-fit max-w-full bg-surface-container-lowest shadow-sm">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span className="truncate whitespace-normal">Platform Validasi Tanpa Potongan</span>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-serif font-bold leading-tight text-on-surface">
              Bersama, <i className="text-primary font-serif">Kebaikan</i> Bisa Sampai Lebih Jauh.
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
              PeduliKita menyalurkan donasi transparan langsung kepada yang benar-benar membutuhkan tanpa ada potongan sistem. 
              Satu kebaikan kecil Anda, bantu memulihkan banyak kehidupan di pelosok nusantara.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/campaigns" className="inline-flex items-center justify-center bg-primary text-white rounded font-mono font-bold text-sm px-8 py-3.5 hover:bg-primary-container transition-colors shadow-sm">
                Lihat Kampanye
              </Link>
              <Link to="/campaigner/campaigns/create" className="inline-flex items-center justify-center bg-surface-container-lowest text-on-surface border border-outline-variant rounded font-mono font-bold text-sm px-8 py-3.5 hover:bg-surface-container transition-colors">
                Buka Penggalangan
              </Link>
            </div>
          </div>

          <div className="relative h-full flex items-center justify-end">
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden shadow-sm">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80" alt="Relawan membagikan bantuan" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1240px] mx-auto bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)] rounded-3xl mb-8 md:mb-12">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Pilih Arah Kebaikan</p>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-on-surface">Temukan Perjuangan yang Ingin Kamu Dukung</h2>
          <p className="text-body-md text-on-surface-variant mt-3 max-w-2xl mx-auto">
            Melalui kategori aksi ini, pilih panggung kebaikan yang paling menggugah hatimu untuk memulainya hari ini.
          </p>
        </div>

        {categoriesLoading ? (
          <Loading />
        ) : categories.length === 0 ? (
          <EmptyState message="Tidak ada kategori tersedia." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <Link key={cat.id} to={`/campaigns?category=${cat.name}`} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 hover:border-primary transition-all group flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-base mb-1.5">{cat.name}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{cat.description}</p>
                    <p className="text-xs font-bold text-primary mt-2 flex items-center gap-1 group-hover:underline">
                      Lihat Kampanye
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Campaigns Showcase (Asymmetric) */}
      <section className="py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1240px] mx-auto bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)] rounded-3xl mb-8 md:mb-12">
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Aksi Mendesak</p>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-on-surface">Kampanye yang Sedang Berjalan</h2>
          <p className="text-body-md text-on-surface-variant mt-3 max-w-2xl">
            Dukungan Anda tidak sekadar menyalurkan dana, tapi menyambung napas dan membuka masa depan nyata.
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => fetchCampaigns(1)} />
        ) : featuredCampaigns.length === 0 ? (
          <EmptyState message="Tidak ada kampanye mendesak." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Main Featured (Spans 2 columns, stacked) */}
            <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
              {featuredCampaigns[0] && (
                <CampaignCard campaign={featuredCampaigns[0]} isFeatured={true} isLarge={true} />
              )}
              {featuredCampaigns[3] && (
                <CampaignCard campaign={featuredCampaigns[3]} isFeatured={true} isLarge={true} />
              )}
            </div>
            
            {/* Sidebar Featured (2 stacked) */}
            <div className="flex flex-col gap-6">
              {featuredCampaigns[1] && <CampaignCard campaign={featuredCampaigns[1]} isFeatured={true} isLarge={false} />}
              {featuredCampaigns[2] && <CampaignCard campaign={featuredCampaigns[2]} isFeatured={true} isLarge={false} />}
            </div>
          </div>
        )}
      </section>

      {/* Campaign List */}
      <section className="py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1240px] mx-auto bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)] rounded-3xl mb-8 md:mb-12">
        <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4">
           <h2 className="text-xl font-serif font-bold text-on-surface">Kampanye Lainnya</h2>
           <p className="text-sm font-medium text-on-surface-variant">Menampilkan <span className="font-bold text-on-surface">{pagination?.totalItems || 0}</span> kampanye aktif</p>
        </div>

        {/* Lower List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {listCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        
        {listCampaigns.length > 0 && (
          <div className="mt-12 text-center">
             <Link to="/campaigns" className="inline-block border border-primary text-primary font-bold font-mono text-sm px-8 py-3 rounded hover:bg-primary-fixed transition-colors">
               Muat Lebih Banyak Kampanye
             </Link>
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="py-10 md:py-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1240px] mx-auto bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)] rounded-3xl mb-8 md:mb-12" id="cara-kerja">
        <div className="max-w-[1240px] mx-auto text-center">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Alur Transparansi</p>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-on-surface mb-12 max-w-2xl mx-auto">
            Tiga Langkah Mudah Mengalirkan Kebaikan
          </h2>
          <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto mb-16 -mt-8">
            PeduliKita memastikan setiap rupiah donasi disalur transparan dan langsung diterima yang berhak tanpa berbelit-belit.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-left">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 relative">
              <div className="absolute -top-6 left-8 bg-primary-fixed w-12 h-12 flex items-center justify-center rounded-lg border border-outline-variant font-serif font-bold text-2xl text-primary">
                1
              </div>
              <h3 className="font-bold text-[18px] text-on-surface mb-3 mt-4">Temukan Kampanye</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Telusuri kisah penerima manfaat yang telah diverifikasi identitas dan kebutuhannya. Mengusut tuntas legalitas penggalangan via audit ketat kami.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-wider">
                 <ShieldCheck className="w-4 h-4" /> VERIFIKASI MULTI-TAHAP
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 relative">
              <div className="absolute -top-6 left-8 bg-surface-container w-12 h-12 flex items-center justify-center rounded-lg border border-outline-variant font-serif font-bold text-2xl text-primary">
                2
              </div>
              <h3 className="font-bold text-[18px] text-on-surface mb-3 mt-4">Berikan Dukungan</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Salurkan donasi dengan aman. Dana akan masuk ke rekening yayasan resmi kami via kanal QRIS, Virtual Account, hingga Transfer Bank.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-wider">
                 <Lock className="w-4 h-4" /> ENKRIPSI AMAN SSL 128
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 relative">
              <div className="absolute -top-6 left-8 bg-surface-container-high w-12 h-12 flex items-center justify-center rounded-lg border border-outline-variant font-serif font-bold text-2xl text-primary">
                3
              </div>
              <h3 className="font-bold text-[18px] text-on-surface mb-3 mt-4">Ikuti Perkembangannya</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Dapatkan notifikasi email, terbaru, dokumentasi penyaluran dana, dan kuitansi laporan langsung di halaman kampanye secara real-time.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-outline uppercase tracking-wider">
                 <User className="w-4 h-4" /> LAPORAN BISA DIPERTANGGUNGJAWABKAN
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-12 px-4 max-w-[1240px] mx-auto mb-12">
        <div className="max-w-[1000px] mx-auto bg-primary rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white relative overflow-hidden shadow-xl border border-primary-container">
          {/* Subtle bg pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-surface-container-lowest/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur">
              <ShieldCheck className="w-4 h-4" /> Inisiatif Terbuka 2026
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold mb-4 md:mb-6 leading-tight">
              Punya Kebaikan yang Ingin <br className="hidden sm:block"/> Kamu Mulai?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-primary-fixed mb-8 md:mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              Buka pintu mandiri atasnya, pergerakan relawan yang dirancang rapih terstruktur transparan di sistem kerelawanan. PeduliKita siap mendampingi inisiatif donasi dari tenggat proyeknya.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/campaigner/campaigns/create" className="bg-surface-container-lowest text-primary font-bold font-mono text-base px-8 py-4 rounded hover:bg-surface-container transition-colors w-full sm:w-auto">
                Mulai Galang Dana Sekarang
              </Link>
              <Link to="/campaigns" className="bg-primary border border-white text-white font-bold font-mono text-base px-8 py-4 rounded hover:bg-primary-container transition-colors w-full sm:w-auto">
                Eksplorasi & Beri Tanggungan
              </Link>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-xs font-bold text-primary-fixed uppercase tracking-wider">
               <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Dana Dijamin Aman</div>
               <div className="flex items-center gap-2"><HeartPulse className="w-4 h-4" /> Penyaluran 100% Bebas Biaya</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
