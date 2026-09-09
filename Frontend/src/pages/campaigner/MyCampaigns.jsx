import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import campaignService from '../../services/campaignService';
import { Loading, ErrorMessage, EmptyState } from '../../components/common/UIStates';
import { Eye, Trash2, XCircle, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchMyCampaigns = async () => {
    setLoading(true);
    try {
      const res = await campaignService.getMyCampaigns();
      setCampaigns(res.data || []);
    } catch (err) {
      setError('Gagal memuat kampanye Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kampanye ini?')) {
      try {
        await campaignService.deleteCampaign(id);
        showToast('Kampanye berhasil dihapus', 'success');
        fetchMyCampaigns();
      } catch (err) {
        showToast(err.response?.data?.message || 'Gagal menghapus kampanye', 'error');
      }
    }
  };

  const handleClose = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menutup kampanye ini? Donasi tidak akan bisa diterima lagi.')) {
      try {
        await campaignService.closeCampaign(id);
        showToast('Kampanye berhasil ditutup', 'success');
        fetchMyCampaigns();
      } catch (err) {
        showToast(err.response?.data?.message || 'Gagal menutup kampanye', 'error');
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE': return <span className="px-2 py-1 bg-primary-fixed text-on-primary-fixed rounded text-xs font-bold uppercase tracking-wider">Aktif</span>;
      case 'DRAFT': return <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant rounded text-xs font-bold uppercase tracking-wider">Draft</span>;
      case 'PENDING': return <span className="px-2 py-1 bg-secondary-fixed/50 text-on-secondary-fixed rounded text-xs font-bold uppercase tracking-wider">Pending</span>;
      case 'COMPLETED': return <span className="px-2 py-1 bg-secondary-fixed text-on-secondary-fixed rounded text-xs font-bold uppercase tracking-wider">Selesai</span>;
      case 'CLOSED': return <span className="px-2 py-1 bg-error-container text-on-error-container rounded text-xs font-bold uppercase tracking-wider">Ditutup</span>;
      default: return null;
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMyCampaigns} />;

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[var(--color-primary)]/20 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-headline-sm font-bold text-on-surface">Kampanye Saya</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Kelola semua penggalangan dana Anda.</p>
        </div>
        <Link 
          to="/campaigner/campaigns/create"
          className="px-5 py-2.5 bg-primary text-white rounded hover:bg-primary-container transition-colors font-bold text-sm shadow-sm flex items-center justify-center whitespace-nowrap"
        >
          + Tambah Kampanye
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState message="Anda belum membuat kampanye satupun." />
      ) : (
        <div className="bg-surface-container-lowest border border-primary rounded overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-surface border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold w-2/5">Informasi Kampanye</th>
                  <th className="p-4 font-bold">Terkumpul</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-surface-container rounded overflow-hidden flex-shrink-0 border border-outline-variant">
                          {camp.image_url ? (
                            <img src={camp.image_url.startsWith('http') ? camp.image_url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${camp.image_url}`} alt={camp.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-surface-container-high"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface line-clamp-1" title={camp.title}>{camp.title}</p>
                          <p className="text-xs text-on-surface-variant mt-1 font-medium">Target: {formatCurrency(camp.target_amount)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-primary">{formatCurrency(camp.collected_amount)}</p>
                      <p className="text-xs text-on-surface-variant mt-1 font-medium">
                        {Math.round(Math.min(((camp.collected_amount || 0) / (camp.target_amount || 1)) * 100, 100))}% tercapai
                      </p>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(camp.status)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link to={`/campaigner/campaigns/${camp.id}`} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-fixed rounded transition-colors" title="Kelola Laporan & Kabar">
                          <FileText size={18} />
                        </Link>

                        {camp.status === 'ACTIVE' && (
                          <button onClick={() => handleClose(camp.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded transition-colors" title="Tutup Kampanye">
                            <XCircle size={18} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(camp.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded transition-colors" title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default MyCampaigns;
