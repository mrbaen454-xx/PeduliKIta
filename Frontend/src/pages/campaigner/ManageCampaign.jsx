import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Activity, FileText, Megaphone, Plus, Trash2, Image as ImageIcon, Edit } from 'lucide-react';
import campaignService from '../../services/campaignService';
import { useToast } from '../../context/ToastContext';
import { Loading, ErrorMessage } from '../../components/common/UIStates';
import ConfirmModal from '../../components/common/ConfirmModal';
import CampaignForm from '../../components/form/CampaignForm';

const ManageCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [campaign, setCampaign] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('updates'); // 'updates' | 'documents' | 'edit'
  
  // Forms states
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [editingUpdateId, setEditingUpdateId] = useState(null);
  const [updateForm, setUpdateForm] = useState({ title: '', content: '', image: null });
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [docForm, setDocForm] = useState({ file: null });
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  const [confirmDeleteUpdateModal, setConfirmDeleteUpdateModal] = useState({ isOpen: false, id: null });
  const [confirmDeleteDocModal, setConfirmDeleteDocModal] = useState({ isOpen: false, id: null });

  const fetchAllData = async () => {
    try {
      const [campRes, updatesRes, docsRes] = await Promise.all([
        campaignService.getCampaignById(id),
        campaignService.getCampaignUpdates(id).catch(() => ({ data: [] })),
        campaignService.getCampaignDocuments(id).catch(() => ({ data: [] }))
      ]);
      setCampaign(campRes.data);
      setUpdates(updatesRes.data || []);
      setDocuments(docsRes.data || []);
    } catch (err) {
      showToast('Gagal memuat data kampanye', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const handleEditCampaign = async (formData) => {
    setIsEditingCampaign(true);
    try {
      await campaignService.updateCampaign(id, formData);
      showToast('Kampanye berhasil diperbarui', 'success');
      fetchAllData();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const errorMsg = data.errors.map(e => `${e.field}: ${e.message}`).join(', ');
        showToast(`Validasi gagal: ${errorMsg}`, 'error');
      } else {
        showToast(data?.message || 'Gagal memperbarui kampanye', 'error');
      }
    } finally {
      setIsEditingCampaign(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateForm.title || !updateForm.content) return showToast('Judul dan konten wajib diisi', 'error');
    
    setIsSubmittingUpdate(true);
    const formData = new FormData();
    formData.append('title', updateForm.title);
    formData.append('content', updateForm.content);
    if (updateForm.image) formData.append('image', updateForm.image);

    try {
      if (editingUpdateId) {
        await campaignService.editUpdate(editingUpdateId, formData);
        showToast('Kabar terbaru berhasil diperbarui', 'success');
      } else {
        await campaignService.createUpdate(id, formData);
        showToast('Kabar terbaru berhasil ditambahkan', 'success');
      }
      setUpdateForm({ title: '', content: '', image: null });
      setIsAddingUpdate(false);
      setEditingUpdateId(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan kabar terbaru', 'error');
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  const handleUpdateDelete = async (updateId) => {
    try {
      await campaignService.deleteUpdate(updateId);
      showToast('Kabar terbaru dihapus', 'success');
      fetchAllData();
    } catch (err) {
      showToast('Gagal menghapus', 'error');
    }
  };

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!docForm.file) return showToast('Pilih file dokumen terlebih dahulu', 'error');
    
    setIsSubmittingDoc(true);
    const formData = new FormData();
    formData.append('document', docForm.file);

    try {
      await campaignService.uploadDocument(id, formData);
      showToast('Dokumen berhasil diunggah', 'success');
      setDocForm({ file: null });
      setIsAddingDoc(false);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal mengunggah dokumen', 'error');
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleDocDelete = async (docId) => {
    try {
      await campaignService.deleteDocument(docId);
      showToast('Dokumen dihapus', 'success');
      fetchAllData();
    } catch (err) {
      showToast('Gagal menghapus dokumen', 'error');
    }
  };

  if (loading) return <Loading />;
  if (!campaign) return <ErrorMessage message="Kampanye tidak ditemukan" />;

  const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0);
  const percent = Math.min((campaign.collected_amount / campaign.target_amount) * 100, 100);

  const editInitialData = campaign ? {
    title: campaign.title,
    description: campaign.description,
    targetAmount: campaign.target_amount,
    endDate: campaign.end_date,
    categoryId: campaign.category?.id || campaign.category_id,
    image_url: campaign.image_url
  } : null;

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-primary/20 p-6 md:p-8">
      <Link to="/campaigner/campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={16} /> Kembali ke Daftar Kampanye
      </Link>

      {/* Campaign Header Summary */}
      <div className="bg-surface-container-lowest rounded-xl p-6 border border-primary/20 shadow-sm mb-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 aspect-[4/3] rounded-lg overflow-hidden bg-surface-container">
          {campaign.image_url ? (
            <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-outline text-sm">Tanpa Gambar</div>
          )}
        </div>
        <div className="w-full md:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex gap-2 mb-3">
              <span className="bg-surface-container text-primary text-xs font-bold px-2.5 py-1 rounded-full">{campaign.category?.name}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${campaign.status === 'ACTIVE' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-gray-100 text-gray-700'}`}>{campaign.status}</span>
            </div>
            <h1 className="text-2xl font-bold text-inverse-surface mb-2 line-clamp-2">{campaign.title}</h1>
            <p className="text-sm text-on-surface-variant mb-4 flex items-center gap-2">
              <Clock size={14} /> Dibuat pada {new Date(campaign.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:gap-0 mb-2">
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Terkumpul</p>
                <p className="font-mono text-xl font-bold text-primary break-words">{formatCurrency(campaign.collected_amount)}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs text-on-surface-variant mb-1">Target</p>
                <p className="font-mono font-bold text-inverse-surface break-words">{formatCurrency(campaign.target_amount)}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all" style={{ width: `${percent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-outline-variant/30 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button 
          onClick={() => setActiveTab('updates')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'updates' ? 'border-primary/20 text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
        >
          <Megaphone size={16} /> Kabar Terbaru
        </button>
        <button 
          onClick={() => setActiveTab('documents')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'documents' ? 'border-primary/20 text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
        >
          <FileText size={16} /> Dokumen Laporan
        </button>
        <button 
          onClick={() => setActiveTab('edit')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'edit' ? 'border-primary/20 text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
        >
          <Edit size={16} /> Edit Kampanye
        </button>
      </div>

      {/* Updates Tab */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-inverse-surface">Kabar Terbaru</h2>
              <p className="text-sm text-on-surface-variant">Bagikan perkembangan kampanye kepada donatur Anda.</p>
            </div>
            {!isAddingUpdate && (
              <button onClick={() => setIsAddingUpdate(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-container">
                <Plus size={16} /> Tulis Kabar
              </button>
            )}
          </div>

          {isAddingUpdate && (
            <form onSubmit={handleUpdateSubmit} className="bg-surface-container-lowest p-6 rounded-xl border border-primary/20 shadow-sm">
              <h3 className="text-md font-bold mb-4 text-inverse-surface">
                {editingUpdateId ? 'Edit Kabar' : 'Tulis Kabar Baru'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-on-surface mb-2">Judul</label>
                  <input type="text" value={updateForm.title} onChange={e => setUpdateForm({...updateForm, title: e.target.value})} className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:border-primary/20 focus:outline-none" placeholder="Misal: Penyaluran Dana Tahap 1" required />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-on-surface mb-2">Isi Kabar</label>
                  <textarea rows="4" value={updateForm.content} onChange={e => setUpdateForm({...updateForm, content: e.target.value})} className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:border-primary/20 focus:outline-none" placeholder="Ceritakan perkembangan terbaru..." required></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-on-surface mb-2">Foto Dokumentasi (Opsional)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-surface-container px-4 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-surface-container-high">
                      <ImageIcon size={16} /> Pilih Foto
                      <input type="file" accept="image/*" className="hidden" onChange={e => setUpdateForm({...updateForm, image: e.target.files[0]})} />
                    </label>
                    <span className="text-sm text-on-surface-variant">{updateForm.image ? updateForm.image.name : 'Tidak ada foto dipilih'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsAddingUpdate(false); setEditingUpdateId(null); setUpdateForm({ title: '', content: '', image: null }); }} className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg">Batal</button>
                <button type="submit" disabled={isSubmittingUpdate} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg disabled:opacity-50">
                  {isSubmittingUpdate ? 'Menyimpan...' : (editingUpdateId ? 'Simpan Perubahan' : 'Bagikan Kabar')}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {updates.length === 0 ? (
              <div className="bg-surface p-8 rounded-xl text-center border border-outline-variant/30">
                <p className="text-on-surface-variant text-sm">Belum ada kabar terbaru. Tulis kabar untuk menjaga kepercayaan donatur!</p>
              </div>
            ) : (
              updates.map(update => (
                <div key={update.id} className="bg-surface-container-lowest p-5 rounded-xl border border-primary/20 flex gap-4">
                  {update.image_url && (
                    <img src={update.image_url} alt="Update" className="w-24 h-24 object-cover rounded-lg border border-outline-variant/20 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-inverse-surface">{update.title}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setUpdateForm({ title: update.title, content: update.content, image: null });
                          setEditingUpdateId(update.id);
                          setIsAddingUpdate(true);
                        }} className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => setConfirmDeleteUpdateModal({ isOpen: true, id: update.id })} className="text-error hover:bg-error/10 p-1.5 rounded transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-3">{new Date(update.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                    <p className="text-sm text-on-surface whitespace-pre-wrap">{update.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-inverse-surface">Dokumen Laporan</h2>
              <p className="text-sm text-on-surface-variant">Unggah bukti penyaluran dana, kuitansi, atau dokumen terkait.</p>
            </div>
            {!isAddingDoc && (
              <button onClick={() => setIsAddingDoc(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-container">
                <Plus size={16} /> Unggah Dokumen
              </button>
            )}
          </div>

          {isAddingDoc && (
            <form onSubmit={handleDocSubmit} className="bg-surface-container-lowest p-6 rounded-xl border border-primary/20 shadow-sm">
              <h3 className="text-md font-bold mb-4 text-inverse-surface">Unggah Dokumen Baru</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-on-surface mb-2">Pilih File (PDF / Gambar)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-surface-container px-4 py-2 rounded-lg text-sm font-semibold text-primary hover:bg-surface-container-high">
                      <FileText size={16} /> Browse File
                      <input type="file" accept=".pdf,image/*" className="hidden" onChange={e => setDocForm({ file: e.target.files[0] })} />
                    </label>
                    <span className="text-sm text-on-surface-variant">{docForm.file ? docForm.file.name : 'Belum ada file dipilih'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddingDoc(false)} className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg">Batal</button>
                <button type="submit" disabled={isSubmittingDoc} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg disabled:opacity-50">
                  {isSubmittingDoc ? 'Mengunggah...' : 'Unggah Dokumen'}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.length === 0 ? (
              <div className="col-span-full bg-surface p-8 rounded-xl text-center border border-outline-variant/30">
                <p className="text-on-surface-variant text-sm">Belum ada dokumen yang diunggah.</p>
              </div>
            ) : (
              documents.map(doc => (
                <div key={doc.id} className="bg-surface-container-lowest p-4 rounded-xl border border-primary/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded bg-surface-container text-primary flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-sm text-inverse-surface truncate" title={doc.file_name}>{doc.file_name}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">{new Date(doc.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline px-2">Lihat</a>
                    <button onClick={() => setConfirmDeleteDocModal({ isOpen: true, id: doc.id })} className="text-error hover:bg-error/10 p-1.5 rounded transition-colors" title="Hapus">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Kampanye Tab */}
      {activeTab === 'edit' && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-primary/20 shadow-sm">
            <h2 className="text-lg font-bold text-inverse-surface mb-6">Edit Informasi Kampanye</h2>
            {editInitialData && (
              <CampaignForm 
                initialData={editInitialData}
                onSubmit={handleEditCampaign}
                loading={isEditingCampaign}
                buttonText="Simpan Perubahan"
              />
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDeleteUpdateModal.isOpen}
        title="Hapus Kabar Terbaru"
        message="Apakah Anda yakin ingin menghapus kabar terbaru ini? Data yang dihapus tidak dapat dikembalikan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDestructive={true}
        onConfirm={() => handleUpdateDelete(confirmDeleteUpdateModal.id)}
        onCancel={() => setConfirmDeleteUpdateModal({ isOpen: false, id: null })}
      />

      <ConfirmModal
        isOpen={confirmDeleteDocModal.isOpen}
        title="Hapus Dokumen"
        message="Apakah Anda yakin ingin menghapus dokumen ini?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDestructive={true}
        onConfirm={() => handleDocDelete(confirmDeleteDocModal.id)}
        onCancel={() => setConfirmDeleteDocModal({ isOpen: false, id: null })}
      />

      </div>
    </div>
  );
};

export default ManageCampaign;
