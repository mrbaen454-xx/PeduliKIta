import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import ModernSelect from '../common/ModernSelect';
import categoryService from '../../services/categoryService';
import { ImagePlus } from 'lucide-react';

const CampaignForm = ({ initialData, onSubmit, loading, buttonText }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    endDate: '',
    categoryId: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAllCategories().then(res => setCategories(res.data || []));
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        targetAmount: initialData.targetAmount || '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        categoryId: initialData.categoryId || '',
      });
      if (initialData.image_url) {
        setImagePreview(
          initialData.image_url.startsWith('http') 
            ? initialData.image_url 
            : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${initialData.image_url}`
        );
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('targetAmount', formData.targetAmount);
    const endOfDay = new Date(formData.endDate);
    endOfDay.setHours(23, 59, 59, 999);
    data.append('endDate', endOfDay.toISOString());
    data.append('categoryId', formData.categoryId);
    if (imageFile) {
      data.append('image', imageFile);
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-5">
          <Input
            label="Judul Kampanye"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Contoh: Bantuan Medis Adik Budi"
            required
            minLength={10}
          />

          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">
              Kategori
            </label>
            <ModernSelect
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              placeholder="Pilih Kategori"
              options={categories.map(c => ({ value: c.id, label: c.name }))}
            />
          </div>

          <Input
            label="Target Donasi (Rp)"
            name="targetAmount"
            type="number"
            value={formData.targetAmount}
            onChange={handleChange}
            placeholder="10000000"
            required
            min={10000}
          />

          <Input
            label="Batas Waktu (Tenggat)"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="md:col-span-1 flex flex-col">
          <label className="block text-sm font-bold text-on-surface mb-1">
            Gambar Kampanye
          </label>
          <div className="mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-outline-variant border-dashed rounded-lg flex-grow relative bg-surface hover:bg-surface-container transition-colors cursor-pointer min-h-[280px]" onClick={() => document.getElementById('image-upload').click()}>
            <div className="space-y-1 text-center flex flex-col items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-full object-cover rounded shadow-sm border border-outline-variant mb-4" />
              ) : (
                <ImagePlus className="mx-auto h-12 w-12 text-on-surface-variant mb-4" />
              )}
              <div className="flex text-sm text-on-surface-variant">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-surface-container-lowest px-4 py-2 border border-outline-variant rounded font-semibold text-primary hover:border-primary transition-colors focus-within:outline-none shadow-sm"
                  onClick={e => e.stopPropagation()}
                >
                  <span>Pilih file gambar</span>
                  <input id="image-upload" name="image" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                </label>
              </div>
              <p className="text-xs text-on-surface-variant mt-3">PNG, JPG, Maks 5MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-bold text-on-surface mb-1">
          Cerita / Deskripsi Lengkap
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={8}
          className="w-full px-4 py-3 border border-outline-variant rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-y transition-colors text-sm text-on-surface bg-surface-container-lowest shadow-sm"
          placeholder="Ceritakan alasan penggalangan dana ini dengan jelas dan jujur..."
        ></textarea>
      </div>

      <div className="pt-6 border-t border-outline-variant">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded font-bold hover:bg-primary-container transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? 'Menyimpan...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;
