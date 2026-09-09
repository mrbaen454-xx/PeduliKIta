import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { Loading, ErrorMessage, EmptyState } from '../../components/common/UIStates';
import { useToast } from '../../context/ToastContext';
import { CheckCircle, XCircle, Eye, X, Image as ImageIcon } from 'lucide-react';

const DonationApprovals = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const fetchPendingDonations = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPendingDonations();
      setDonations(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat antrean donasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDonations();
  }, []);

  const handleVerify = async (id) => {
    try {
      setActionLoading(true);
      await adminService.verifyDonation(id);
      showToast('Donasi berhasil diverifikasi!', 'success');
      setIsModalOpen(false);
      fetchPendingDonations();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal memverifikasi donasi', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menolak donasi ini? Status tidak dapat dikembalikan.')) return;
    
    try {
      setActionLoading(true);
      await adminService.rejectDonation(id);
      showToast('Donasi berhasil ditolak', 'success');
      setIsModalOpen(false);
      fetchPendingDonations();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menolak donasi', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openDetailModal = (donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[var(--color-primary)]/20 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-[28px] md:text-4xl font-bold text-[var(--color-inverse-surface)] font-serif mb-2">Verifikasi Donasi</h1>
        <p className="text-[var(--color-on-surface-variant)]">Periksa bukti transfer donatur sebelum dana diteruskan ke kampanye.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[var(--color-primary)]/20 overflow-hidden">
        {donations.length === 0 ? (
          <EmptyState message="Tidak ada transaksi donasi yang menunggu verifikasi." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Waktu Transaksi</th>
                  <th className="p-4 font-bold">Donatur</th>
                  <th className="p-4 font-bold w-1/3">Kampanye Tujuan</th>
                  <th className="p-4 font-bold">Nominal</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]/30">
                {donations.map((don) => (
                  <tr key={don.id} className="hover:bg-[var(--color-surface-container)]/30 transition-colors">
                    <td className="p-4 text-sm font-medium text-[var(--color-on-surface-variant)]">
                      {new Date(don.donated_at).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-[var(--color-inverse-surface)]">
                        {don.is_anonymous ? 'Hamba Allah' : (don.donor?.name || 'Unknown')}
                      </p>
                      {don.is_anonymous && (
                        <p className="text-xs text-[var(--color-on-surface-variant)]">(Asli: {don.donor?.name})</p>
                      )}
                    </td>
                    <td className="p-4 text-sm text-[var(--color-inverse-surface)] font-medium line-clamp-2">
                      {don.campaign?.title || 'Unknown Campaign'}
                    </td>
                    <td className="p-4">
                      <p className="font-bold font-mono text-[var(--color-primary)] text-lg">{formatCurrency(don.amount)}</p>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => openDetailModal(don)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 rounded-lg transition-colors"
                      >
                        <Eye size={14} /> Cek Bukti
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {isModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-20 pb-20">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-2xl border border-[var(--color-primary)]/20 flex flex-col my-auto">
            <div className="p-4 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center bg-[var(--color-surface-container-lowest)] sticky top-0 rounded-t-xl z-10">
              <h3 className="font-bold text-lg text-[var(--color-inverse-surface)]">Pemeriksaan Bukti Transfer</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-on-surface-variant)] hover:text-error p-1 rounded-full hover:bg-error/10 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-row gap-6">
              {/* Image Section */}
              <div className="w-full md:w-1/2 flex flex-col">
                <p className="text-sm font-bold text-[var(--color-on-surface)] mb-2 flex items-center gap-2">
                  <ImageIcon size={16} /> Bukti Transfer
                </p>
                <div className="bg-gray-50 border border-[var(--color-outline-variant)]/30 rounded-lg p-2 flex-grow flex items-center justify-center min-h-[300px]">
                  {selectedDonation.proof_url ? (
                    <img 
                      src={selectedDonation.proof_url.startsWith('http') ? selectedDonation.proof_url : `http://localhost:5000${selectedDonation.proof_url}`} 
                      alt="Bukti Transfer" 
                      className="max-w-full max-h-[400px] object-contain rounded"
                    />
                  ) : (
                    <p className="text-sm text-gray-500 italic">Tidak ada lampiran.</p>
                  )}
                </div>
              </div>

              {/* Data Section */}
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div>
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Nominal Konfirmasi</p>
                  <p className="text-3xl font-mono font-bold text-[var(--color-primary)]">{formatCurrency(selectedDonation.amount)}</p>
                </div>

                <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/30 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Donatur</p>
                    <p className="font-bold text-[var(--color-inverse-surface)] text-sm">{selectedDonation.donor?.name} {selectedDonation.is_anonymous && '(Anonim)'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Kampanye Tujuan</p>
                    <p className="font-bold text-[var(--color-inverse-surface)] text-sm leading-tight">{selectedDonation.campaign?.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">Waktu Transaksi</p>
                    <p className="font-bold text-[var(--color-inverse-surface)] text-sm">{new Date(selectedDonation.donated_at).toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {selectedDonation.message && (
                  <div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-1">Pesan / Doa</p>
                    <p className="bg-[var(--color-surface-container)] p-3 rounded-lg text-sm italic text-[var(--color-on-surface-variant)]">
                      "{selectedDonation.message}"
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-lowest)] flex justify-end gap-3 sticky bottom-0 rounded-b-xl">
              <button 
                onClick={() => handleReject(selectedDonation.id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-[var(--color-error-container)] text-[var(--color-on-error-container)] hover:bg-[#B91C1C] hover:text-white rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <XCircle size={18} /> Tolak Bukti
              </button>
              <button 
                onClick={() => handleVerify(selectedDonation.id)}
                disabled={actionLoading}
                className="px-6 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                <CheckCircle size={18} /> Verifikasi Valid
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default DonationApprovals;
