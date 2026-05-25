import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Dashboard, SuratMasuk, SuratKeluar, TugasAkhir, Persetujuan, ManajemenUser, NotFound, Landing, Pengajuan, Riwayat } from './pages';
import { isAuthenticated, getUserRole } from './utils';

// Protected Route Component with Role Protection
function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const userString = localStorage.getItem('user');
    const userRole = userString ? JSON.parse(userString).role : getUserRole();

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Landing />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surat-masuk"
          element={
            <ProtectedRoute>
              <SuratMasuk />
            </ProtectedRoute>
          }
        />
        <Route
          path="/surat-keluar"
          element={
            <ProtectedRoute>
              <SuratKeluar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tugas-akhir"
          element={
            <ProtectedRoute>
              <TugasAkhir />
            </ProtectedRoute>
          }
        />
        <Route
          path="/persetujuan"
          element={
            <ProtectedRoute allowedRoles={['dosen', 'admin']}>
              <Persetujuan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManajemenUser />
            </ProtectedRoute>
          }
        />

        {/* Pengajuan — hanya untuk mahasiswa */}
        <Route
          path="/pengajuan"
          element={
            <ProtectedRoute allowedRoles={['mahasiswa']}>
              <Pengajuan />
            </ProtectedRoute>
          }
        />

        {/* Riwayat Pengajuan — hanya untuk mahasiswa */}
        <Route
          path="/riwayat-pengajuan"
          element={
            <ProtectedRoute allowedRoles={['mahasiswa']}>
              <Riwayat />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
