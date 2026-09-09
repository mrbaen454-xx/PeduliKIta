import api from './api';

const donationService = {
  createDonation: async (formData) => {
    const response = await api.post('/donations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  getMyDonations: async () => {
    const response = await api.get('/donations/my');
    return response.data;
  },

  getDonationById: async (id) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  }
};

export default donationService;
