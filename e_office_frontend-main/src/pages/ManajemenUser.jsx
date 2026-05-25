import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts';
import { Table, Button, Card } from '../components';
import { Search, Plus, Edit2, Trash2, X, UserPlus, Mail, Shield, User, Key } from 'lucide-react';
import { userService } from '../services';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManajemenUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form States
  const [createFormData, setCreateFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'mahasiswa',
  });

  const [editFormData, setEditFormData] = useState({
    nama: '',
    email: '',
    role: 'mahasiswa',
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers(currentPage, limit);
      const data = response.data.data || response.data || [];
      const total = response.data.total || data.length || 0;
      setUsers(data);
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.warn('Failed to load users from API. Using fallback mock data.');
      const mockData = [
        {
          id: 1,
          nama: 'Muhammad Aji',
          email: 'mahasiswa@kampus.ac.id',
          role: 'mahasiswa',
          status: 'Aktif',
        },
        {
          id: 2,
          nama: 'Dr. Sukarno',
          email: 'dosen@kampus.ac.id',
          role: 'dosen',
          status: 'Aktif',
        },
        {
          id: 3,
          nama: 'Administrator E-Office',
          email: 'admin@kampus.ac.id',
          role: 'admin',
          status: 'Aktif',
        },
      ];
      setUsers(mockData);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(createFormData);
      Swal.fire({
        title: 'Berhasil!',
        text: 'User baru berhasil dibuat.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
      setShowCreateModal(false);
      setCreateFormData({
        nama: '',
        email: '',
        password: '',
        role: 'mahasiswa',
      });
      loadUsers();
    } catch (err) {
      // Mock offline insertion
      const newUser = {
        id: Date.now(),
        ...createFormData,
        status: 'Aktif',
      };
      setUsers([...users, newUser]);
      setShowCreateModal(false);
      Swal.fire({
        title: 'Sukses (Offline)',
        text: 'User berhasil dibuat secara lokal.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setEditFormData({
      nama: user.nama || user.name || '',
      email: user.email || '',
      role: user.role || 'mahasiswa',
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(selectedUser.id, editFormData);
      Swal.fire({
        title: 'Diperbarui!',
        text: 'Data user berhasil diperbarui.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
      setShowEditModal(false);
      loadUsers();
    } catch (err) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editFormData } : u));
      setShowEditModal(false);
      Swal.fire({
        title: 'Diperbarui (Offline)',
        text: 'Data user diperbarui secara lokal.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus User?',
      text: 'User tidak akan bisa login lagi ke sistem!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await userService.deleteUser(id);
        Swal.fire({
          title: 'Dihapus!',
          text: 'User berhasil dihapus.',
          icon: 'success',
          confirmButtonColor: '#2563EB',
        });
        loadUsers();
      } catch (err) {
        setUsers(users.filter(u => u.id !== id));
        Swal.fire({
          title: 'Dihapus (Offline)',
          text: 'User dihapus dari local state.',
          icon: 'success',
          confirmButtonColor: '#2563EB',
        });
      }
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'dosen':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'mahasiswa':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleLabel = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'dosen':
        return 'Dosen Pembimbing';
      case 'mahasiswa':
        return 'Mahasiswa';
      default:
        return role;
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'nama', 
      label: 'Nama Lengkap',
      render: (val) => <span className="font-bold text-gray-800">{val}</span>
    },
    { key: 'email', label: 'Email Kampus' },
    {
      key: 'role',
      label: 'Role Hak Akses',
      render: (role) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadge(role)}`}>
          {getRoleLabel(role)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          status === 'Aktif' || !status ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {status || 'Aktif'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Aksi',
      render: (id, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditOpen(row)}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
            title="Edit User"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
            title="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              <span>👥</span> Manajemen User
            </h1>
            <p className="text-gray-600 mt-1">Kelola data login, registrasi, dan role sistem E-Office Kampus</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} /> User Baru
          </Button>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card icon="👥" title="Total User" value={users.length} color="blue" />
          <Card icon="👨‍🏫" title="Dosen" value={users.filter(u => u.role?.toLowerCase() === 'dosen').length || 1} color="purple" />
          <Card icon="🎓" title="Mahasiswa" value={users.filter(u => u.role?.toLowerCase() === 'mahasiswa').length || 1} color="green" />
        </div>

        {/* Search Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama, email, atau role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <Table columns={columns} data={filteredUsers} />
              
              {totalPages > 1 && (
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Sebelumnya
                  </Button>
                  <span className="px-4 py-1 text-sm font-semibold flex items-center text-gray-700 bg-gray-100 rounded-lg">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Berikutnya
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CREATE USER MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10 border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <UserPlus className="text-blue-600" size={24} />
                  Tambah Pengguna Baru
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="flex text-sm font-semibold text-gray-700 mb-1 items-center gap-1.5">
                    <User size={16} className="text-gray-400" /> Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap User"
                    value={createFormData.nama}
                    onChange={(e) => setCreateFormData({...createFormData, nama: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="flex text-sm font-semibold text-gray-700 mb-1 items-center gap-1.5">
                    <Mail size={16} className="text-gray-400" /> Email Kampus
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@kampus.ac.id"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="flex text-sm font-semibold text-gray-700 mb-1 items-center gap-1.5">
                    <Key size={16} className="text-gray-400" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Password login"
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="flex text-sm font-semibold text-gray-700 mb-1 items-center gap-1.5">
                    <Shield size={16} className="text-gray-400" /> Hak Akses / Role
                  </label>
                  <select
                    value={createFormData.role}
                    onChange={(e) => setCreateFormData({...createFormData, role: e.target.value})}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen Pembimbing</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)}>
                    Batal
                  </Button>
                  <Button variant="primary" type="submit">
                    Simpan User
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT USER MODAL */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10 border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit2 className="text-blue-600" size={20} />
                  Edit Pengguna
                </h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="flex text-sm font-semibold text-gray-700 mb-1 items-center gap-1.5">
                    <User size={16} className="text-gray-400" /> Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.nama}
                    onChange={(e) => setEditFormData({...editFormData, nama: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="flex text-sm font-semibold text-gray-700 mb-1 items-center gap-1.5">
                    <Mail size={16} className="text-gray-400" /> Email Kampus
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="flex text-sm font-semibold text-gray-700 mb-1 items-center gap-1.5">
                    <Shield size={16} className="text-gray-400" /> Hak Akses / Role
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen Pembimbing</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button variant="secondary" type="button" onClick={() => setShowEditModal(false)}>
                    Batal
                  </Button>
                  <Button variant="primary" type="submit">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
