import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts';
import { Table, Button } from '../components';
import { Search, Eye, X, BookOpen, Calendar, Hash, FileText } from 'lucide-react';
import { formatDate } from '../utils';
import { pengajuanService, dosenService } from '../services';
import { motion, AnimatePresence } from 'framer-motion';

export default function TugasAkhir() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // User State
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { role: 'mahasiswa', nama: 'Guest' };
  const userRole = user.role?.toLowerCase() || 'mahasiswa';

  // Modal States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      let response;
      // Tarik data berdasarkan role yang sedang login
      if (userRole === 'mahasiswa') {
        response = await pengajuanService.getRiwayat();
      } else {
        response = await dosenService.getPengajuanMasuk();
      }
      
      const data = response.data || [];
      
      // KUNCI UTAMA: Filter hanya pengajuan yang jenisnya "Tugas Akhir"
      const filteredTA = data.filter(item => item.jenis_pengajuan === 'Tugas Akhir');
      setTasks(filteredTA);
      
    } catch (err) {
      console.warn('Gagal memuat data Tugas Akhir. Pastikan Backend menyala.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [userRole]);

  const openDetail = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const s = searchTerm.toLowerCase();
    return (task.judul_perihal || '').toLowerCase().includes(s) ||
           (task.kategori || '').toLowerCase().includes(s);
  });

  const columns = [
    { 
      key: 'created_at', 
      label: 'Tanggal Diajukan',
      render: (date) => <span className="font-medium">{formatDate(date)}</span>
    },
    { 
      key: 'kategori', 
      label: 'Kategori TA'
    },
    { 
      key: 'judul_perihal', 
      label: 'Judul Tugas Akhir',
      render: (val) => <span className="font-bold text-gray-800 line-clamp-2">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            status === 'Disetujui'
              ? 'bg-green-100 text-green-700'
              : status === 'Ditolak'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {status || 'Pending'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Aksi',
      render: (id, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openDetail(row)}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
            title="Lihat Detail"
          >
            <Eye size={16} />
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
              <span>🎓</span> Daftar Tugas Akhir
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === 'mahasiswa' 
                ? 'Pantau status pengajuan judul Tugas Akhir Anda' 
                : 'Daftar pengajuan judul Tugas Akhir mahasiswa'}
            </p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan judul atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            filteredTasks.length > 0 ? (
              <Table columns={columns} data={filteredTasks} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Belum ada data pengajuan Tugas Akhir.
              </div>
            )
          )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {showDetailModal && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative z-10 border border-gray-100">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="text-blue-600" size={24} /> Detail Pengajuan TA
                </h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Hash size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Kategori / Topik</p>
                      <p className="font-mono text-sm font-bold text-gray-800">{selectedTask.kategori}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Tanggal Pengajuan</p>
                      <p className="text-sm font-bold text-gray-800">
                        {formatDate(selectedTask.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Judul Tugas Akhir</h4>
                  <p className="text-base font-bold text-gray-800 leading-snug">{selectedTask.judul_perihal}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Deskripsi / Abstrak</h4>
                  <p className="text-sm text-gray-700 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 leading-relaxed max-h-48 overflow-y-auto">
                    {selectedTask.deskripsi || 'Tidak ada deskripsi yang dilampirkan.'}
                  </p>
                </div>

                {selectedTask.catatan_dosen && (
                  <div>
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Catatan Dosen</h4>
                    <p className="text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-100 leading-relaxed max-h-32 overflow-y-auto">
                      {selectedTask.catatan_dosen}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                  Tutup
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}