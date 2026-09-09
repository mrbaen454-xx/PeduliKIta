import React, { createContext, useState, useContext, useCallback } from 'react';
import campaignService from '../services/campaignService';

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortOption, setSortOption] = useState('newest'); 

  const fetchCampaigns = useCallback(async (page = 1, customLimit = null, overrides = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await campaignService.getAllCampaigns({
        page,
        limit: customLimit || 6,
        search: overrides.search !== undefined ? overrides.search : searchKeyword,
        category: overrides.category !== undefined ? overrides.category : selectedCategory,
        sortBy: overrides.sort !== undefined ? overrides.sort : sortOption,
        status: overrides.status !== undefined ? overrides.status : (selectedStatus || undefined)
      });
      
      setCampaigns(response.data || []);
      setPagination({
        currentPage: response.pagination?.page || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalItems: response.pagination?.totalItems || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data campaign.');
    } finally {
      setLoading(false);
    }
  }, [searchKeyword, selectedCategory, sortOption, selectedStatus]);

  const value = {
    campaigns,
    pagination,
    loading,
    error,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    selectedStatus,
    setSelectedStatus,
    fetchCampaigns
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => useContext(CampaignContext);
