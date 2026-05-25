import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts';
import { Table, Card } from '../components';
import { Check, X, Search, Eye, FileText, User, Calendar, Hash } from 'lucide-react';
import { formatDate } from '../utils';
import { dosenService } from '../services';
import Swal from 'sweetalert2';

export default function Persetujuan() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats Counters
  const [stats, setStats] = useState({
    pending: 0,
    disetujui: 0,
    ditolak: 0
  });

  const loadPendingLetters = async () => {
    setLoading(true);
    try {
      // Menggunakan dosenService sesuai arsitektur FastAPI
      const response = await dosenService.getPengajuanMasuk();
      const data = response.data || [];
      
      const pendingList = data.filter(l => l.status === 'Pending');
      const approvedCount = data.filter(l => l.status === 'Disetujui').length;
      const rejectedCount = data.filter(l => l.status === 'Ditolak').length;

      // Di halaman persetujuan, kita biasanya hanya menampilkan yang masih Pending
      setLetters(pendingList);
      setStats({
        pending: pendingList.length,
        disetujui: approvedCount,
        ditolak: rejectedCount
      });
    } catch (err) {
      console.warn('Gagal memuat data dari API. Memakai mock data sementara.');
      // Mock data disesuaikan dengan skema tabel Pengajuan FastAPI
      const mockData = [
        {
          id: 1,
          jenis_pengajuan: 'Surat',
          kategori: 'Surat Izin Penelitian',
          judul_perihal: 'Izin Penelitian di PT. ABC',
          deskripsi: 'Mohon izin untuk melakukan penelitian skripsi di PT. ABC selama 1 bulan.',
          created_at: '2026-05-20',
          status: 'Pending',
        },
        {
          id: 2,
          jenis_pengajuan: 'Tugas Akhir',
          kategori: 'Sistem Informasi',
          judul_perihal: 'Sistem E-Office Berbasis Web',
          deskripsi: 'Proposal tugas akhir untuk digitalisasi persuratan kampus.',
          created_at: '2026-05-18',
          status: 'Pending',
        },
      ];
      setLetters(mockData);
      setStats({ pending: 2, disetujui: 15, ditolak: 3 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingLetters();
  }, []);

  const handleApprove = async (id) => {
    const { value: catatan } = await Swal.fire({
      title: 'Setujui Pengajuan?',
      text: 'Anda bisa memberikan catatan (opsional).',
      input: 'text',
      inputPlaceholder: 'Tulis catatan persetujuan di sini (opsional)...',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16A34A',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Setujui',
      cancelButtonText: 'Batal',
    });

    if (catatan !== undefined) { // Confirm button clicked
      try {
        // Mengirim data status dan catatan ke FastAPI
        await dosenService.updateStatus(id, { 
          status: 'Disetujui', 
          catatan_dosen: catatan || 'Disetujui tanpa catatan.' 
        });
        
        Swal.fire('Disetujui!', 'Pengajuan berhasil disetujui.', 'success');
        loadPendingLetters();
      } catch (err) {
        // Mock offline
        setLetters(letters.filter(l => l.id !== id));
        setStats(prev => ({ ...prev, pending: prev.pending - 1, disetujui: prev.disetujui + 1 }));
        Swal.fire('Disetujui (Offline)', 'Tersimpan di local state.', 'success');
      }
    }
  };

  const handleReject = async (id) => {
    const { value: reason } = await Swal.fire({
      title: 'Tolak Pengajuan?',
      input: 'text',
      inputLabel: 'Alasan Penolakan (Wajib)',
      inputPlaceholder: 'Tuliskan alasan penolakan agar mahasiswa tahu...',
      inputValidator: (value) => {
        if (!value) {
          return 'Anda wajib menuliskan alasan penolakan!';
        }
      },
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Tolak',
      cancelButtonText: 'Batal',
    });

    if (reason) {
      try {
        // Mengirim data penolakan dan catatan ke FastAPI
        await dosenService.updateStatus(id, { 
          status: 'Ditolak', 
          catatan_dosen: reason 
        });
        
        Swal.fire('Ditolak!', 'Pengajuan telah dikembalikan ke mahasiswa.', 'error');
        loadPendingLetters();
      } catch (err) {
        // Mock offline
        setLetters(letters.filter(l => l.id !== id));
        setStats(prev => ({ ...prev, pending: prev.pending - 1, ditolak: prev.ditolak + 1 }));
        Swal.fire('Ditolak (Offline)', `Alasan: ${reason}`, 'success');
      }
    }
  };

  const openDetail = (letter) => {
    Swal.fire({
      title: `<h3 class="text-xl font-bold text-gray-800">${letter.judul_perihal}</h3>`,
      html: `
        <div class="text-left space-y-4 mt-4 text-sm text-gray-700 bg-gray-50 p-5 rounded-xl border border-gray-200">
          <div class="flex items-center gap-2 border-b border-gray-200 pb-2">
             <span class="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-md text-xs uppercase tracking-wide">${letter.jenis_pengajuan}</span>
             <span class="text-gray-500 font-medium ml-auto">${formatDate(letter.created_at)}</span>
          </div>
          <p class="flex items-center gap-2"><strong>Kategori:</strong> ${letter.kategori}</p>
          <div>
            <p class="mb-1"><strong>Deskripsi / Abstrak:</strong></p>
            <p class="leading-relaxed text-gray-600 bg-white p-4 rounded-lg border border-gray-100 max-h-40 overflow-y-auto shadow-sm">${letter.deskripsi || 'Tidak ada deskripsi.'}</p>
          </div>
          ${letter.file_path ? `<a href="#" class="text-blue-600 font-bold hover:underline text-xs flex items-center gap-1 mt-2">📄 Unduh Dokumen PDF</a>` : '<p class="text-xs text-red-500 italic mt-2">Tidak ada lampiran PDF.</p>'}
        </div>
      `,
      showCancelButton: false,
      confirmButtonColor: '#2563EB',
      confirmButtonText: 'Tutup Detail',
      width: '600px'
    });
  };

  const filteredLetters = letters.filter((letter) =>
    (letter.judul_perihal || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (letter.kategori || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (letter.jenis_pengajuan || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'created_at', 
      label: 'Tanggal', 
      render: (date) => <span className="text-sm font-medium text-gray-600">{formatDate(date)}</span> 
    },
    { 
      key: 'jenis_pengajuan', 
      label: 'Jenis',
      render: (val) => <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">{val}</span>
    },
    { 
      key: 'judul_perihal', 
      label: 'Judul / Perihal',
      render: (val) => <span className="font-bold text-gray-800 line-clamp-2">{val}</span> 
    },
    { 
      key: 'kategori', 
      label: 'Kategori' 
    },
    {
      key: 'id',
      label: 'Aksi Persetujuan',
      render: (id, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openDetail(row)}
            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors shadow-sm"
            title="Lihat Detail & Dokumen"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleApprove(row.id)}
            className="flex items-center gap-1 px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-md text-xs font-bold transition-all shadow-sm border border-green-200 hover:border-green-300"
            title="Setujui Pengajuan"
          >
            <Check size={14} /> Setuju
          </button>
          <button
            onClick={() => handleReject(row.id)}
            className="flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-xs font-bold transition-all shadow-sm border border-red-200 hover:border-red-300"
            title="Tolak Pengajuan"
          >
            <X size={14} /> Tolak
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            <span>✅</span> Persetujuan Pengajuan
          </h1>
          <p className="text-gray-600 mt-1">Review dan berikan keputusan untuk surat dan tugas akhir mahasiswa</p>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card icon="⏳" title="Pending Persetujuan" value={stats.pending} color="yellow" />
          <Card icon="✅" title="Telah Disetujui" value={stats.disetujui} color="green" />
          <Card icon="❌" title="Telah Ditolak" value={stats.ditolak} color="red" />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari perihal, kategori, atau jenis pengajuan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            letters.length > 0 ? (
              <Table columns={columns} data={filteredLetters} />
            ) : (
              <div className="text-center py-12 text-gray-500 font-medium">
                <span className="text-4xl block mb-3">🎉</span>
                Tidak ada pengajuan yang perlu di-review saat ini.
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
}