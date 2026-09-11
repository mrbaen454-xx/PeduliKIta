import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import campaignService from '../../services/campaignService';
import adminService from '../../services/adminService';
import { Loading, ErrorMessage } from '../../components/common/UIStates';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, CheckCircle, XCircle, FileText, AlertCircle, MapPin, Target, Calendar } from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';

const CampaignApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Confirm Modal State
  const [confirmApproveModal, setConfirmApproveModal] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await campaignService.getCampaignById(id);
        setCampaign(res.data);
      } catch (err) {
        setError('Gagal memuat detail kampanye.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await adminService.approveCampaign(id);
      showToast('Kampanye berhasil disetujui!', 'success');
      navigate('/admin/approvals/campaigns');
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
      await adminService.rejectCampaign(id, rejectReason);
      showToast('Kampanye berhasil ditolak', 'success');
      navigate('/admin/approvals/campaigns');
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menolak kampanye', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  if (loading) return <Loading />;
  if (error || !campaign) return <ErrorMessage message={error || 'Kampanye tidak ditemukan'} />;

  const imageUrl = campaign.image_url 
    ? (campaign.image_url.startsWith('http') ? campaign.image_url : `http://localhost:5000${campaign.image_url}`)
    : null;

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-primary/20 p-6 md:p-8">
        <div className="mb-6">
        <Link to="/admin/approvals/campaigns" className="inline-flex items-center gap-2 text-primary font-bold hover:underline mb-4">
          <ArrowLeft size={16} /> Kembali ke Antrean
        </Link>
        <h1 className="text-[28px] md:text-4xl font-bold text-inverse-surface font-serif mb-2">Review Kampanye</h1>
        <p className="text-on-surface-variant">Tinjau kelengkapan data kampanye sebelum dipublikasikan ke publik.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-primary/20 overflow-hidden shadow-sm">
            {imageUrl ? (
              <img src={imageUrl} alt={campaign.title} className="w-full h-[300px] object-cover" />
            ) : (
              <div className="w-full h-[300px] bg-surface-container flex items-center justify-center">
                <FileText size={48} className="text-outline" />
              </div>
            )}
            
            <div className="p-6">
              <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                {campaign.category?.name || 'Umum'}
              </span>
              <h2 className="text-2xl font-bold font-serif text-inverse-surface mb-4">{campaign.title}</h2>
              
              <div className="prose max-w-none text-on-surface-variant mb-6 whitespace-pre-line">
                {campaign.description}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant mb-1">
                    <Target size={14} /> Target Dana
                  </div>
                  <p className="font-mono font-bold text-primary">{formatCurrency(campaign.target_amount)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant mb-1">
                    <Calendar size={14} /> Batas Waktu
                  </div>
                  <p className="font-bold text-inverse-surface">
                    {new Date(campaign.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant mb-1">
                    <MapPin size={14} /> Lokasi
                  </div>
                  <p className="font-bold text-inverse-surface">{campaign.location || 'Tidak disebutkan'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl border border-primary/20 p-6 shadow-sm">
            <h3 className="font-bold text-lg text-inverse-surface mb-4">Aksi Persetujuan</h3>
            
            {showRejectForm ? (
              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-1">Alasan Penolakan <span className="text-error">*</span></label>
                  <textarea
                    required
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows="4"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary/20 focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
                    placeholder="Sebutkan bagian yang kurang atau salah..."
                  ></textarea>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowRejectForm(false)}
                    className="flex-1 py-2 text-sm font-bold text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-2 text-sm font-bold bg-error text-white rounded-lg hover:bg-[#B91C1C] transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} /> Tolak
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => setConfirmApproveModal(true)}
                  disabled={actionLoading || campaign.status !== 'PENDING'}
                  className="w-full py-3 bg-[#16A34A] text-white font-bold rounded-lg hover:bg-[#15803D] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle size={18} /> Setujui Kampanye
                </button>
                <button 
                  onClick={() => setShowRejectForm(true)}
                  disabled={actionLoading || campaign.status !== 'PENDING'}
                  className="w-full py-3 bg-surface-container-lowest text-error border border-error font-bold rounded-lg hover:bg-error-container/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <XCircle size={18} /> Tolak Kampanye
                </button>
              </div>
            )}

            {campaign.status !== 'PENDING' && (
              <div className="mt-4 p-3 bg-surface-container rounded-lg flex gap-2 text-sm text-on-surface-variant">
                <AlertCircle size={16} className="text-primary shrink-0" />
                <p>Kampanye ini sudah tidak dalam status antrean (Status saat ini: <strong>{campaign.status}</strong>).</p>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface-variant mb-4">Informasi Penggalang Dana</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">
                {campaign.campaigner?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-bold text-inverse-surface">{campaign.campaigner?.name}</p>
                <p className="text-xs text-on-surface-variant">{campaign.campaigner?.email}</p>
              </div>
            </div>
            {campaign.campaigner?.phone && (
              <p className="text-sm text-on-surface-variant">No. HP: <span className="font-bold">{campaign.campaigner.phone}</span></p>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Confirm Approve Modal */}
      <ConfirmModal
        isOpen={confirmApproveModal}
        title="Setujui Kampanye"
        message="Apakah Anda yakin ingin menyetujui kampanye ini? Kampanye akan langsung aktif dan dapat menerima donasi."
        confirmText="Ya, Setujui"
        cancelText="Batal"
        type="success"
        onConfirm={handleApprove}
        onCancel={() => setConfirmApproveModal(false)}
      />
    </div>
  );
};

export default CampaignApprovalDetail;
