import React, { useEffect, useState } from 'react';
import categoryService from '../../services/categoryService';
import { Loading, ErrorMessage } from '../../components/common/UIStates';
import { useToast } from '../../context/ToastContext';
import { Edit2, Trash2, Plus, Tag, X } from 'lucide-react';
import ConfirmModal from '../../components/common/ConfirmModal';
import ModernSelect from '../../components/common/ModernSelect';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE'
  });

  // Confirm Modal State
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ isOpen: false, id: null, name: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAllCategories();
      setCategories(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        status: category.status || 'ACTIVE'
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Nama kategori wajib diisi', 'error');
      return;
    }

    try {
      setActionLoading(true);
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        showToast('Kategori berhasil diperbarui', 'success');
      } else {
        await categoryService.createCategory(formData);
        showToast('Kategori berhasil ditambahkan', 'success');
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan kategori', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading(true);
      await categoryService.deleteCategory(id);
      showToast('Kategori berhasil dihapus', 'success');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menghapus kategori', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-primary/20 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-[28px] md:text-4xl font-bold text-inverse-surface font-serif mb-2">Manajemen Kategori</h1>
          <p className="text-on-surface-variant">Kelola kategori untuk klasifikasi kampanye donasi.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary-container text-white font-bold px-5 py-3 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-primary/20 overflow-hidden">
        <div>
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant text-xs uppercase tracking-wider">
                <th className="p-4 font-bold w-1/4">Nama Kategori</th>
                <th className="p-4 font-bold w-1/2">Deskripsi</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-outline-variant/30">
              {categories.map((category) => (
                <tr key={category.id} className="block md:table-row p-4 md:p-0 hover:bg-surface-container/30 transition-colors">
                  <td className="block md:table-cell py-1 md:p-4">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-primary hidden md:block" />
                      <span className="font-bold text-inverse-surface text-lg md:text-base">{category.name}</span>
                    </div>
                  </td>
                  <td className="block md:table-cell py-1 md:p-4 text-sm text-on-surface-variant mb-2 md:mb-0">
                    {category.description || '-'}
                  </td>
                  <td className="block md:table-cell py-1 md:p-4 mb-3 md:mb-0">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider inline-block ${
                      category.status === 'ACTIVE' 
                        ? 'bg-primary-fixed text-on-primary-fixed' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="block md:table-cell py-1 md:p-4 md:border-t-0 mt-3 md:mt-0 pt-3 md:pt-4 border-t border-outline-variant/30">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(category)}
                        disabled={actionLoading}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteModal({ isOpen: true, id: category.id, name: category.name })}
                        disabled={actionLoading}
                        className="p-1.5 text-error hover:bg-error-container/50 rounded transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-on-surface-variant">
                    Belum ada kategori. Silakan tambahkan kategori baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md border border-primary/20 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10 rounded-t-xl">
              <h3 className="font-bold text-lg text-inverse-surface flex items-center gap-2">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-1">Nama Kategori <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary/20 focus:ring-1 focus:ring-primary outline-none transition-colors text-sm font-bold"
                  placeholder="Cth: Tanggap Bencana"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary/20 focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
                  placeholder="Penjelasan singkat mengenai kategori ini..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-1">Status</label>
                <ModernSelect
                  options={[
                    { value: 'ACTIVE', label: 'ACTIVE' },
                    { value: 'INACTIVE', label: 'INACTIVE' }
                  ]}
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-bold bg-primary text-white hover:bg-primary-container rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDeleteModal.isOpen}
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus kategori "${confirmDeleteModal.name}"? Kategori yang sudah memiliki kampanye tidak dapat dihapus.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDestructive={true}
        onConfirm={() => handleDelete(confirmDeleteModal.id)}
        onCancel={() => setConfirmDeleteModal({ isOpen: false, id: null, name: '' })}
      />

      </div>
    </div>
  );
};

export default CategoryManagement;
