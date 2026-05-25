import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts';
import { Button } from '../components';
import { pengajuanService } from '../services';
import { Send, FileText } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Pengajuan() {
  const navigate = useNavigate();
  
  // 1. SESUAIKAN STATE DENGAN SKEMA FASTAPI
  const [formData, setFormData] = useState({
    judul_perihal: '',
    jenis_pengajuan: 'Surat', // Default dropdown
    kategori: 'Surat Aktif Kuliah',
    deskripsi: '',
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi file wajib ada
    if (!formData.file) {
      Swal.fire('File Kosong', 'Harap unggah dokumen lampiran (PDF).', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      // 2. WAJIB MENGGUNAKAN FORMDATA KARENA ADA FILE FISIK
      const submitData = new FormData();
      submitData.append('judul_perihal', formData.judul_perihal);
      submitData.append('jenis_pengajuan', formData.jenis_pengajuan);
      submitData.append('kategori', formData.kategori);
      submitData.append('deskripsi', formData.deskripsi);
      submitData.append('file', formData.file);

      // Kirim langsung ke backend dalam 1 kali request
      await pengajuanService.create(submitData);
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Pengajuan Anda berhasil dikirim ke Dosen/Admin.',
        icon: 'success',
        confirmButtonColor: '#2563EB',
      }).then(() => {
        // Redirect ke halaman riwayat
        navigate('/riwayat-pengajuan');
      });

    } catch (err) {
      console.error('Pengajuan gagal', err);
      Swal.fire(
        'Gagal Mengirim', 
        err.response?.data?.detail || 'Terjadi kesalahan pada server. Coba lagi nanti.', 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const container = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <MainLayout>
      <motion.div
        className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mt-4"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" /> Form Pengajuan Baru
          </h2>
          <p className="text-gray-500 mt-1 text-sm">Isi formulir di bawah ini dengan lengkap untuk mengajukan Surat atau Tugas Akhir.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div variants={item}>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Jenis Pengajuan</label>
              <select
                name="jenis_pengajuan"
                value={formData.jenis_pengajuan}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="Surat">Administrasi Surat</option>
                <option value="Tugas Akhir">Tugas Akhir / Proposal</option>
              </select>
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Kategori / Topik</label>
              <input
                type="text"
                name="kategori"
                placeholder="Cth: Izin Riset, Cuti Akademik..."
                value={formData.kategori}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </motion.div>
          </div>

          <motion.div variants={item}>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Judul Perihal / Tugas Akhir</label>
            <input
              type="text"
              name="judul_perihal"
              placeholder="Tuliskan judul proposal atau perihal surat secara lengkap"
              value={formData.judul_perihal}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </motion.div>

          <motion.div variants={item}>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi / Abstrak Ringkas</label>
            <textarea
              name="deskripsi"
              rows={4}
              placeholder="Jelaskan maksud dan tujuan pengajuan Anda di sini..."
              value={formData.deskripsi}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            ></textarea>
          </motion.div>

          <motion.div variants={item} className="p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl">
            <label className="block text-sm font-bold text-gray-700 mb-2">Upload Dokumen Pendukung (Wajib PDF)</label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              onChange={handleChange}
              required
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </motion.div>

          <motion.div variants={item} className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <Send size={18} />
              {submitting ? 'Mengirim Data...' : 'Kirim Pengajuan'}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </MainLayout>
  );
}