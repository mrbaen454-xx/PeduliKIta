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
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[var(--color-primary)]/20 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-[28px] md:text-4xl font-bold text-[var(--color-inverse-surface)] font-serif mb-2">Admin Dashboard</h1>
        <p className="text-[var(--color-on-surface-variant)]">Ringkasan statistik sistem dan antrean persetujuan.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Users Stats */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-[var(--color-primary)]/20 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--color-surface-container)] rounded text-[var(--color-primary)]">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider text-xs">Total Pengguna</h3>
          </div>
          <p className="text-3xl font-mono font-bold text-[var(--color-inverse-surface)]">{data.users?.total}</p>
          <div className="mt-4 flex flex-col gap-1 text-xs text-[var(--color-on-surface-variant)]">
            <div className="flex justify-between"><span>Donatur</span> <span className="font-bold">{data.users?.donors}</span></div>
            <div className="flex justify-between"><span>Campaigner</span> <span className="font-bold">{data.users?.campaigners}</span></div>
          </div>
        </div>

        {/* Campaigns Stats */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-[var(--color-primary)]/20 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--color-surface-container)] rounded text-[var(--color-primary)]">
              <FileText size={20} />
            </div>
            <h3 className="font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider text-xs">Kampanye</h3>
          </div>
          <p className="text-3xl font-mono font-bold text-[var(--color-inverse-surface)]">{data.campaigns?.total}</p>
          <div className="mt-4 flex flex-col gap-1 text-xs text-[var(--color-on-surface-variant)]">
            <div className="flex justify-between"><span>Aktif</span> <span className="font-bold">{data.campaigns?.active}</span></div>
            <div className="flex justify-between"><span>Menunggu Persetujuan</span> <span className="font-bold text-[#92400E] bg-[#FEF3C7] px-1 rounded">{data.campaigns?.pending}</span></div>
          </div>
        </div>

        {/* Donations Stats */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-[var(--color-primary)]/20 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--color-surface-container)] rounded text-[var(--color-primary)]">
              <Heart size={20} />
            </div>
            <h3 className="font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider text-xs">Donasi</h3>
          </div>
          <p className="text-3xl font-mono font-bold text-[var(--color-inverse-surface)]">{data.donations?.total}</p>
          <div className="mt-4 flex flex-col gap-1 text-xs text-[var(--color-on-surface-variant)]">
            <div className="flex justify-between"><span>Terverifikasi</span> <span className="font-bold">{data.donations?.verified}</span></div>
            <div className="flex justify-between"><span>Menunggu Verifikasi</span> <span className="font-bold text-[#92400E] bg-[#FEF3C7] px-1 rounded">{data.donations?.pending}</span></div>
          </div>
        </div>

        {/* Total Collected */}
        <div className="bg-[var(--color-inverse-surface)] text-white rounded-xl p-6 border border-[var(--color-primary)]/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-[var(--color-primary)] rounded text-white shadow-sm">
              <CheckCircle size={20} />
            </div>
            <h3 className="font-bold text-[var(--color-surface-container-high)] uppercase tracking-wider text-xs">Total Dana Tersalurkan</h3>
          </div>
          <p className="text-2xl md:text-3xl font-mono font-bold relative z-10 truncate" title={formatCurrency(data.totalCollected)}>
            {formatCurrency(data.totalCollected)}
          </p>
          <p className="text-xs text-[var(--color-surface-container-high)] mt-2 relative z-10">(Dari kampanye selesai)</p>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Heart size={120} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-[var(--color-primary)]/20 p-6 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-[var(--color-inverse-surface)] mb-4">Antrean Kampanye</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Terdapat <strong>{data.campaigns?.pending}</strong> kampanye baru yang menunggu persetujuan Anda.</p>
          <Link to="/admin/approvals/campaigns" className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white font-bold px-6 py-3 rounded-lg transition-colors">
            Cek Kampanye <XCircle size={16} className="rotate-45" />
          </Link>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-[var(--color-primary)]/20 p-6 shadow-sm">
          <h2 className="text-xl font-bold font-serif text-[var(--color-inverse-surface)] mb-4">Antrean Donasi</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Terdapat <strong>{data.donations?.pending}</strong> transaksi donasi yang menunggu verifikasi bukti transfer.</p>
          <Link to="/admin/approvals/donations" className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white font-bold px-6 py-3 rounded-lg transition-colors">
            Verifikasi Donasi <XCircle size={16} className="rotate-45" />
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
