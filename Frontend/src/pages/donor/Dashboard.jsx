import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import donationService from '../../services/donationService';
import { Loading, ErrorMessage, EmptyState } from '../../components/common/UIStates';
import { Heart, Clock, CheckCircle, Eye, X } from 'lucide-react';

const DonorDashboard = () => {
  const [data, setData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, donRes] = await Promise.all([
          userService.getDonorDashboard(),
          donationService.getMyDonations()
        ]);
        setData(dashRes.data);
        setDonations(donRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil data dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewDetails = async (id) => {
    setIsModalOpen(true);
    setModalLoading(true);
    try {
      const res = await donationService.getDonationById(id);
      setSelectedDonation(res.data);
    } catch (err) {
      console.error(err);
      setSelectedDonation(null);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'VERIFIED': return <span className="px-2 py-1 bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)] rounded text-xs font-bold uppercase tracking-wider">Terverifikasi</span>;
      case 'PENDING': return <span className="px-2 py-1 bg-[#FEF3C7] text-[#92400E] rounded text-xs font-bold uppercase tracking-wider">Menunggu</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-[var(--color-error-container)] text-[var(--color-on-error-container)] rounded text-xs font-bold uppercase tracking-wider">Ditolak</span>;
      default: return null;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1280px] mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[var(--color-primary)]/20 p-6 md:p-8">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2 text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase">
            <span>Dashboard Donatur</span>
          </div>
          <h1 className="text-[28px] md:text-4xl font-bold text-[var(--color-inverse-surface)] font-serif mb-2">Ringkasan Kebaikan Anda</h1>
          <p className="text-[var(--color-on-surface-variant)]">Terima kasih atas kontribusi Anda untuk membantu sesama.</p>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          
          <div className="bg-[var(--color-inverse-surface)] text-white rounded-xl p-6 border border-[var(--color-primary)]/20 relative overflow-hidden shadow-lg group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
              <Heart size={120} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-2 bg-[var(--color-primary)] rounded text-white shadow-sm">
                <CheckCircle size={20} />
              </div>
            </div>
            <p className="text-xs font-bold text-[var(--color-surface-container-high)] tracking-wider uppercase mb-2 relative z-10">Total Donasi (Terverifikasi)</p>
            <h3 className="text-2xl md:text-3xl font-mono font-bold relative z-10 truncate" title={formatCurrency(data.totalDonated)}>{formatCurrency(data.totalDonated)}</h3>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 border border-[var(--color-primary)]/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[var(--color-surface-container)] rounded text-[var(--color-primary)] shadow-sm">
                <Clock size={20} />
              </div>
            </div>
            <p className="text-xs font-bold text-[var(--color-on-surface-variant)] tracking-wider uppercase mb-2">Menunggu Verifikasi</p>
            <h3 className="text-3xl font-mono font-bold text-[var(--color-inverse-surface)] truncate">{data.donations?.pending || 0} <span className="text-sm font-normal text-[var(--color-on-surface-variant)]">transaksi</span></h3>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 border border-[var(--color-primary)]/20 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[var(--color-surface-container)] rounded text-[var(--color-primary)] shadow-sm">
                <Heart size={20} />
              </div>
            </div>
            <p className="text-xs font-bold text-[var(--color-on-surface-variant)] tracking-wider uppercase mb-2">Total Transaksi</p>
            <h3 className="text-3xl font-mono font-bold text-[var(--color-inverse-surface)] truncate">{data.donations?.total || 0} <span className="text-sm font-normal text-[var(--color-on-surface-variant)]">kali</span></h3>
          </div>

        </div>
        
        {/* Donation History Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-[var(--color-inverse-surface)] font-serif mb-6">Riwayat Donasi Anda</h2>
          
          {donations.length === 0 ? (
            <EmptyState message="Anda belum pernah melakukan donasi." />
          ) : (
            <div className="bg-surface-container-lowest border border-[var(--color-primary)]/20 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">Tanggal</th>
                      <th className="p-4 font-bold w-1/3">Campaign Tujuan</th>
                      <th className="p-4 font-bold">Nominal</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-outline-variant)]/30">
                    {donations.map((don) => (
                      <tr key={don.id} className="hover:bg-[var(--color-surface-container)]/30 transition-colors">
                        <td className="p-4 text-sm font-medium text-[var(--color-on-surface-variant)]">
                          {new Date(don.donated_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </td>
                        <td className="p-4">
                          <Link to={`/campaigns/${don.campaign?.id}`} className="font-bold text-[var(--color-inverse-surface)] hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                            {don.campaign?.title || 'Unknown Campaign'}
                          </Link>
                          {don.is_anonymous && <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-high)] px-2 py-0.5 rounded mt-1 inline-block">Hamba Allah</span>}
                        </td>
                        <td className="p-4">
                          <p className="font-bold font-mono text-[var(--color-primary)]">{formatCurrency(don.amount)}</p>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(don.status)}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleViewDetails(don.id)} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 rounded-lg transition-colors"
                          >
                            <Eye size={14} /> Detail
                          </button>
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

      {/* Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg border border-[var(--color-primary)]/20 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center bg-[var(--color-surface-container-lowest)]">
              <h3 className="font-bold text-lg text-[var(--color-inverse-surface)]">Detail Transaksi</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-on-surface-variant)] hover:text-error p-1 rounded-full hover:bg-error/10 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {modalLoading ? (
                <div className="py-10 flex justify-center"><div className="w-8 h-8 border-4 border-[var(--color-primary)]/20 border-t-transparent rounded-full animate-spin"></div></div>
              ) : selectedDonation ? (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    selectedDonation.status === 'VERIFIED' ? 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]' :
                    selectedDonation.status === 'REJECTED' ? 'bg-error-container text-on-error-container' : 'bg-[#FEF3C7] text-[#92400E]'
                  }`}>
                    {selectedDonation.status === 'VERIFIED' && <CheckCircle size={24} />}
                    {selectedDonation.status === 'PENDING' && <Clock size={24} />}
                    {selectedDonation.status === 'REJECTED' && <X size={24} />}
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider">Status Donasi</p>
                      <p className="text-xs">{
                        selectedDonation.status === 'VERIFIED' ? 'Berhasil Diverifikasi' :
                        selectedDonation.status === 'REJECTED' ? 'Donasi Ditolak / Tidak Valid' : 'Menunggu Verifikasi Admin'
                      }</p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--color-on-surface-variant)] text-xs mb-1">Tanggal Donasi</p>
                      <p className="font-bold text-[var(--color-inverse-surface)]">{new Date(selectedDonation.donated_at).toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-[var(--color-on-surface-variant)] text-xs mb-1">Nominal</p>
                      <p className="font-bold text-[var(--color-primary)] font-mono text-lg">{formatCurrency(selectedDonation.amount)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[var(--color-on-surface-variant)] text-xs mb-1">Kampanye Tujuan</p>
                    <p className="font-bold text-[var(--color-inverse-surface)]">{selectedDonation.campaign?.title}</p>
                  </div>

                  {selectedDonation.message && (
                    <div>
                      <p className="text-[var(--color-on-surface-variant)] text-xs mb-1">Pesan / Doa</p>
                      <p className="bg-[var(--color-surface-container)] p-3 rounded-lg text-sm italic border-l-4 border-[var(--color-primary)]/20">"{selectedDonation.message}"</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[var(--color-on-surface-variant)] text-xs mb-2">Bukti Transfer</p>
                    {selectedDonation.proof_url ? (
                      <img src={`http://localhost:5000${selectedDonation.proof_url}`} alt="Bukti Transfer" className="w-full rounded-lg border border-[var(--color-outline-variant)]/30 object-contain max-h-64 bg-gray-50" />
                    ) : (
                      <p className="text-sm text-gray-500 italic">Tidak ada bukti transfer dilampirkan.</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">Gagal memuat detail donasi.</p>
              )}
            </div>
            
            <div className="p-4 border-t border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-lowest)] flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] rounded-lg font-bold transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DonorDashboard;
