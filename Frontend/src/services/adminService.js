import api from './api';

const adminService = {
  getPendingCampaigns: async () => {
    const response = await api.get('/admin/campaigns/pending');
    return response.data;
  },

  approveCampaign: async (id) => {
    const response = await api.put(`/admin/campaigns/${id}/approve`);
    return response.data;
  },

  rejectCampaign: async (id, reason) => {
    const response = await api.put(`/admin/campaigns/${id}/reject`, { rejectionReason: reason });
    return response.data;
  },

  getPendingDonations: async () => {
    const response = await api.get('/admin/donations/pending');
    return response.data;
  },

  verifyDonation: async (id) => {
    const response = await api.put(`/admin/donations/${id}/verify`);
    return response.data;
  },

  rejectDonation: async (id) => {
    const response = await api.put(`/admin/donations/${id}/reject`);
    return response.data;
  },
  
  // Future use
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  }
};

export default adminService;
