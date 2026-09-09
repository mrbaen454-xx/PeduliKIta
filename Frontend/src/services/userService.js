import api from './api';

const userService = {
  getCampaignerDashboard: async () => {
    const response = await api.get('/campaigner/dashboard');
    return response.data;
  },
  
  getDonorDashboard: async () => {
    const response = await api.get('/donor/dashboard');
    return response.data;
  },
  
  getAdminDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }
};

export default userService;
