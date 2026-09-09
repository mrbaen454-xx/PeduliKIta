import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/public/Home';
import CampaignList from '../pages/public/CampaignList';
import CampaignDetail from '../pages/public/CampaignDetail';
import DonationFormPage from '../pages/public/DonationFormPage';

import DashboardCampaigner from '../pages/campaigner/Dashboard';
import MyCampaigns from '../pages/campaigner/MyCampaigns';
import CreateCampaign from '../pages/campaigner/CreateCampaign';
import ManageCampaign from '../pages/campaigner/ManageCampaign';

import DashboardDonor from '../pages/donor/Dashboard';

import AdminDashboard from '../pages/admin/Dashboard';
import CampaignApprovals from '../pages/admin/CampaignApprovals';
import CampaignApprovalDetail from '../pages/admin/CampaignApprovalDetail';
import DonationApprovals from '../pages/admin/DonationApprovals';
import CategoryManagement from '../pages/admin/CategoryManagement';

// Dummy components for skeleton routing
const NotFound = () => <div className="p-8"><h1 className="text-2xl font-bold text-red-500">404 Not Found</h1></div>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/donate/:id" element={<DonationFormPage />} />
        </Route>

        {/* CAMPAIGNER Routes with DashboardLayout */}
        <Route element={<ProtectedRoute allowedRoles={['CAMPAIGNER']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/campaigner/dashboard" element={<DashboardCampaigner />} />
            <Route path="/campaigner/campaigns" element={<MyCampaigns />} />
            <Route path="/campaigner/campaigns/create" element={<CreateCampaign />} />
            <Route path="/campaigner/campaigns/:id" element={<ManageCampaign />} />
          </Route>
        </Route>

        {/* DONOR Routes with DashboardLayout */}
        <Route element={<ProtectedRoute allowedRoles={['DONOR']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/donor/dashboard" element={<DashboardDonor />} />
          </Route>
        </Route>

        {/* ADMIN Routes with DashboardLayout */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/approvals/campaigns" element={<CampaignApprovals />} />
            <Route path="/admin/approvals/campaigns/:id" element={<CampaignApprovalDetail />} />
            <Route path="/admin/approvals/donations" element={<DonationApprovals />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
