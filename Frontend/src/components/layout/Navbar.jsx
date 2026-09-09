import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'CAMPAIGNER': return '/campaigner/dashboard';
      case 'DONOR': return '/donor/dashboard';
      default: return '/';
    }
  };

  // Helper function to check if a link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Nav link styles
  const desktopLinkStyle = (path) => `
    relative text-sm font-bold transition-all duration-300 py-1.5 px-5 rounded-full
    ${isActive(path) ? 'bg-primary/15 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-primary'}
  `;

  return (
    <div className="sticky top-4 z-50 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto mb-6 w-full transition-all">
      <nav className="bg-surface-container-lowest/95 backdrop-blur-md rounded-xl border border-outline-variant/60 shadow-sm px-2 transition-all">
        <div className="max-w-[1240px] mx-auto px-2 md:px-4">
          <div className="flex justify-between items-center h-[72px]">
          
          <div className="flex items-center gap-10">
            {/* LOGO */}
            <div className="flex items-center bg-surface-container/40 backdrop-blur-md border border-[var(--color-primary)]/10 shadow-sm rounded-full py-1.5 px-4">
              <Link to={user?.role === 'CAMPAIGNER' ? '/campaigner/dashboard' : '/'} className="flex items-center gap-2 group">
                <div className="w-6 h-1.5 bg-primary mr-1.5 rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
                <span className="text-xl font-bold font-serif text-on-surface tracking-tight">Peduli<span className="text-primary italic">Kita</span></span>
              </Link>
            </div>
            
            {/* DESKTOP LINKS */}
            <div className={`${isMobileDevice ? 'hidden' : 'flex items-center'} h-full pt-1 ml-6`}>
              {(user?.role !== 'CAMPAIGNER' && user?.role !== 'ADMIN') && (
                <div className="flex items-center space-x-1 bg-surface-container/40 backdrop-blur-md border border-[var(--color-primary)]/10 shadow-sm rounded-full p-1">
                  <Link to="/" className={desktopLinkStyle('/')}>
                    Beranda
                  </Link>
                  <Link to="/campaigns" className={desktopLinkStyle('/campaigns')}>
                    Kampanye
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Desktop Menu */}
          <div className={`${isMobileDevice ? 'hidden' : 'flex items-center space-x-5'}`}>
            {user ? (
              <div className="flex items-center space-x-1 bg-surface-container/40 backdrop-blur-md border border-[var(--color-primary)]/10 shadow-sm rounded-full p-1">
                <Link 
                  to={getDashboardLink()} 
                  className={`flex items-center gap-2 py-1 px-3 rounded-full transition-all duration-300 ${isActive('/donor/dashboard') || isActive('/campaigner/dashboard') || isActive('/admin/dashboard') ? 'bg-primary/15 text-primary shadow-sm' : 'text-on-surface hover:bg-surface-container/50 hover:text-primary'}`}
                >
                  <div className="w-7 h-7 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
                    {(user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                  </div>
                  <span className="text-sm font-bold pr-1">{user?.name || 'User'}</span>
                </Link>
                
                <div className="h-5 w-px bg-outline-variant/50"></div>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-all rounded-full py-1.5 px-3"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 bg-surface-container/40 backdrop-blur-md border border-[var(--color-primary)]/10 shadow-sm rounded-full p-1">
                <Link to="/login" className="px-5 py-1.5 text-sm font-bold text-on-surface hover:text-primary transition-all rounded-full hover:bg-surface-container/50">
                  Masuk
                </Link>
                <Link to="/register" className="px-5 py-1.5 text-sm font-bold text-white bg-primary rounded-full hover:bg-primary-container shadow-sm hover:shadow transition-all">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className={`${isMobileDevice ? 'flex' : 'hidden'} items-center`}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-on-surface hover:bg-surface-container rounded-lg transition-colors focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobileDevice && (
        <div className="border-t border-outline-variant bg-surface-container-lowest absolute w-full shadow-lg">
          <div className="px-4 py-6 space-y-2">
            {(user?.role !== 'CAMPAIGNER' && user?.role !== 'ADMIN') && (
              <>
                <Link 
                  to="/" 
                  className={`block px-4 py-3 rounded-lg font-bold transition-colors ${isActive('/') ? 'bg-primary-fixed/50 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link 
                  to="/campaigns" 
                  className={`block px-4 py-3 rounded-lg font-bold transition-colors ${isActive('/campaigns') ? 'bg-primary-fixed/50 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kampanye
                </Link>
                
                <div className="border-t border-outline-variant/50 my-4"></div>
              </>
            )}
            
            {user ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className={`block px-4 py-3 rounded-lg font-bold transition-colors ${isActive(getDashboardLink()) ? 'bg-primary-fixed/50 text-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold">
                      {(user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    Dashboard Saya
                  </div>
                </Link>
                <button 
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 rounded-lg font-bold text-error hover:bg-error-container/50 transition-colors mt-2"
                >
                  Keluar dari Akun
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link 
                  to="/login" 
                  className="block text-center font-bold py-3 text-on-surface border border-outline-variant rounded-xl hover:bg-surface-container transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Masuk ke Akun
                </Link>
                <Link 
                  to="/register" 
                  className="block text-center font-bold py-3 bg-primary text-white rounded-xl shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
    </div>
  );
};

export default Navbar;
