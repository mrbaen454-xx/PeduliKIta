import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { CampaignProvider } from './context/CampaignContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CampaignProvider>
          <AppRoutes />
        </CampaignProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
