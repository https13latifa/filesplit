import { useState } from 'react';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { role: 'mahasiswa' };
  const role = user.role?.toLowerCase() || 'mahasiswa';

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '📨', label: 'Surat Masuk', path: '/surat-masuk' },
    { icon: '📤', label: 'Surat Keluar', path: '/surat-keluar' },
    { icon: '✅', label: 'Persetujuan Surat', path: '/persetujuan', allowedRoles: ['dosen', 'admin'] },
    { icon: '🎓', label: 'Tugas Akhir', path: '/tugas-akhir' },
    { icon: '👥', label: 'Manajemen User', path: '/users', allowedRoles: ['admin'] },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Filter menu items by allowedRoles
  const filteredItems = menuItems.filter(item => {
    if (item.allowedRoles) {
      return item.allowedRoles.includes(role);
    }
    return true;
  });

  const sidebarVariants = {
    open: { x: 0, width: '16rem' },
    closed: { x: -300, width: 0 },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg md:hidden shadow-lg hover:shadow-xl"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white shadow-2xl z-40 w-64 overflow-hidden md:w-64 md:translate-x-0"
      >
        {/* Brand */}
        <motion.div className="p-6 border-b border-blue-800 bg-blue-950/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="text-4xl">📬</div>
            <div>
              <h1 className="text-xl font-bold leading-5">E-Office</h1>
              <p className="text-xs text-blue-200">Kampus Management</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="mt-8 space-y-2 px-4 flex-1">
          {filteredItems.map((item, idx) => (
            <motion.button
              key={item.path}
              custom={idx}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-lg font-bold'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white font-medium'
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span className={`transition-opacity ${!isOpen && 'md:hidden'}`}>
                {item.label}
              </span>
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute right-4 w-2 h-2 bg-white rounded-full"
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-t border-blue-800 p-4 space-y-2 bg-blue-950/40 backdrop-blur-sm"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 hover:text-white transition-all duration-200 group"
            >
              <Settings size={20} className="group-hover:rotate-45 transition-transform" />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-950/30 hover:text-red-200 transition-all duration-200 font-bold"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </motion.div>

          {/* Footer Info */}
          <div className="py-2 text-center text-xs text-blue-300 border-t border-blue-800 bg-blue-950/60">
            <p>v1.0.0</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
