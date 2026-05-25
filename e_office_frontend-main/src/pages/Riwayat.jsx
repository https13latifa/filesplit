import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts';
import { Table } from '../components';
import { pengajuanService } from '../services';
import { formatDate } from '../utils';
import Swal from 'sweetalert2';

export default function Riwayat() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // GET /api/mahasiswa/pengajuan
      const res = await pengajuanService.getRiwayat();
      const data = res?.data || [];
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Gagal memuat riwayat pengajuan', err);
      Swal.fire('Gagal', 'Tidak dapat memuat data riwayat pengajuan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus Pengajuan?',
      text: 'Pengajuan yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    });

    if (confirm.isConfirmed) {
      try {
        await pengajuanService.delete(id);
        Swal.fire('Dihapus!', 'Pengajuan berhasil dihapus.', 'success');
        await loadData();
      } catch (err) {
        const msg = err.response?.data?.detail || 'Gagal menghapus pengajuan.';
        Swal.fire('Gagal', msg, 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    const lower = (status || '').toLowerCase();
    let cls = 'bg-yellow-100 text-yellow-700';
    if (lower === 'disetujui') cls = 'bg-green-100 text-green-700';
    else if (lower === 'ditolak') cls = 'bg-red-100 text-red-700';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>
        {status || 'Pending'}
      </span>
    );
  };

  const columns = [
    {
      key: 'no',
      label: 'No',
      render: (_, _row, idx) => <span className="text-gray-500">{idx + 1}</span>,
    },
    {
      key: 'created_at',
      label: 'Tanggal',
      render: (val) => (
        <span className="text-sm text-gray-600">{val ? formatDate(val) : '-'}</span>
      ),
    },
    {
      key: 'jenis_pengajuan',
      label: 'Jenis',
      render: (val) => (
        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
          {val || '-'}
        </span>
      ),
    },
    {
      key: 'judul_perihal',
      label: 'Judul / Perihal',
      render: (val) => (
        <span className="font-medium text-gray-800">{val || '-'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => getStatusBadge(val),
    },
    {
      key: 'catatan_dosen',
      label: 'Catatan Dosen',
      render: (val) => (
        <span className="text-sm text-gray-600 italic">{val || '-'}</span>
      ),
    },
    {
      key: 'id',
      label: 'Aksi',
      render: (id, row) => (
        <div className="flex gap-2">
          {row.status === 'Pending' && (
            <button
              onClick={() => handleDelete(id)}
              className="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md border border-red-200 font-semibold transition-colors"
            >
              Hapus
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="p-6 bg-white rounded-xl shadow-lg mt-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Riwayat Pengajuan</h2>
          <p className="text-gray-500 text-sm mt-1">
            Semua pengajuan surat dan tugas akhir yang pernah Anda buat.
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <Table columns={columns} data={submissions} />
        )}
      </div>
    </MainLayout>
  );
}
