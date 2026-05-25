import { Bell, User, ChevronDown, Search, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services';

export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Load user data from localStorage dynamically
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [notifications] = useState([
    { id: 1, text: 'Surat baru dari Rektorat', time: '10 menit lalu', icon: '📨', unread: true },
    { id: 2, text: 'Persetujuan tugas akhir diterima', time: '1 jam lalu', icon: '✅', unread: false },
    { id: 3, text: 'Reminder: Upload proposal minggu depan', time: '2 jam lalu', icon: '⏰', unread: false },
  ]);

  useEffect(() => {
    // If not in localStorage, fetch from API profile
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        const profileData = response.data.data || response.data;
        setUser(profileData);
        localStorage.setItem('user', JSON.stringify(profileData));
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, [user]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const userData = {
    name: user?.nama || user?.name || 'User Kampus',
    role: user?.role === 'admin' ? 'Administrator' : user?.role === 'dosen' ? 'Dosen Pembimbing' : 'Mahasiswa',
    email: user?.email || 'user@kampus.ac.id',
    avatar: user?.role === 'admin' ? '👨‍💼' : user?.role === 'dosen' ? '👨‍🏫' : '👤',
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <header className="bg-white shadow-md border-b-2 border-blue-100">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side - App Title (Visible on desktop/tablet) */}
        <div className="flex-1 ml-12 md:ml-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">E-Office Kampus</h2>
          <p className="text-xs text-gray-500 mt-0.5">Sistem Manajemen Surat & Tugas Akhir</p>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 max-h-96 overflow-y-auto"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-800">Notifikasi</h3>
                  </div>
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                            notif.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <span className="text-2xl flex-shrink-0">{notif.icon}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{notif.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                            {notif.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">Tidak ada notifikasi</div>
                  )}
                  <div className="border-t border-gray-200 p-3 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg hover:from-gray-200 hover:to-gray-100 transition-all duration-200 border border-gray-200"
            >
              <div className="text-xl md:text-2xl">{userData.avatar}</div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-gray-800 leading-4">{userData.name}</p>
                <p className="text-xs text-gray-500 leading-3 mt-0.5">{userData.role}</p>
              </div>
              <motion.div
                animate={{ rotate: showUserMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-gray-600" />
              </motion.div>
            </motion.button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-transparent p-4 border-b border-gray-200">
                    <p className="text-sm font-bold text-gray-800">{userData.name}</p>
                    <p className="text-xs text-gray-600 truncate">{userData.email}</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <User size={18} />
                      <span>Dashboard Utama</span>
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-semibold border-t border-gray-100"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
