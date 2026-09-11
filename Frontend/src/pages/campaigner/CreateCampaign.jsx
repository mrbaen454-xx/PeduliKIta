import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampaignForm from '../../components/form/CampaignForm';
import campaignService from '../../services/campaignService';
import { ErrorMessage } from '../../components/common/UIStates';

const CreateCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await campaignService.createCampaign(formData);
      navigate('/campaigner/campaigns');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat campaign. Pastikan semua data terisi dengan benar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-primary/20 p-6 md:p-8">
        <div className="mb-8">
        <h1 className="text-headline-sm font-bold text-on-surface">Buat Kampanye Baru</h1>
        <p className="text-on-surface-variant mt-1 text-sm">Isi detail penggalangan dana Anda dengan transparan.</p>
      </div>

      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

      <div className="mt-6">
        <CampaignForm 
          onSubmit={handleSubmit} 
          loading={loading} 
          buttonText="Ajukan Kampanye" 
        />
      </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
