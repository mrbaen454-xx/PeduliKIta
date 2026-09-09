import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import campaignService from '../../services/campaignService';
import api from '../../services/api';
import { Loading, ErrorMessage } from '../../components/common/UIStates';
import { CheckCircle2, Clock, MapPin, FileText, Activity, Home, ChevronRight, Share2, Heart, Shield, Info, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await campaignService.getCampaignById(id);
        setCampaign(res.data);
        
        try {
          const updatesRes = await api.get(`/campaigns/${id}/updates`);
          setUpdates(updatesRes.data.data || []);
        } catch (updateErr) {
          console.error("Failed to load updates", updateErr);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil detail campaign.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${url}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Tautan kampanye berhasil disalin!', 'success');
  };

  // State handling logic
  const isError = error;
  const isLoading = loading;
  const isCompleted = (campaign && campaign.status === 'COMPLETED');
  const isEmptyDocs = (campaign && (!campaign.documents || campaign.documents.length === 0));
  const isEmptyUpdates = updates.length === 0;

  if (isError) return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <div className="flex-1 flex items-center justify-center">
        <ErrorMessage message={error || "Gagal memuat data"} onRetry={() => window.location.reload()} />
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <div className="flex-1 px-4 md:px-6 lg:px-8 max-w-[1240px] mx-auto w-full pt-8">
        <div className="w-2/3 h-8 bg-surface-variant rounded-md animate-pulse mb-6"></div>
        <div className="w-full h-[400px] bg-surface-variant rounded-xl animate-pulse mb-8"></div>
        <div className="w-full h-32 bg-surface-variant rounded-xl animate-pulse"></div>
      </div>
    </div>
  );

  if (!campaign) return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      <div className="flex-1 flex items-center justify-center text-on-surface">Campaign tidak ditemukan</div>
    </div>
  );

  const progress = Math.min(((campaign.collected_amount || 0) / (campaign.target_amount || 1)) * 100, 100);
  const statusDisplay = isCompleted ? 'COMPLETED' : campaign.status;

  return (
    <div className="bg-background min-h-screen font-sans selection:bg-primary-fixed selection:text-on-primary-fixed pb-24">
      <main className="px-4 md:px-6 lg:px-8 max-w-[1240px] mx-auto pt-6">
        
        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: HERO & CONTENT */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            
            {/* Hero Section */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-surface-container-low border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  {campaign.category?.name || 'Umum'}
                </div>
                <div className="flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  {statusDisplay}
                </div>
              </div>

              <h1 className="text-display-hero-mobile md:text-headline-lg font-serif font-bold leading-tight text-on-surface">
                {campaign.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-outline-variant/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                    {campaign.campaigner?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="text-xs text-outline uppercase tracking-wider font-bold mb-0.5">Penggalang Dana</p>
                    <p className="text-sm font-bold text-on-surface">{campaign.campaigner?.name || 'Anonim'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-outline bg-surface-container-lowest px-3 py-1.5 rounded border border-outline-variant">
                  <Clock className="w-3.5 h-3.5" />
                  Dibuat: {formatDate(campaign.created_at)}
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full aspect-[16/10] rounded-xl overflow-hidden shadow-sm border border-outline-variant">
              <img 
                src={getImageUrl(campaign.image_url)} 
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cerita Penggalangan Dana */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                <h2 className="text-headline-sm font-bold text-on-surface">Cerita Penggalangan Dana</h2>
              </div>
              <div className="prose prose-sm md:prose-base max-w-none text-on-surface-variant whitespace-pre-wrap leading-relaxed font-sans">
                {campaign.description}
              </div>
            </div>

            {/* Dokumen Pendukung Kampanye */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                  <h2 className="text-headline-sm font-bold text-on-surface">Dokumen Pendukung Kampanye</h2>
                </div>
                {!isEmptyDocs && (
                  <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
                    {campaign.documents?.length || 0} Dokumen
                  </span>
                )}
              </div>
              
              {isEmptyDocs ? (
                <div className="text-center py-8 bg-surface-container-lowest rounded border border-dashed border-outline-variant text-outline text-sm">
                  Belum ada dokumen pendukung yang dilampirkan.
                </div>
              ) : (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {campaign.documents.map(doc => (
                    <div key={doc.id} className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 flex flex-col justify-between hover:border-primary transition-colors group">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">PDF</span>
                      </div>
                      <div className="mb-4">
                        <p className="text-[13px] font-bold text-on-surface leading-snug line-clamp-2" title={doc.file_name}>{doc.file_name}</p>
                      </div>
                      <a 
                        href={getImageUrl(doc.file_url)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs font-bold text-primary group-hover:bg-primary-fixed/20 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" /> Buka Dokumen
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kabar Terbaru */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                  <h2 className="text-headline-sm font-bold text-on-surface">Kabar Terbaru</h2>
                </div>
                {!isEmptyUpdates && (
                  <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold">
                    {updates.length} Pembaruan
                  </span>
                )}
              </div>
              
              {isEmptyUpdates ? (
                <div className="text-center py-8 bg-surface-container-lowest rounded border border-dashed border-outline-variant text-outline text-sm">
                  Belum ada kabar terbaru dari penggalang dana.
                </div>
              ) : (
                <div className="relative pl-3 border-l border-outline-variant space-y-8">
                  {updates.map((update, index) => (
                    <div key={update.id} className="relative pl-6">
                      <div className="absolute w-5 h-5 bg-primary rounded-full flex items-center justify-center -left-[10.5px] top-0 ring-4 ring-white">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-surface-container-lowest inline-block px-3 py-1 rounded text-xs font-bold text-primary mb-3">
                        {formatDate(update.created_at)}
                      </div>
                      <h3 className="text-[18px] font-bold text-on-surface mb-2">{update.title}</h3>
                      <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap mb-4">{update.content}</p>
                      {update.image_url && (
                        <div className="w-full max-w-xl aspect-video rounded-lg overflow-hidden border border-outline-variant shadow-sm mt-2">
                          <img 
                            src={getImageUrl(update.image_url)} 
                            alt={update.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>

          {/* RIGHT COLUMN: STICKY DONATION WIDGET */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-6">
            
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm relative overflow-hidden">
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              
              <div className="flex items-center justify-between mb-6 pt-2">
                <span className="text-xs font-bold tracking-wider text-outline uppercase">Status Kampanye</span>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusDisplay === 'ACTIVE' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  {statusDisplay === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>}
                  {statusDisplay}
                </div>
              </div>
              
              <div className="mb-2">
                <span className="text-[13px] text-on-surface-variant font-medium">Dana Terkumpul</span>
                <div className="text-3xl font-mono font-bold text-primary leading-none mt-1 mb-2">
                  {formatCurrency(campaign.collected_amount)}
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-3 text-[13px]">
                <span className="text-on-surface-variant">Target: <strong className="text-on-surface">{formatCurrency(campaign.target_amount)}</strong></span>
                <span className="font-bold text-primary">{Math.round(progress)}%</span>
              </div>
              
              <div className="w-full bg-surface-container rounded-full h-2.5 mb-5 overflow-hidden">
                <div 
                  className={`${isCompleted ? 'bg-secondary' : 'bg-primary'} h-full rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant pb-6 mb-6 border-b border-outline-variant/60">
                <Clock className="w-4 h-4 text-outline" />
                Batas Akhir: <strong className="text-on-surface">{formatDate(campaign.end_date)}</strong>
              </div>
              
              <div className="space-y-3">
                <Link 
                  to={statusDisplay === 'ACTIVE' ? `/donate/${campaign.id}` : '#'}
                  className={`w-full py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                    statusDisplay === 'ACTIVE' 
                      ? 'bg-primary text-white hover:bg-primary-container shadow-sm' 
                      : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (statusDisplay !== 'ACTIVE') e.preventDefault();
                  }}
                >
                  <Heart className="w-5 h-5" />
                  {statusDisplay === 'ACTIVE' ? 'Donasi Sekarang' : 'Kampanye Ditutup'}
                </Link>
                
                <button 
                  onClick={copyToClipboard}
                  className="w-full py-3.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 bg-surface-container-low text-primary border border-outline-variant hover:bg-surface-container transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Salin Tautan Kampanye
                </button>
              </div>
            </div>

            {/* Campaigner Info Widget */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-on-surface">Informasi Penggalang Dana</h3>
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
                <p className="font-bold text-on-surface mb-1">{campaign.campaigner?.name || 'Anonim'}</p>
                <p className="text-xs text-on-surface-variant">Inisiator kampanye kemanusiaan terverifikasi</p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default CampaignDetail;
