import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts';
import { Table, Button, Card } from '../components';
import { Search, Plus, Eye, Trash2, X, FileText, Calendar, User, Hash, Edit3 } from 'lucide-react';
import { formatDate } from '../utils';
import { dosenService } from '../services';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuratMasuk() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nomorSurat: '',
    pengirim: '',
    perihal: '',
    isi: '',
    tglSurat: new Date().toISOString().split('T')[0],
    lampiran: 'dokumen.pdf',
  });

  const loadLetters = async () => {
    setLoading(true);
    try {
      const response = await dosenService.getPengajuanMasuk(currentPage, limit);
      // Backend paginated structure or fallback
      const data = response.data.data || response.data || [];
      const total = response.data.total || data.length || 0;
      
      setLetters(data);
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.warn('Failed to load letters from API. Using fallback mock data.');
      // Use fallback mock data
      const mockData = [
        {
          id: 1,
          nomorSurat: '1002/UN10/AK/2026',
          pengirim: 'Rektorat',
          perihal: 'Pengumuman Kuliah Daring Semester Genap',
          isi: 'Kepada seluruh mahasiswa, perkuliahan untuk semester genap minggu pertama akan diselenggarakan secara daring dikarenakan adanya renovasi gedung rektorat.',
          tanggal: '2026-05-20',
          tglSurat: '2026-05-20',
          status: 'Diterima',
          lampiran: 'pengumuman_daring.pdf',
        },
        {
          id: 2,
          nomorSurat: '045/FT-M/II/2026',
          pengirim: 'Dekanat Fakultas Teknik',
          perihal: 'Pemberitahuan Dana Hibah Penelitian',
          isi: 'Selamat kepada mahasiswa yang lolos pendanaan proposal Program Kreativitas Mahasiswa (PKM) 2026. Dana dapat dicairkan melalui bagian keuangan Fakultas.',
          tanggal: '2026-05-18',
          tglSurat: '2026-05-18',
          status: 'Pending',
          lampiran: 'dana_pkm_2026.pdf',
        },
        {
          id: 3,
          nomorSurat: '331/KM-AK/V/2026',
          pengirim: 'Biro Administrasi Akademik',
          perihal: 'Undangan Rapat Evaluasi Kurikulum',
          isi: 'Undangan menghadiri rapat koordinasi evaluasi kurikulum tingkat program studi yang akan diadakan pada hari Selasa, 26 Mei 2026.',
          tanggal: '2026-05-15',
          tglSurat: '2026-05-15',
          status: 'Diterima',
          lampiran: 'undangan_evaluasi.pdf',
        },
      ];
      setLetters(mockData);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLetters();
  }, [currentPage]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await suratService.createSurat(formData);
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Surat masuk berhasil ditambahkan.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
      
      setShowCreateModal(false);
      // Reset form
      setFormData({
        nomorSurat: '',
        pengirim: '',
        perihal: '',
        isi: '',
        tglSurat: new Date().toISOString().split('T')[0],
        lampiran: 'dokumen.pdf',
      });
      loadLetters();
    } catch (err) {
      // Direct mock update if API is down for developer convenience
      const newLetter = {
        id: Date.now(),
        ...formData,
        tanggal: formData.tglSurat,
        status: 'Pending',
      };
      setLetters([newLetter, ...letters]);
      setShowCreateModal(false);
      
      Swal.fire({
        title: 'Sukses (Mode Offline)',
        text: 'Surat baru berhasil ditambahkan secara lokal.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Surat yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await suratService.deleteSurat(id);
        Swal.fire({
          title: 'Terhapus!',
          text: 'Surat berhasil dihapus.',
          icon: 'success',
          confirmButtonColor: '#2563EB',
        });
        loadLetters();
      } catch (err) {
        // Direct mock delete if API is down
        setLetters(letters.filter(l => l.id !== id));
        Swal.fire({
          title: 'Terhapus (Offline)',
          text: 'Surat berhasil dihapus dari local state.',
          icon: 'success',
          confirmButtonColor: '#2563EB',
        });
      }
    }
  };

  const openDetail = (letter) => {
    setSelectedLetter(letter);
    setShowDetailModal(true);
  };

  const filteredLetters = letters.filter((letter) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      (letter.nomorSurat || '').toLowerCase().includes(s) ||
      (letter.perihal || '').toLowerCase().includes(s) ||
      (letter.pengirim || '').toLowerCase().includes(s);
    const matchStatus = filterStatus === 'semua' || letter.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const columns = [
    { 
      key: 'nomorSurat', 
      label: 'Nomor Surat',
      render: (val) => <span className="font-bold text-gray-800">{val}</span>
    },
    { key: 'pengirim', label: 'Pengirim' },
    { key: 'perihal', label: 'Perihal' },
    { 
      key: 'tglSurat', 
      label: 'Tanggal Surat', 
      render: (date, row) => formatDate(date || row.tanggal) 
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            status === 'Diterima' || status === 'Disetujui'
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
              <span>📨</span> Surat Masuk
            </h1>
            <p className="text-gray-600 mt-1">Kelola dan pantau surat masuk di lingkungan kampus</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} /> Surat Baru
          </Button>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nomor surat, pengirim, atau perihal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
              <option value="semua">Semua Status</option>
              <option value="Diterima">Diterima / Disetujui</option>
              <option value="Pending">Pending</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Table / Data View */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <Table columns={columns} data={filteredLetters} />
              
              {/* Pagination Controls */}
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

      {/* CREATE MODAL */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative z-10 max-h-[90vh] overflow-y-auto border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit3 size={22} className="text-blue-600" />
                  Tambah Surat Masuk Baru
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Surat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 001/UN10/AK/2026"
                    value={formData.nomorSurat}
                    onChange={(e) => setFormData({...formData, nomorSurat: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pengirim</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rektorat"
                      value={formData.pengirim}
                      onChange={(e) => setFormData({...formData, pengirim: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Surat</label>
                    <input
                      type="date"
                      required
                      value={formData.tglSurat}
                      onChange={(e) => setFormData({...formData, tglSurat: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Perihal</label>
                  <input
                    type="text"
                    required
                    placeholder="Perihal/Judul surat"
                    value={formData.perihal}
                    onChange={(e) => setFormData({...formData, perihal: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Isi Ringkas</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Isi atau keterangan surat..."
                    value={formData.isi}
                    onChange={(e) => setFormData({...formData, isi: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nama File Lampiran</label>
                  <input
                    type="text"
                    placeholder="lampiran.pdf"
                    value={formData.lampiran}
                    onChange={(e) => setFormData({...formData, lampiran: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)}>
                    Batal
                  </Button>
                  <Button variant="primary" type="submit">
                    Simpan Surat
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {showDetailModal && selectedLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative z-10 border border-gray-100"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} />
                  Detail Surat Masuk
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Hash size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Nomor Surat</p>
                      <p className="font-mono text-sm font-bold text-gray-800">{selectedLetter.nomorSurat}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Pengirim</p>
                      <p className="text-sm font-bold text-gray-800">{selectedLetter.pengirim}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Tanggal Surat</p>
                      <p className="text-sm font-bold text-gray-800">
                        {formatDate(selectedLetter.tglSurat || selectedLetter.tanggal)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Perihal</h4>
                  <p className="text-base font-bold text-gray-800">{selectedLetter.perihal}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Isi Surat</h4>
                  <p className="text-sm text-gray-700 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 leading-relaxed max-h-48 overflow-y-auto">
                    {selectedLetter.isi || 'Tidak ada keterangan isi tambahan.'}
                  </p>
                </div>

                {selectedLetter.lampiran && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Lampiran Dokumen</h4>
                    <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-red-500" />
                        <span className="text-sm font-semibold text-gray-700">{selectedLetter.lampiran}</span>
                      </div>
                      <span className="text-xs text-blue-600 font-bold hover:underline">Unduh File</span>
                    </div>
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
