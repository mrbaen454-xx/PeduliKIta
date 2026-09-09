import React, { useEffect, useState } from 'react';
import categoryService from '../../services/categoryService';
import { Loading, ErrorMessage } from '../../components/common/UIStates';
import { useToast } from '../../context/ToastContext';
import { Edit2, Trash2, Plus, Tag, X } from 'lucide-react';

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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"? Kategori yang sudah memiliki kampanye tidak dapat dihapus.`)) return;
    
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
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[var(--color-primary)]/20 p-6 md:p-8">
        <div className="flex flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-[28px] md:text-4xl font-bold text-[var(--color-inverse-surface)] font-serif mb-2">Manajemen Kategori</h1>
          <p className="text-[var(--color-on-surface-variant)]">Kelola kategori untuk klasifikasi kampanye donasi.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)] text-white font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Tambah Kategori
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[var(--color-primary)]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]/30 text-[var(--color-on-surface-variant)] text-xs uppercase tracking-wider">
                <th className="p-4 font-bold w-1/4">Nama Kategori</th>
                <th className="p-4 font-bold w-1/2">Deskripsi</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]/30">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-[var(--color-surface-container)]/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-[var(--color-primary)]" />
                      <span className="font-bold text-[var(--color-inverse-surface)]">{category.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--color-on-surface-variant)] line-clamp-2">
                    {category.description || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      category.status === 'ACTIVE' 
                        ? 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(category)}
                        disabled={actionLoading}
                        className="p-1.5 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={actionLoading}
                        className="p-1.5 text-[var(--color-error)] hover:bg-[var(--color-error-container)]/50 rounded transition-colors"
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
                  <td colSpan="4" className="p-8 text-center text-[var(--color-on-surface-variant)]">
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
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md border border-[var(--color-primary)]/20 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center bg-[var(--color-surface-container-lowest)]">
              <h3 className="font-bold text-lg text-[var(--color-inverse-surface)] flex items-center gap-2">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
              </h3>
              <button onClick={handleCloseModal} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-1">Nama Kategori <span className="text-[var(--color-error)]">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-lg focus:border-[var(--color-primary)]/20 focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors text-sm font-bold"
                  placeholder="Cth: Tanggap Bencana"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-lg focus:border-[var(--color-primary)]/20 focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors text-sm"
                  placeholder="Penjelasan singkat mengenai kategori ini..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--color-on-surface)] mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-lg focus:border-[var(--color-primary)]/20 focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-colors text-sm font-bold"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-outline-variant)]/30 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-bold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-container)] rounded-lg transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Menyimpan...' : 'Simpan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default CategoryManagement;
