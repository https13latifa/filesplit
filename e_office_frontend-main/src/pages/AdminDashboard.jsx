import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { Card, Table, Button, Modal } from '../components';
import { userService, pengajuanService } from '../services';
import { formatDate } from '../utils';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalMahasiswa: 0, totalDosen: 0, totalSelesai: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'mahasiswa' });

  // Load stats and user list
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const usersRes = await userService.getUsers();
        const allUsers = usersRes?.data?.data || usersRes?.data || [];
        const mahasiswa = allUsers.filter(u => u.role?.toLowerCase() === 'mahasiswa');
        const dosen = allUsers.filter(u => u.role?.toLowerCase() === 'dosen' || u.role?.toLowerCase() === 'admin');
        setUsers(allUsers);
        const pengajuanRes = await pengajuanService.getList();
        const submissions = pengajuanRes?.data?.data || pengajuanRes?.data || [];
        const selesai = submissions.filter(s => {
          const st = (s.status || '').toLowerCase();
          return st === 'disetujui' || st === 'diterima';
        });
        setStats({ totalMahasiswa: mahasiswa.length, totalDosen: dosen.length, totalSelesai: selesai.length });
      } catch (err) {
        console.error('Failed to load admin data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error('Delete user failed', err);
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await userService.createUser(newUser);
      const created = res?.data?.data || res?.data;
      setUsers(prev => [...prev, created]);
      setShowModal(false);
      setNewUser({ name: '', email: '', role: 'mahasiswa' });
    } catch (err) {
      console.error('Create user failed', err);
    }
  };

  const columns = [
    { key: 'no', label: 'No', render: (_, __, idx) => idx + 1 },
    { key: 'name', label: 'Nama', render: (val) => <span className="font-medium">{val}</span> },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (val) => val?.charAt(0).toUpperCase() + val?.slice(1) },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (_, row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-600 hover:underline"
        >
          <Trash2 size={16} className="inline" /> Hapus
        </button>
      ),
    },
  ];

  const statCards = [
    { icon: <Plus size={24} />, title: 'Total Mahasiswa', value: stats.totalMahasiswa, color: 'blue' },
    { icon: <CheckCircle size={24} />, title: 'Total Dosen', value: stats.totalDosen, color: 'green' },
    { icon: <XCircle size={24} />, title: 'Pengajuan Selesai', value: stats.totalSelesai, color: 'purple' },
  ];

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

  return (
    <MainLayout>
      <motion.div className="space-y-6" variants={container} initial="hidden" animate="visible">
        {/* Stats */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={item}>
          {statCards.map((stat, idx) => (
            <Card key={idx} icon={stat.icon} title={stat.title} value={stat.value} color={stat.color} />
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div className="flex justify-end" variants={item}>
          <Button variant="primary" onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus size={18} /> Tambah User Baru
          </Button>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={item}>
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>
          ) : (
            <Table columns={columns} data={users} />
          )}
        </motion.div>
      </motion.div>

      {/* Add User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah User Baru">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Nama</span>
            <input
              type="text"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              className="input-field w-full mt-1"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              className="input-field w-full mt-1"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Role</span>
            <select
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              className="input-field w-full mt-1"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
            <Button variant="primary" onClick={handleAddUser}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
