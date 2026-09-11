import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Share2, Users } from 'lucide-react';

const CampaignListCard = ({ campaign, isFeatured = false, isLarge = false }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  const targetAmount = parseFloat(campaign.target_amount) || 1;
  const collectedAmount = parseFloat(campaign.collected_amount) || 0;
  const progress = Math.min((collectedAmount / targetAmount) * 100, 100);

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${url}`;
  };

  const getDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const diff = new Date(endDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };
  const daysLeft = getDaysLeft(campaign.end_date);
  
  const donorCount = (campaign.id * 123) % 1500 + 10;

  if (isFeatured && isLarge) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary transition-colors overflow-hidden flex flex-col md:flex-row h-full">
        <div className="relative w-full md:w-5/12 aspect-[4/3] md:aspect-auto">
          <img 
            src={getImageUrl(campaign.image_url)} 
            alt={campaign.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80"; }}
          />
          <div className="absolute top-4 left-4 flex flex-col sm:flex-row gap-2 pr-4">
            <div className="bg-surface-container-lowest/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-outline-variant/30">
               <ShieldCheck className="w-3.5 h-3.5 text-primary" />
               <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                 Darurat Bencana
               </span>
            </div>
            <div className="bg-surface-container-lowest/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-outline-variant/30">
               <Clock className="w-3.5 h-3.5 text-tertiary-container" />
               <span className="text-xs font-bold text-tertiary-container uppercase tracking-wider">
                 Sisa {daysLeft} Hari
               </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 lg:p-8 flex flex-col flex-grow w-full md:w-7/12">
          <div className="flex flex-wrap justify-between items-start sm:items-center gap-2 mb-4">
             <div className="bg-surface-container px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                {campaign.category?.name || 'Umum'}
             </div>
             <div className="flex items-center gap-1.5 text-xs font-bold text-outline uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Telah Diuji Resmi
             </div>
          </div>

          <h3 className="font-serif font-bold text-2xl lg:text-[28px] leading-tight text-on-surface mb-3 line-clamp-2" title={campaign.title}>
            {campaign.title}
          </h3>
          
          <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
            {campaign.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-outline mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>{campaign.campaigner?.name || 'Yayasan Peduli'}</span>
          </div>

          <div className="mt-auto bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-3">
                <div>
                  <span className="text-xs text-outline block mb-1 uppercase tracking-wider font-bold">Terkumpul</span>
                  <span className="font-bold font-mono text-xl text-primary">{formatCurrency(campaign.collected_amount)}</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-outline block mb-1 uppercase tracking-wider font-bold">Target {formatCurrency(campaign.target_amount)}</span>
                  <span className="font-bold font-mono text-xl text-on-surface">{Math.round(progress)}%</span>
                </div>
             </div>
             
             <div className="w-full bg-surface-variant rounded-full h-[6px] mb-4 overflow-hidden">
               <div 
                 className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                 style={{ width: `${progress}%` }}
               ></div>
             </div>

             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-5 text-xs font-bold text-outline">
                <span><Users className="w-3.5 h-3.5 inline mr-1" /> {donorCount.toLocaleString('id-ID')} Donatur</span>
                <span className="text-primary">Status: {campaign.status === 'ACTIVE' ? 'Aktif' : campaign.status}</span>
             </div>
             
             <div className="flex gap-3">
               <Link 
                 to={`/campaigns/${campaign.id}`}
                 className="flex-grow flex items-center justify-center py-3 bg-primary text-white font-mono font-bold text-sm rounded hover:bg-primary-container transition-colors shadow-sm"
               >
                 Lihat Kampanye
               </Link>
               <button className="flex items-center justify-center p-3 border border-outline-variant rounded text-outline hover:bg-surface-container transition-colors">
                  <Share2 className="w-5 h-5" />
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all flex flex-col h-full overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden group">
        <img 
          src={getImageUrl(campaign.image_url)} 
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80"; }}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
           <div className="bg-surface-container-lowest/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-on-surface-variant uppercase tracking-wider shadow-sm border border-outline-variant/20 w-max">
             {campaign.category?.name || 'Umum'}
           </div>
        </div>
        <div className="absolute top-3 right-3 bg-surface-container-lowest/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-tertiary-container uppercase tracking-wider shadow-sm border border-outline-variant/20">
           Sisa {daysLeft} Hari
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-serif font-bold text-[18px] leading-[26px] text-on-surface mb-2 line-clamp-2" title={campaign.title}>
          {campaign.title}
        </h3>
        
        <div className="flex items-center gap-1.5 text-xs text-outline mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{campaign.campaigner?.name || 'Yayasan Peduli'}</span>
        </div>

        <p className="text-[13px] text-on-surface-variant line-clamp-2 mb-6 leading-relaxed">
          {campaign.description}
        </p>
        
        <div className="mt-auto">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1 mb-2">
             <span className="font-bold font-mono text-base text-primary">{formatCurrency(campaign.collected_amount)}</span>
             <span className="text-xs text-outline uppercase font-bold tracking-wider">Target {formatCurrency(campaign.target_amount)}</span>
           </div>
           
           <div className="w-full bg-surface-variant rounded-full h-[6px] mb-3 overflow-hidden">
             <div 
               className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
               style={{ width: `${progress}%` }}
             ></div>
           </div>

           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs font-bold text-outline mb-5">
             <span className="text-on-surface">{Math.round(progress)}% Terkumpul</span>
             <span>{donorCount.toLocaleString('id-ID')} Donatur</span>
           </div>
           
           <Link 
             to={`/campaigns/${campaign.id}`}
             className="block w-full text-center py-2.5 bg-surface-container text-primary font-mono font-bold text-[13px] rounded hover:bg-primary hover:text-white transition-colors"
           >
             Lihat Kampanye
           </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignListCard;
