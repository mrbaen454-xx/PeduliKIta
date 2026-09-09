import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Settings2, TrendingUp, Users, Target, Activity, FileText, Clock } from 'lucide-react';
import userService from '../../services/userService';
import campaignService from '../../services/campaignService';
import { useAuth } from '../../context/AuthContext';
import { Loading, ErrorMessage } from '../../components/common/UIStates';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, campRes] = await Promise.all([
          userService.getCampaignerDashboard(),
          campaignService.getMyCampaigns()
        ]);
        setDashboardData(dashRes.data);
        setRecentCampaigns(campRes.data?.slice(0, 4) || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil data dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboardData) return null;

  const { campaigns, totalCollected, totalDonors } = dashboardData;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[var(--color-primary)]/20 p-6 md:p-8">
        <div className="flex flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            {/* Banner Section */}
            <div className="bg-[var(--color-surface-container-low)] rounded-xl p-6 md:p-10 mb-8 flex flex-row gap-8 justify-between items-start lg:items-center">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4 text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase">
                  <span>Dashboard Campaigner</span>
                </div>
                <h1 className="text-[34px] md:text-[48px] font-serif font-bold text-[var(--color-inverse-surface)] mb-4 leading-tight">
                  Selamat Datang, {user?.name}
                </h1>
                <p className="text-[18px] text-[var(--color-on-surface-variant)] mb-8 max-w-xl">
                  Kelola penggalangan dana Anda dan pantau pencapaian donasi yang terkumpul.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/campaigner/campaigns/create" className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-container)] transition-colors shadow-sm">
                    <Plus size={18} />
                    Buat Kampanye Baru
                  </Link>
                  <Link to="/campaigner/campaigns" className="inline-flex items-center gap-2 bg-transparent text-[var(--color-primary)] border border-[var(--color-primary)]/30 px-6 py-3 rounded-lg font-semibold hover:bg-[var(--color-surface-container)] transition-colors">
                    <Settings2 size={18} />
                    Kelola Kampanye
                  </Link>
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-[var(--color-inverse-surface)] text-white rounded-xl p-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <TrendingUp size={80} />
                </div>
                <p className="text-xs font-bold text-[var(--color-surface-container-high)] tracking-wider uppercase mb-2">Total Dana Terkumpul</p>
                <h3 className="text-2xl md:text-3xl font-mono font-bold mb-4 truncate" title={formatCurrency(totalCollected)}>{formatCurrency(totalCollected)}</h3>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-6 border border-[var(--color-primary)]/20 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-bold text-[var(--color-on-surface-variant)] tracking-wider uppercase">Total Kampanye</p>
                  <div className="p-1.5 bg-[var(--color-surface-container)] text-[var(--color-primary)] rounded">
                    <Target size={18} />
                  </div>
                </div>
                <h3 className="text-3xl font-mono font-bold text-[var(--color-inverse-surface)] mb-2 truncate">{campaigns.total}</h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Semua kategori inisiatif</p>
                
                <div className="flex items-center gap-4 text-sm font-semibold">
                  <div className="flex items-center gap-1.5 text-[var(--color-primary)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                    {campaigns.active} Aktif
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--color-on-surface-variant)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-outline-variant)]"></span>
                    {campaigns.completed} Selesai
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[var(--color-surface-container)] mt-3 rounded-full overflow-hidden flex">
                  <div className="bg-[var(--color-primary)] h-full" style={{ width: `${(campaigns.active / (campaigns.total || 1)) * 100}%` }}></div>
                  <div className="bg-[var(--color-outline-variant)] h-full" style={{ width: `${(campaigns.completed / (campaigns.total || 1)) * 100}%` }}></div>
                </div>
                <div className="mt-2 text-xs text-[var(--color-outline)] font-medium">
                  {campaigns.pending} Menunggu • {campaigns.total - campaigns.active - campaigns.completed - campaigns.pending} Lainnya
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-6 border border-[var(--color-primary)]/20 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-[var(--color-on-surface-variant)] tracking-wider uppercase">Donatur Terdaftar</p>
                    <div className="p-1.5 bg-[var(--color-surface-container)] text-[var(--color-primary)] rounded">
                      <Users size={18} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-mono font-bold text-[var(--color-inverse-surface)] mb-2 truncate">{totalDonors}</h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">Orang telah berdonasi</p>
                </div>
              </div>
            </div>

            {/* Status Seluruh Kampanye */}
            <div className="bg-surface-container-lowest rounded-xl p-6 mb-8 border border-[var(--color-primary)]/20 shadow-sm">
              <div className="flex flex-row md:items-center justify-between mb-6 gap-2">
                <h2 className="text-[22px] font-semibold flex items-center gap-2 text-[var(--color-inverse-surface)]">
                  <Activity size={20} className="text-[var(--color-primary)]" />
                  Status Seluruh Kampanye
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-outline-variant)]/20 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-inverse-surface)]">Active</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 gap-2">
                    <span className="text-xs text-[var(--color-on-surface-variant)] leading-tight break-words">Sedang menggalang</span>
                    <span className="text-xl font-bold font-mono text-[var(--color-primary)]">{campaigns.active}</span>
                  </div>
                </div>

                <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-outline-variant)]/20 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-inverse-surface)]">Pending</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 gap-2">
                    <span className="text-xs text-[var(--color-on-surface-variant)] leading-tight break-words">Menunggu Kurasi</span>
                    <span className="text-xl font-bold font-mono text-[#F59E0B]">{campaigns.pending}</span>
                  </div>
                </div>
                
                <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-outline-variant)]/20 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary-fixed-dim)]"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-inverse-surface)]">Approved</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 gap-2">
                    <span className="text-xs text-[var(--color-on-surface-variant)] leading-tight break-words">Siap Dipublikasi</span>
                    <span className="text-xl font-bold font-mono text-[var(--color-primary-fixed-dim)]">0</span>
                  </div>
                </div>

                <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-outline-variant)]/20 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-outline)]"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-inverse-surface)]">Completed</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 gap-2">
                    <span className="text-xs text-[var(--color-on-surface-variant)] leading-tight break-words">Selesai</span>
                    <span className="text-xl font-bold font-mono text-[var(--color-outline)]">{campaigns.completed}</span>
                  </div>
                </div>

                <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-outline-variant)]/20 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-outline-variant)]"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-inverse-surface)]">Closed</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 gap-2">
                    <span className="text-xs text-[var(--color-on-surface-variant)] leading-tight break-words">Masa Berakhir</span>
                    <span className="text-xl font-bold font-mono text-[var(--color-outline-variant)]">{campaigns.total - campaigns.active - campaigns.completed - campaigns.pending}</span>
                  </div>
                </div>

                <div className="bg-[var(--color-surface)] p-4 rounded-lg border border-[var(--color-error)]/20 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-error)]"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-error)]">Rejected</span>
                  </div>
                  <div className="flex justify-between items-end mt-4 gap-2">
                    <span className="text-xs text-[var(--color-error)] leading-tight break-words">Ditolak / Batal</span>
                    <span className="text-xl font-bold font-mono text-[var(--color-error)]">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kampanye Berjalan & Sorotan */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[22px] font-semibold flex items-center gap-2 text-[var(--color-inverse-surface)] mb-1">
                    <TrendingUp size={20} className="text-[var(--color-primary)]" />
                    Kampanye Berjalan
                  </h2>
                </div>
                <Link to="/campaigner/campaigns" className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-container)] flex items-center gap-1">
                  Lihat Semua Kampanye <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              {recentCampaigns.length === 0 ? (
                <div className="bg-surface-container-lowest p-8 rounded-xl border border-[var(--color-primary)]/20 text-center text-[var(--color-on-surface-variant)] shadow-sm">
                  Belum ada kampanye. Mulai buat kampanye pertama Anda!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {recentCampaigns.map((camp) => (
                    <div key={camp.id} className="bg-surface-container-lowest rounded-xl border border-[var(--color-primary)]/20 shadow-sm overflow-hidden flex flex-col">
                      <div className="h-48 bg-[var(--color-surface-variant)] relative overflow-hidden">
                        {camp.image_url ? (
                          <img src={camp.image_url} alt={camp.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--color-outline)]">Tanpa Gambar</div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-[var(--color-inverse-surface)] text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            {camp.status}
                          </span>
                          <span className="bg-surface-container-lowest text-[var(--color-inverse-surface)] text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {camp.category?.name || 'Kategori'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-[var(--color-inverse-surface)] mb-4 line-clamp-2">{camp.title}</h3>
                        
                        <div className="mt-auto">
                          <div className="flex justify-between items-end mb-2">
                            <div className="w-1/2 pr-2">
                              <div className="text-xs text-[var(--color-on-surface-variant)] mb-1 truncate">Terkumpul</div>
                              <div className="font-mono font-bold text-[var(--color-primary)] text-lg md:text-xl truncate" title={formatCurrency(camp.collected_amount)}>
                                {formatCurrency(camp.collected_amount)}
                              </div>
                            </div>
                            <div className="text-right w-1/2 pl-2">
                              <div className="text-xs text-[var(--color-on-surface-variant)] mb-1 truncate">Target</div>
                              <div className="font-mono font-bold text-[var(--color-inverse-surface)] text-lg md:text-xl truncate" title={formatCurrency(camp.target_amount)}>
                                {formatCurrency(camp.target_amount)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="w-full h-2 bg-[var(--color-surface-container)] rounded-full overflow-hidden mb-3">
                            <div 
                              className="bg-[var(--color-primary)] h-full" 
                              style={{ width: `${Math.min((camp.collected_amount / camp.target_amount) * 100, 100)}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs text-[var(--color-on-surface-variant)]">
                            <span className="font-semibold text-[var(--color-primary)]">{((camp.collected_amount / (camp.target_amount || 1)) * 100).toFixed(1)}% Tercapai</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(camp.end_date) > new Date() ? Math.ceil((new Date(camp.end_date) - new Date()) / (1000 * 60 * 60 * 24)) + ' hari lagi' : 'Berakhir'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-5 py-3 bg-[var(--color-surface)] border-t border-[var(--color-outline-variant)]/20 flex justify-between items-center">
                        <div className="text-xs text-[var(--color-inverse-surface)] flex items-center gap-1.5">
                          <Users size={14} className="text-[var(--color-on-surface-variant)]"/>
                          <span className="font-bold">{camp.donations?.length || 0}</span> donasi terverifikasi
                        </div>
                        <Link to={`/campaigner/campaigns/${camp.id}`} className="text-xs font-semibold bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] px-3 py-1.5 rounded text-[var(--color-inverse-surface)] transition-colors">
                          Detail & Laporan <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
