import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import { Loading, ErrorMessage } from '../../components/common/UIStates';
import { Users, FileText, Heart, Clock, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userService.getAdminDashboard();
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data dashboard admin');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  };

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-primary/20 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-[28px] md:text-4xl font-bold text-inverse-surface font-serif mb-2">Admin Dashboard</h1>
        <p className="text-on-surface-variant">Ringkasan statistik sistem dan antrean persetujuan.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Users Stats */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-primary/20 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-surface-container rounded text-primary flex-shrink-0">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-on-surface-variant uppercase tracking-wider text-xs truncate">Total Pengguna</h3>
          </div>
          <p className="text-3xl font-mono font-bold text-inverse-surface truncate">{data.users?.total}</p>
          <div className="mt-4 flex flex-col gap-1 text-xs text-on-surface-variant">
            <div className="flex justify-between items-center gap-2"><span>Donatur</span> <span className="font-bold">{data.users?.donors}</span></div>
            <div className="flex justify-between items-center gap-2"><span>Campaigner</span> <span className="font-bold">{data.users?.campaigners}</span></div>
          </div>
        </div>

        {/* Campaigns Stats */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-primary/20 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-surface-container rounded text-primary flex-shrink-0">
              <FileText size={20} />
            </div>
            <h3 className="font-bold text-on-surface-variant uppercase tracking-wider text-xs truncate">Kampanye</h3>
          </div>
          <p className="text-3xl font-mono font-bold text-inverse-surface truncate">{data.campaigns?.total}</p>
          <div className="mt-4 flex flex-col gap-1 text-xs text-on-surface-variant">
            <div className="flex justify-between items-center gap-2"><span>Aktif</span> <span className="font-bold">{data.campaigns?.active}</span></div>
            <div className="flex justify-between items-center gap-2"><span className="truncate">Menunggu Persetujuan</span> <span className="font-bold text-[#92400E] bg-[#FEF3C7] px-1 rounded flex-shrink-0">{data.campaigns?.pending}</span></div>
          </div>
        </div>

        {/* Donations Stats */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-primary/20 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-surface-container rounded text-primary flex-shrink-0">
              <Heart size={20} />
            </div>
            <h3 className="font-bold text-on-surface-variant uppercase tracking-wider text-xs truncate">Donasi</h3>
          </div>
          <p className="text-3xl font-mono font-bold text-inverse-surface truncate">{data.donations?.total}</p>
          <div className="mt-4 flex flex-col gap-1 text-xs text-on-surface-variant">
            <div className="flex justify-between items-center gap-2"><span>Terverifikasi</span> <span className="font-bold">{data.donations?.verified}</span></div>
            <div className="flex justify-between items-center gap-2"><span className="truncate">Menunggu Verifikasi</span> <span className="font-bold text-[#92400E] bg-[#FEF3C7] px-1 rounded flex-shrink-0">{data.donations?.pending}</span></div>
          </div>
        </div>

        {/* Total Collected */}
        <div className="bg-inverse-surface text-white rounded-xl p-6 border border-primary/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-primary rounded text-white shadow-sm flex-shrink-0">
              <CheckCircle size={20} />
            </div>
            <h3 className="font-bold text-surface-container-high uppercase tracking-wider text-xs truncate">Total Dana Tersalurkan</h3>
          </div>
          <p className="text-2xl md:text-3xl font-mono font-bold relative z-10 truncate" title={formatCurrency(data.totalCollected)}>
            {formatCurrency(data.totalCollected)}
          </p>
          <p className="text-xs text-surface-container-high mt-2 relative z-10 truncate">(Dari kampanye selesai)</p>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Heart size={120} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-primary/20 p-6 shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold font-serif text-inverse-surface mb-4 truncate">Antrean Kampanye</h2>
          <p className="text-sm text-on-surface-variant mb-6">Terdapat <strong>{data.campaigns?.pending}</strong> kampanye baru yang menunggu persetujuan Anda.</p>
          <Link to="/admin/approvals/campaigns" className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-primary hover:bg-primary-container text-white font-bold px-6 py-3 rounded-lg transition-colors">
            <span className="truncate">Cek Kampanye</span> <XCircle size={16} className="rotate-45 flex-shrink-0" />
          </Link>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-primary/20 p-6 shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold font-serif text-inverse-surface mb-4 truncate">Antrean Donasi</h2>
          <p className="text-sm text-on-surface-variant mb-6">Terdapat <strong>{data.donations?.pending}</strong> transaksi donasi yang menunggu verifikasi bukti transfer.</p>
          <Link to="/admin/approvals/donations" className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-primary hover:bg-primary-container text-white font-bold px-6 py-3 rounded-lg transition-colors">
            <span className="truncate">Verifikasi Donasi</span> <XCircle size={16} className="rotate-45 flex-shrink-0" />
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
