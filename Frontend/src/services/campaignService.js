import api from './api';

const campaignService = {
  getAllCampaigns: async (params = {}) => {
    // Expected params: { search, category, status, sortBy, page, limit }
    const response = await api.get('/campaigns', { params });
    return response.data;
  },
  
  getCampaignById: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  getMyCampaigns: async () => {
    const response = await api.get('/campaigns/my');
    return response.data;
  },

  createCampaign: async (formData) => {
    const response = await api.post('/campaigns', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateCampaign: async (id, formData) => {
    const response = await api.put(`/campaigns/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteCampaign: async (id) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  closeCampaign: async (id) => {
    const response = await api.put(`/campaigns/${id}/close`);
    return response.data;
  },

  // Updates
  getCampaignUpdates: async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/updates`);
    return response.data;
  },
  
  createUpdate: async (campaignId, formData) => {
    const response = await api.post(`/campaigns/${campaignId}/updates`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  editUpdate: async (id, formData) => {
    const response = await api.put(`/updates/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  deleteUpdate: async (id) => {
    const response = await api.delete(`/updates/${id}`);
    return response.data;
  },

  // Documents
  getCampaignDocuments: async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/documents`);
    return response.data;
  },
  
  uploadDocument: async (campaignId, formData) => {
    const response = await api.post(`/campaigns/${campaignId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  }
};

export default campaignService;
