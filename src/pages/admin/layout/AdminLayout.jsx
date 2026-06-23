import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Tag, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Plus, label: 'Add Product', path: '/admin/products/new' },
    { icon: Tag, label: 'Categories', path: '/admin/categories' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: TrendingUp, label: 'AI Predictions', path: '/admin/predictions' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#dec0a0] font-inter">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-[#caa47c] shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-amber-800">
          <div className="flex items-center space-x-2">
            <img
              src="/src/assets/img/home/logo.png"
              alt="Alley Logo"
              className="w-6 h-6"
            />
            <span className="font-semibold text-lg text-stone-900">Alley Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-amber-700"
          >
            <X size={20} className="text-stone-900" />
          </button>
        </div>

        {/* Sidebar Content: make column with scrollable nav and sticky footer */}
        <div className="flex flex-col h-[calc(100%-64px)]">{/* subtract header height (~64px) */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 pb-28">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin');
              const baseClasses = 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors';
              const activeClasses = 'bg-amber-700 text-white';
              const inactiveClasses = 'text-stone-900 hover:bg-amber-700 hover:text-white';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t border-amber-800 bg-[#caa47c]">
            <div className="mb-3 px-4 py-2">
            {(() => {
              const displayName = (userInfo?.name || '').trim() || 'Admin';
              const displayRole = (userInfo?.role || '').trim() || 'Administrator';
              const shouldShowRole = displayRole.toLowerCase() !== displayName.toLowerCase();
              return (
                <>
                  <p className="text-sm font-medium text-stone-900">{displayName}</p>
                    {shouldShowRole && (
                      <p className="text-xs text-stone-700">{displayRole}</p>
                    )}
                </>
              );
            })()}
          </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-stone-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-stone-100"
            >
              <Menu size={20} className="text-stone-900" />
            </button>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-stone-900">Admin Panel</h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


