import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { Loading, ErrorMessage, EmptyState } from '../../components/common/UIStates';
import { useToast } from '../../context/ToastContext';
import { FileText, CheckCircle, XCircle, Eye, AlertCircle, X } from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';

const CampaignApprovals = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  // Reject Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // Confirm Modal State
  const [confirmApproveModal, setConfirmApproveModal] = useState({ isOpen: false, id: null });

  const fetchPendingCampaigns = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPendingCampaigns();
      setCampaigns(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat antrean kampanye');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await adminService.approveCampaign(id);
      showToast('Kampanye berhasil disetujui dan sekarang aktif!', 'success');
      fetchPendingCampaigns();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyetujui kampanye', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      showToast('Alasan penolakan harus diisi', 'error');
      return;
    }

    try {
      setActionLoading(true);
      await adminService.rejectCampaign(selectedCampaign.id, rejectReason);
      showToast('Kampanye berhasil ditolak', 'success');
      setIsRejectModalOpen(false);
      setRejectReason('');
      fetchPendingCampaigns();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menolak kampanye', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (campaign) => {
    setSelectedCampaign(campaign);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-primary/20 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-[28px] md:text-4xl font-bold text-inverse-surface font-serif mb-2">Persetujuan Kampanye</h1>
        <p className="text-on-surface-variant">Tinjau dan verifikasi kampanye baru sebelum dipublikasikan.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-primary/20 overflow-hidden">
        {campaigns.length === 0 ? (
          <EmptyState message="Tidak ada kampanye yang menunggu persetujuan saat ini." />
        ) : (
          <div>
            <table className="w-full text-left border-collapse block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Tanggal Pengajuan</th>
                  <th className="p-4 font-bold w-1/3">Informasi Kampanye</th>
                  <th className="p-4 font-bold">Penggalang Dana</th>
                  <th className="p-4 font-bold">Target</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group divide-y divide-outline-variant/30">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="block md:table-row p-4 md:p-0 hover:bg-surface-container/30 transition-colors">
                    <td className="block md:table-cell py-1 md:p-4 text-sm font-medium text-on-surface-variant">
                      <span className="md:hidden text-xs uppercase font-bold block mb-1">Tanggal Pengajuan</span>
                      {new Date(campaign.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="block md:table-cell py-1 md:p-4 mt-2 md:mt-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded bg-surface-container-high flex-shrink-0 overflow-hidden hidden sm:flex">
                          {campaign.image_url ? (
                            <img src={campaign.image_url.startsWith('http') ? campaign.image_url : `http://localhost:5000${campaign.image_url}`} alt="thumbnail" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                              <FileText size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-inverse-surface line-clamp-1">{campaign.title}</p>
                          <p className="text-xs uppercase tracking-wider font-bold text-primary bg-primary/10 inline-block px-1.5 py-0.5 rounded mt-1">
                            {campaign.category?.name || 'Umum'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="block md:table-cell py-1 md:p-4 text-sm text-inverse-surface font-medium">
                      <span className="md:hidden text-xs uppercase font-bold block mb-1 mt-2 text-on-surface-variant">Penggalang Dana</span>
                      {campaign.campaigner?.name || 'Unknown'}
                    </td>
                    <td className="block md:table-cell py-1 md:p-4">
                      <span className="md:hidden text-xs uppercase font-bold block mb-1 mt-2 text-on-surface-variant">Target</span>
                      <p className="font-bold font-mono text-primary">{formatCurrency(campaign.target_amount)}</p>
                    </td>
                    <td className="block md:table-cell py-1 md:p-4 md:border-t-0 mt-3 md:mt-0 pt-3 md:pt-4 border-t border-outline-variant/30">
                      <div className="flex items-center justify-start md:justify-center gap-2">
                        <Link 
                          to={`/admin/approvals/campaigns/${campaign.id}`} 
                          className="flex items-center justify-center p-2 md:p-1.5 md:px-3 text-on-surface-variant hover:bg-surface-container-high rounded transition-colors bg-surface-container-high md:bg-transparent"
                          title="Lihat Detail"
                        >
                          <Eye size={18} /> <span className="hidden md:inline md:text-xs md:font-bold md:ml-1">Detail</span>
                        </Link>
                        <button 
                          onClick={() => setConfirmApproveModal({ isOpen: true, id: campaign.id })}
                          disabled={actionLoading}
                          className="flex items-center justify-center p-2 md:p-1.5 md:px-3 text-[#16A34A] hover:bg-[#16A34A]/10 rounded transition-colors bg-[#16A34A]/10 md:bg-transparent"
                          title="Setujui"
                        >
                          <CheckCircle size={18} /> <span className="hidden md:inline md:text-xs md:font-bold md:ml-1">Setujui</span>
                        </button>
                        <button 
                          onClick={() => openRejectModal(campaign)}
                          disabled={actionLoading}
                          className="flex items-center justify-center p-2 md:p-1.5 md:px-3 text-error hover:bg-error-container/50 rounded transition-colors bg-error-container/50 md:bg-transparent"
                          title="Tolak"
                        >
                          <XCircle size={18} /> <span className="hidden md:inline md:text-xs md:font-bold md:ml-1">Tolak</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md border border-primary/20 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-error flex items-center gap-2">
                <AlertCircle size={20} /> Tolak Kampanye
              </h3>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-on-surface-variant hover:text-error p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRejectSubmit} className="p-6">
              <p className="text-sm text-on-surface-variant mb-4">
                Anda akan menolak kampanye <strong>"{selectedCampaign?.title}"</strong>. Silakan berikan alasan penolakan agar penggalang dana dapat memperbaikinya.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-on-surface mb-2">Alasan Penolakan <span className="text-error">*</span></label>
                <textarea
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="4"
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary/20 focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
                  placeholder="Contoh: Dokumen legalitas kurang lengkap, atau deskripsi terlalu singkat..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-bold bg-error text-white hover:bg-[#B91C1C] rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Memproses...' : 'Tolak Kampanye'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Approve Modal */}
      <ConfirmModal
        isOpen={confirmApproveModal.isOpen}
        title="Setujui Kampanye"
        message="Apakah Anda yakin ingin menyetujui kampanye ini? Kampanye akan langsung aktif dan dapat menerima donasi."
        confirmText="Ya, Setujui"
        cancelText="Batal"
        type="success"
        onConfirm={() => handleApprove(confirmApproveModal.id)}
        onCancel={() => setConfirmApproveModal({ isOpen: false, id: null })}
      />

      </div>
    </div>
  );
};

export default CampaignApprovals;
