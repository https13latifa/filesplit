import { MainLayout } from '../layouts';
import { Button } from '../components';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Halaman Tidak Ditemukan</p>
        <p className="text-gray-500 mb-8">Halaman yang Anda cari tidak ada atau telah dihapus.</p>
        <Button variant="primary" size="lg">
          ← Kembali ke Dashboard
        </Button>
      </div>
    </MainLayout>
  );
}
