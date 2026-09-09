import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const CampaignCard = ({ campaign, isFeatured = false, isLarge = false }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  const progress = Math.min(((campaign.collected_amount || 0) / (campaign.target_amount || 1)) * 100, 100);

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${url}`;
  };

  if (isFeatured) {
    return (
      <div className={`bg-surface-container-lowest rounded-lg border border-primary overflow-hidden flex flex-col h-full ${isLarge ? 'md:col-span-2' : ''}`}>
        <Link to={`/campaigns/${campaign.id}`} className={`relative w-full overflow-hidden block ${isLarge ? 'aspect-[16/10] md:aspect-video' : 'aspect-[16/10]'}`}>
          <img 
            src={getImageUrl(campaign.image_url)} 
            alt={campaign.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-surface-container-lowest/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
              {campaign.category?.name || 'Umum'}
            </span>
          </div>
        </Link>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-1.5 text-xs text-outline mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-on-surface-variant">{campaign.campaigner?.name || 'Yayasan Peduli'}</span>
          </div>

          <Link to={`/campaigns/${campaign.id}`}>
            <h3 className={`font-serif font-semibold text-on-surface hover:text-primary transition-colors mb-3 line-clamp-2 ${isLarge ? 'text-[22px] leading-[30px]' : 'text-[18px] leading-[26px]'}`} title={campaign.title}>
              {campaign.title}
            </h3>
          </Link>
          
          {isLarge && (
            <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-4">
              {campaign.description}
            </p>
          )}

          <div className="mt-auto">
            <div className="flex justify-between items-end mb-2">
               <div>
                 <span className="text-xs text-outline block mb-0.5">Terkumpul</span>
                 <span className="font-bold font-mono text-base text-on-surface">{formatCurrency(campaign.collected_amount)}</span>
               </div>
               <div className="text-right">
                 <span className="text-xs text-outline block mb-0.5">Sisa Waktu</span>
                 <span className="font-bold font-mono text-[13px] text-secondary">14 Hari</span>
               </div>
            </div>
            
            <div className="w-full bg-surface-variant rounded-full h-[6px] mb-4 overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <Link 
              to={`/donate/${campaign.id}`}
              className="flex items-center justify-center w-full py-2.5 bg-primary text-white font-mono font-semibold text-sm rounded hover:bg-primary-container transition-colors"
            >
              Donasi Sekarang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Standard List Card
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-primary flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow group">
      <Link to={`/campaigns/${campaign.id}`} className="relative aspect-[16/10] w-full overflow-hidden block">
        <img 
          src={getImageUrl(campaign.image_url)} 
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-surface-container-lowest/95 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-on-surface-variant uppercase tracking-wider shadow-sm">
          {campaign.category?.name || 'Umum'}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/campaigns/${campaign.id}`}>
          <h3 className="font-serif font-semibold text-base leading-[22px] text-on-surface hover:text-primary transition-colors mb-4 line-clamp-2" title={campaign.title}>
            {campaign.title}
          </h3>
        </Link>
        
        <div className="mt-auto">
           <div className="flex justify-between items-center text-xs mb-2 font-mono">
             <span className="font-bold text-on-surface">{formatCurrency(campaign.collected_amount)}</span>
             <span className="text-outline">{Math.round(progress)}%</span>
           </div>
           
           <div className="w-full bg-surface-variant rounded-full h-[4px] overflow-hidden">
             <div 
               className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
               style={{ width: `${progress}%` }}
             ></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
