import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { LayoutDashboard, Megaphone, PlusCircle, LogOut, CheckSquare, Tags, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  
  const getSidebarLinks = () => {
    if (!user) return [];
    if (user.role === 'CAMPAIGNER') {
      return [
        { name: 'Dashboard', path: '/campaigner/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Campaign Saya', path: '/campaigner/campaigns', icon: <Megaphone size={20} /> },
        { name: 'Tambah Campaign', path: '/campaigner/campaigns/create', icon: <PlusCircle size={20} /> },
      ];
    }
    if (user.role === 'DONOR') {
      return [
        { name: 'Dashboard', path: '/donor/dashboard', icon: <LayoutDashboard size={20} /> },
      ];
    }
    if (user.role === 'ADMIN') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Verifikasi Campaign', path: '/admin/approvals/campaigns', icon: <CheckSquare size={20} /> },
        { name: 'Verifikasi Donasi', path: '/admin/approvals/donations', icon: <CheckSquare size={20} /> },
        { name: 'Kategori', path: '/admin/categories', icon: <Tags size={20} /> },
      ];
    }
    return [];
  };

  const links = getSidebarLinks();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)]">
      <Navbar />
      <div className="flex flex-row flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sidebar */}
        {user?.role !== 'DONOR' && (
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-[var(--color-surface-container)]/70 backdrop-blur-2xl rounded-xl shadow-[0_20px_50px_rgba(0,107,44,0.12)] border border-[var(--color-primary)]/20 p-4 sticky top-28">
            <div className="pb-4 mb-4 border-b border-[var(--color-outline-variant)]/30">
              <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.role === 'CAMPAIGNER' ? 'Penggalang Dana' : user?.role}</p>
            </div>
            <nav className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/campaigner/campaigns'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>
        )}

        {/* Mobile Navigation */}
        {user?.role !== 'DONOR' && (
        <div className="md:hidden w-full mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/campaigner/campaigns'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
                    isActive 
                      ? 'bg-[var(--color-primary)] text-white font-medium shadow-md shadow-primary/20' 
                      : 'bg-surface-container-lowest text-gray-600 border border-[var(--color-primary)]'
                  }`
                }
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 w-full ${user?.role !== 'DONOR' ? 'md:ml-8' : ''}`}>
          <div className="bg-[var(--color-surface-container)]/70 backdrop-blur-2xl rounded-xl shadow-[0_20px_50px_rgba(0,107,44,0.12)] border border-[var(--color-primary)]/20 p-6 min-h-[500px] overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
