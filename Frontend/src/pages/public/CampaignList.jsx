import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useCampaign } from '../../context/CampaignContext';
import CampaignListCard from '../../components/campaign/CampaignListCard';
import Pagination from '../../components/common/Pagination';
import ModernSelect from '../../components/common/ModernSelect';
import { Loading, ErrorMessage, EmptyState } from '../../components/common/UIStates';
import { Search, ShieldCheck, ListFilter, LayoutGrid, Clock, ChevronRight, ChevronLeft, Shield } from 'lucide-react';
import categoryService from '../../services/categoryService';

const CampaignList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category') || '';
  
  const {
    campaigns,
    pagination,
    loading,
    error,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    selectedStatus,
    setSelectedStatus,
    fetchCampaigns
  } = useCampaign();

  const [categories, setCategories] = useState([]);
  const [localSearch, setLocalSearch] = useState(searchKeyword);
  const [forceState, setForceState] = useState('normal');

  // Sync URL -> State (Only on mount or external URL changes)
  useEffect(() => {
    const currentUrlCat = searchParams.get('category') || '';
    if (currentUrlCat && currentUrlCat !== selectedCategory) {
      setSelectedCategory(currentUrlCat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams

  // Sync State -> URL
  useEffect(() => {
    const currentUrlCat = searchParams.get('category') || '';
    if (selectedCategory && selectedCategory !== currentUrlCat) {
      setSearchParams({ category: selectedCategory });
    } else if (!selectedCategory && searchParams.has('category')) {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  }, [selectedCategory, searchParams, setSearchParams]);

  // Fetch Data
  useEffect(() => {
    fetchCampaigns(1, 6);
  }, [selectedCategory, sortOption, searchKeyword, selectedStatus, fetchCampaigns]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchKeyword(searchKeyword);
  };

  const handlePageChange = (newPage) => {
    fetchCampaigns(newPage, 6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-primary-fixed selection:text-on-primary-fixed pb-24">
      {/* Hero Section */}
      <section className="py-10 px-6 md:px-10 lg:px-12 max-w-[1240px] mx-auto bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)] rounded-3xl mb-8 mt-4">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-6 bg-primary-fixed/20 px-3 py-1.5 rounded-full w-fit max-w-full border border-primary-fixed">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span className="truncate whitespace-normal">Eksplorasi Inisiatif Kemanusiaan Terverifikasi</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
           <div className="max-w-2xl">
             <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight text-on-surface mb-4">
               Temukan Kampanye yang <i className="text-primary font-serif">Berarti</i>
             </h1>
             <p className="text-base md:text-body-lg text-on-surface-variant leading-relaxed">
               Setiap donasi disalurkan langsung secara transparan dengan audit berkala. Pilih inisiatif kemanusiaan yang dekat di hatimu dan saksikan dampak nyata bagi mereka yang membutuhkan.
             </p>
           </div>
           
           {/* Global Stats Block from Mockup */}
           <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-sm w-full md:w-auto md:min-w-[280px]">
              <div className="flex justify-between items-center mb-4 text-xs font-bold text-outline uppercase tracking-wider">
                 <span>Laporan Audit Langsung</span>
                 <span className="flex items-center gap-1 text-primary">Tahun 2026</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                 <h2 className="text-3xl font-bold font-mono text-on-surface leading-none">{pagination?.totalItems || 0}</h2>
                 <span className="text-[13px] font-medium text-on-surface-variant uppercase tracking-wide">Inisiatif Aktif</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium text-outline pt-2 border-t border-outline-variant/50">
                 <span>Tersebar di 18 Provinsi</span>
                 <span>100% Terverifikasi Legal</span>
              </div>
           </div>
        </div>
      </section>

      {/* Advanced Filters Section */}
      <section className="px-6 md:px-10 lg:px-12 py-8 max-w-[1240px] mx-auto mb-8 bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)] rounded-3xl">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
           {/* Top Row: Search & Actions */}
           <div className="flex flex-row gap-4 mb-4">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="w-5 h-5 text-outline absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Cari kampanye yang ingin kamu dukung (misal: Sembako Demak, Sekolah Pelosok)..." 
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-12 pr-4 py-3.5 outline-none text-sm focus:border-primary transition-colors text-on-surface placeholder:text-outline"
                />
              </form>
           </div>
           
           {/* Category Pills */}
           <div className="flex overflow-x-auto pb-2 gap-2 mb-4 whitespace-nowrap hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button 
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-colors flex-shrink-0 ${selectedCategory === '' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
              >
                Semua Kategori
              </button>
              {categories.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-colors flex-shrink-0 ${selectedCategory === c.name ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
                >
                  {c.name}
                </button>
              ))}
           </div>
           
           {/* Bottom Row: Status & Sorting */}
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-4 border-t border-outline-variant/60">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                 <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3">
                   <span className="text-xs font-bold text-outline whitespace-nowrap">Status:</span>
                   <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => setSelectedStatus('')}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${selectedStatus === '' ? 'bg-surface-container-lowest border border-outline-variant text-on-surface shadow-sm' : 'bg-surface-container-low border border-outline-variant text-outline hover:bg-surface-container'}`}
                      >
                        Semua
                      </button>
                      <button 
                        onClick={() => setSelectedStatus('ACTIVE')}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${selectedStatus === 'ACTIVE' ? 'bg-surface-container-lowest border border-outline-variant text-on-surface shadow-sm' : 'bg-surface-container-low border border-outline-variant text-outline hover:bg-surface-container'}`}
                      >
                        Aktif
                      </button>
                      <button 
                        onClick={() => setSelectedStatus('COMPLETED')}
                        className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${selectedStatus === 'COMPLETED' ? 'bg-surface-container-lowest border border-outline-variant text-on-surface shadow-sm' : 'bg-surface-container-low border border-outline-variant text-outline hover:bg-surface-container'}`}
                      >
                        Selesai
                      </button>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary-fixed/20 px-3 py-1.5 rounded-full border border-primary-fixed w-fit max-w-full">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate whitespace-normal">Diawasi di 14 instansi</span>
                 </div>
              </div>
              
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 w-full lg:w-auto">
                 <span className="text-xs font-bold text-outline whitespace-nowrap">Urutkan:</span>
                 <ModernSelect
                   options={[
                     { value: 'newest', label: 'Mendesak / Deadline Terdekat' },
                     { value: 'oldest', label: 'Terlama' },
                     { value: 'highest_target', label: 'Target Tertinggi' },
                     { value: 'lowest_target', label: 'Target Terendah' }
                   ]}
                   name="sortOption"
                   value={sortOption}
                   onChange={(e) => setSortOption(e.target.value)}
                   className="w-full sm:min-w-[200px]"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* Grid Content */}
      <section className="px-6 md:px-10 lg:px-12 py-10 max-w-[1240px] mx-auto bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)] rounded-3xl mb-8">
        {loading || forceState === 'loading' ? (
          <Loading />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => fetchCampaigns(pagination.currentPage || 1)} />
        ) : forceState === 'empty' || campaigns.length === 0 ? (
          <EmptyState message="Tidak ada kampanye yang cocok dengan filter Anda." />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
               <h3 className="text-sm sm:text-base font-bold text-on-surface flex flex-wrap items-center gap-2">
                 Menampilkan Kampanye Terverifikasi 
                 <span className="bg-primary-fixed px-2 py-0.5 rounded text-xs text-primary">{pagination?.totalItems || 0} Kampanye</span>
               </h3>
               <span className="text-xs font-bold text-outline">Halaman {pagination?.currentPage || 1} dari {pagination?.totalPages || 1}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
              {campaigns.map((campaign, index) => {
                let colSpanClass = "md:col-span-2"; // 3 per row by default
                
                if (index === 0) {
                  colSpanClass = "md:col-span-6"; // 1 per row (large horizontal)
                } else if (index === 1 || index === 2) {
                  colSpanClass = "md:col-span-3"; // 2 per row
                }

                return (
                  <div key={campaign.id} className={colSpanClass}>
                    <CampaignListCard 
                      campaign={campaign} 
                      isFeatured={index === 0} 
                      isLarge={index === 0} 
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Custom Pagination to match mockup */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-outline-variant pt-6">
                 <span className="text-[13px] font-medium text-outline text-center sm:text-left">Menampilkan pilihan <strong className="text-on-surface">1–{campaigns.length}</strong> dari <strong className="text-on-surface">{pagination.totalItems}</strong> kampanye</span>
                 
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-low text-outline disabled:opacity-50 hover:bg-surface-container transition-colors"
                    >
                       <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Simple logic to show a few pages (mockup shows 1, 2, 3, ..., 189)
                      if (page <= 3 || page === pagination.totalPages) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold ${pagination.currentPage === page ? 'bg-primary text-white' : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container transition-colors'}`}
                          >
                            {page}
                          </button>
                        );
                      }
                      if (page === 4 && pagination.totalPages > 4) {
                        return <span key="ellipsis" className="text-outline mx-1">...</span>;
                      }
                      return null;
                    })}
                    
                    <button 
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-low text-outline disabled:opacity-50 hover:bg-surface-container transition-colors"
                    >
                       <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Bottom CTA Panel */}
      <section className="max-w-[1240px] mx-auto px-4 md:px-10 lg:px-12 py-10 bg-surface-container/70 backdrop-blur-2xl border border-primary/20 shadow-[0_20px_50px_rgba(0,107,44,0.12)] rounded-3xl">
         <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
               <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 sm:mt-1">
                  <Shield className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="font-bold text-xl text-on-surface mb-2">Punya Inisiatif Sosial yang Perlu Bantuan?</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed max-w-2xl">
                    Ajukan kampanye sosial atau medis untuk komunitasmu. Tim kurasi PeduliKita membantu proses verifikasi data medis, identitas, dan rekening resmi dalam 24 jam.
                  </p>
               </div>
            </div>
            <button className="shrink-0 bg-primary text-white px-8 py-3.5 rounded-lg text-sm font-bold font-mono hover:bg-primary-container transition-colors shadow-sm w-full md:w-auto">
               Mulai Galang Dana
            </button>
         </div>
      </section>
    </div>
  );
};

export default CampaignList;
