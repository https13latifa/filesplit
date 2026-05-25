import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '../layouts';
import { Table, Button } from '../components';
import { Search, Plus, Eye, Trash2, X, FileText, Calendar, Hash, Edit3, UploadCloud } from 'lucide-react';
import { formatDate } from '../utils';
import { pengajuanService } from '../services';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';

export default function RiwayatPengajuan() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  
  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Reference untuk input file tersembunyi
  const fileInputRef = useRef(null);

  // Form State (Disamakan 100% dengan skema Pydantic Backend)
  const [formData, setFormData] = useState({
    judul_perihal: '',
    jenis_pengajuan: 'Surat', // Default 'Surat' atau 'Tugas Akhir'
    kategori: 'Surat Aktif Kuliah',
    deskripsi: '',
    file: null // Menampung objek file PDF fisik
  });

  const loadLetters = async () => {
    setLoading(true);
    try {
      // Menembak endpoint GET /mahasiswa/pengajuan/me
      const response = await pengajuanService.getRiwayat();
      const data = response.data || [];
      setLetters(data);
    } catch (err) {
      console.warn('Gagal memuat data dari API. Pastikan Backend menyala.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLetters();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      Swal.fire('Format Salah!', 'Harap unggah file berformat PDF.', 'warning');
      e.target.value = null;
      return;
    }
    setFormData({ ...formData, file: selectedFile });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      Swal.fire('File Kosong', 'Anda wajib mengunggah file dokumen lampiran (PDF).', 'warning');
      return;
    }

    try {
      // WAJIB MENGGUNAKAN FORMDATA UNTUK UPLOAD FILE KE FASTAPI
      const submitData = new FormData();
      submitData.append('judul_perihal', formData.judul_perihal);
      submitData.append('jenis_pengajuan', formData.jenis_pengajuan);
      submitData.append('kategori', formData.kategori);
      submitData.append('deskripsi', formData.deskripsi);
      submitData.append('file', formData.file);

      // Menembak endpoint POST /mahasiswa/pengajuan
      await pengajuanService.create(submitData);
      
      Swal.fire('Berhasil!', 'Pengajuan berhasil dikirim.', 'success');
      
      setShowCreateModal(false);
      // Reset form
      setFormData({
        judul_perihal: '',
        jenis_pengajuan: 'Surat',
        kategori: 'Surat Aktif Kuliah',
        deskripsi: '',
        file: null
      });
      loadLetters();
    } catch (err) {
      Swal.fire('Gagal', err.response?.data?.detail || 'Terjadi kesalahan saat mengunggah.', 'error');
    }
  };

  const handleDelete = async (id, status) => {
    if (status !== 'Pending') {
      Swal.fire('Ditolak', 'Hanya pengajuan berstatus Pending yang dapat dibatalkan.', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Batalkan Pengajuan?',
      text: 'Pengajuan yang dibatalkan akan dihapus dari sistem.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonText: 'Kembali',
      confirmButtonText: 'Ya, Batalkan!',
    });

    if (result.isConfirmed) {
      try {
        await pengajuanService.delete(id);
        Swal.fire('Dibatalkan!', 'Pengajuan berhasil dihapus.', 'success');
        loadLetters();
      } catch (err) {
        Swal.fire('Gagal', 'Tidak dapat membatalkan pengajuan.', 'error');
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
      (letter.judul_perihal || '').toLowerCase().includes(s) ||
      (letter.kategori || '').toLowerCase().includes(s);
    const matchStatus = filterStatus === 'semua' || letter.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const columns = [
    { 
      key: 'created_at', 
      label: 'Tanggal Diajukan', 
      render: (date) => <span className="font-medium text-gray-700">{formatDate(date)}</span>
    },
    { 
      key: 'jenis_pengajuan', 
      label: 'Jenis',
      render: (val) => <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">{val}</span>
    },
    { key: 'judul_perihal', label: 'Judul / Perihal' },
    { key: 'kategori', label: 'Kategori' },
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
          {row.status === 'Pending' && (
            <button
              onClick={() => handleDelete(row.id, row.status)}
              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
              title="Batalkan Pengajuan"
            >
              <Trash2 size={16} />
            </button>
          )}
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
              <span>📤</span> Riwayat Pengajuan
            </h1>
            <p className="text-gray-600 mt-1">Pantau status surat dan tugas akhir yang Anda ajukan</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} /> Buat Pengajuan Baru
          </Button>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari perihal atau kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="semua">Semua Status</option>
              <option value="Disetujui">Disetujui</option>
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
            letters.length > 0 ? <Table columns={columns} data={filteredLetters} /> : <div className="text-center py-8 text-gray-500">Belum ada riwayat pengajuan.</div>
          )}
        </div>
      </div>

      {/* CREATE MODAL DENGAN UPLOAD FILE */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative z-10 max-h-[90vh] overflow-y-auto border border-gray-100">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit3 size={22} className="text-blue-600" /> Form Pengajuan Baru
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Jenis Pengajuan</label>
                    <select
                      value={formData.jenis_pengajuan}
                      onChange={(e) => setFormData({...formData, jenis_pengajuan: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                    >
                      <option value="Surat">Administrasi Surat</option>
                      <option value="Tugas Akhir">Tugas Akhir (TA)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                    <input
                      type="text" required placeholder="Cth: Izin Penelitian"
                      value={formData.kategori}
                      onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Judul / Perihal</label>
                  <input
                    type="text" required placeholder="Judul TA atau Perihal Surat"
                    value={formData.judul_perihal}
                    onChange={(e) => setFormData({...formData, judul_perihal: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi / Abstrak Singkat</label>
                  <textarea
                    rows={3} required placeholder="Jelaskan secara ringkas maksud pengajuan Anda..."
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* AREA UPLOAD FILE PDF */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unggah Dokumen (PDF)</label>
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="w-full border-2 border-dashed border-blue-300 rounded-xl p-6 flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <UploadCloud size={32} className="text-blue-500 mb-2" />
                    <p className="text-sm font-bold text-blue-700">
                      {formData.file ? formData.file.name : "Klik untuk memilih file PDF"}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">Maksimal ukuran file 5MB</p>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)}>Batal</Button>
                  <Button variant="primary" type="submit">Kirim Pengajuan</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAIL MODAL UNTUK MELIHAT CATATAN DOSEN */}
      <AnimatePresence>
        {showDetailModal && selectedLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative z-10 border border-gray-100">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} /> Detail Pengajuan
                </h3>
                <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Hash size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Kategori Pengajuan</p>
                      <p className="font-mono text-sm font-bold text-gray-800">{selectedLetter.kategori}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold">Tanggal Kirim</p>
                      <p className="text-sm font-bold text-gray-800">{formatDate(selectedLetter.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Judul / Perihal</h4>
                  <p className="text-base font-bold text-gray-800">{selectedLetter.judul_perihal}</p>
                </div>

                {selectedLetter.catatan_dosen && (
                  <div>
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Catatan / Alasan Penolakan</h4>
                    <p className="text-sm text-red-700 bg-red-50 p-4 rounded-xl border border-red-100 leading-relaxed max-h-32 overflow-y-auto">
                      {selectedLetter.catatan_dosen}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Tutup</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}