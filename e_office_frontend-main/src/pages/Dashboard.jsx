import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layouts";
import { Card, Table, Button } from "../components";
import { pengajuanService, dosenService, userService } from "../services";
import { formatDate } from "../utils";
import {
  Mail,
  Send,
  BookOpen,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();

  // 1. AMBIL DATA USER YANG SEDANG LOGIN
  const userString = localStorage.getItem("user");
  const user = userString
    ? JSON.parse(userString)
    : { nama: "Pengguna", role: "mahasiswa" };
  const userRole = user.role?.toLowerCase() || "mahasiswa";

  // 2. STATE UNTUK MENAMPUNG DATA API
  const [stats, setStats] = useState({
    suratMasuk: 0,
    tugasAkhir: 0,
    persetujuanPending: 0,
    totalUser: 0
  });
  const [recentLetters, setRecentLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activities] = useState([
    { id: 1, text: "Sistem E-Office berhasil diakses", time: "Baru saja", icon: "🌐" },
    { id: 2, text: "Sinkronisasi data dengan server", time: "1 menit lalu", icon: "🔄" },
  ]);

  // 3. TARIK DATA DARI BACKEND BERDASARKAN ROLE
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        let totalSurat = 0;
        let totalTA = 0;
        let pending = 0;
        let totalUsr = 0;
        let recentData = [];

        if (userRole === "mahasiswa") {
          const res = await pengajuanService.getRiwayat();
          const data = res.data || [];
          recentData = data;
          
          totalSurat = data.filter(item => item.jenis_pengajuan === 'Surat').length;
          totalTA = data.filter(item => item.jenis_pengajuan === 'Tugas Akhir').length;
          pending = data.filter(item => item.status === 'Pending').length;

        } else if (userRole === "dosen") {
          const res = await dosenService.getPengajuanMasuk();
          const data = res.data || [];
          recentData = data;

          totalSurat = data.filter(item => item.jenis_pengajuan === 'Surat').length;
          totalTA = data.filter(item => item.jenis_pengajuan === 'Tugas Akhir').length;
          pending = data.filter(item => item.status === 'Pending').length;

        } else if (userRole === "admin") {
          const res = await userService.getUsers();
          const data = res.data || [];
          totalUsr = data.length;
          
          // Fallback dummy untuk surat jika di admin (karena admin belum ada API getAllSurat)
          totalSurat = 120; 
          totalTA = 30;
        }

        setStats({
          suratMasuk: totalSurat,
          tugasAkhir: totalTA,
          persetujuanPending: pending,
          totalUser: totalUsr
        });
        
        setRecentLetters(recentData.slice(0, 3));

      } catch (error) {
        console.warn("Menggunakan mock data (Backend belum siap/offline)");
        // Mock Data Fallback
        setStats({ suratMasuk: 8, tugasAkhir: 3, persetujuanPending: 2, totalUser: 45 });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userRole]);

  // 4. KONFIGURASI TAMPILAN BERDASARKAN ROLE (Menyambungkan State Stats)
  let statCards = [];
  let quickActions = [];
  let tableColumns = [];

  if (userRole === "dosen") {
    statCards = [
      { icon: <Mail size={24} />, title: "Pengajuan Surat", value: stats.suratMasuk, color: "blue", trend: "Bulan Ini" },
      { icon: <AlertCircle size={24} />, title: "Perlu Persetujuan", value: stats.persetujuanPending, color: "yellow", trend: "Status Pending" },
      { icon: <BookOpen size={24} />, title: "TA Dibimbing", value: stats.tugasAkhir, color: "purple", trend: "Mahasiswa Bimbingan" },
    ];
    quickActions = [
      { icon: <Mail size={20} />, label: "Lihat Pengajuan Masuk", color: "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200", action: () => navigate("/persetujuan") },
      { icon: <BookOpen size={20} />, label: "Daftar Judul TA", color: "bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200", action: () => navigate("/tugas-akhir") },
    ];
    tableColumns = [
      { key: "mahasiswa_id", label: "ID Mhs" },
      { key: "jenis_pengajuan", label: "Jenis" },
      { key: "judul_perihal", label: "Judul/Perihal" },
      { key: "status", label: "Status" },
    ];
  } else if (userRole === "admin") {
    statCards = [
      { icon: <Users size={24} />, title: "Total User", value: stats.totalUser, color: "green", trend: "Mahasiswa & Dosen" },
      { icon: <Mail size={24} />, title: "Total Pengajuan", value: stats.suratMasuk, color: "blue", trend: "Surat & TA" },
      { icon: <BookOpen size={24} />, title: "Judul TA", value: stats.tugasAkhir, color: "purple", trend: "Didaftarkan" },
    ];
    quickActions = [
      { icon: <Users size={20} />, label: "Manajemen User", color: "bg-green-50 hover:bg-green-100 text-green-600 border border-green-200", action: () => navigate("/users") },
      { icon: <Mail size={20} />, label: "Lihat Semua Pengajuan", color: "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200", action: () => navigate("/surat-masuk") },
    ];
    tableColumns = [
      { key: "username", label: "Username" },
      { key: "nama", label: "Nama" },
      { key: "role", label: "Role" },
    ];
  } else {
    // MAHASISWA (Default)
    statCards = [
      { icon: <Mail size={24} />, title: "Pengajuan Surat", value: stats.suratMasuk, color: "blue", trend: "Total Pengajuan" },
      { icon: <BookOpen size={24} />, title: "Judul TA", value: stats.tugasAkhir, color: "purple", trend: "Judul Diajukan" },
      { icon: <AlertCircle size={24} />, title: "Status Pending", value: stats.persetujuanPending, color: "yellow", trend: "Menunggu Persetujuan" },
    ];
    quickActions = [
      { icon: <Mail size={20} />, label: "Buat Pengajuan Surat", color: "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200", action: () => navigate("/pengajuan") },
      { icon: <BookOpen size={20} />, label: "Daftar Judul Tugas Akhir", color: "bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200", action: () => navigate("/tugas-akhir") },
      { icon: <TrendingUp size={20} />, label: "Riwayat Pengajuan", color: "bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border border-yellow-200", action: () => navigate("/riwayat-pengajuan") },
    ];
    tableColumns = [
      { key: "created_at", label: "Tanggal", render: (date) => formatDate(date) },
      { key: "jenis_pengajuan", label: "Jenis" },
      { key: "judul_perihal", label: "Judul/Perihal" },
      { key: "status", label: "Status" },
    ];
  }

  // 5. ANIMASI FRAMER MOTION
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <MainLayout>
      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen opacity-10 translate-x-20 -translate-y-20"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Selamat Datang, {user.nama}! 👋</h1>
              <p className="text-blue-100 text-base md:text-lg">
                Hak Akses Anda:{" "}
                <span className="font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-sm">{userRole}</span>
              </p>
              <div className="flex gap-4 mt-4 text-blue-200 text-sm font-medium">
                <div className="flex items-center gap-2"><Clock size={16} /><span>Sistem Online</span></div>
              </div>
            </div>
            <div className="text-5xl md:text-6xl drop-shadow-md hidden md:block">📬</div>
          </div>
        </motion.div>

        {/* Stats Cards Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => (
            <Card key={idx} icon={stat.icon} title={stat.title} value={loading ? "..." : stat.value} color={stat.color} trend={stat.trend} />
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span>⚡</span> Navigasi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={action.action}
                className={`${action.color} rounded-lg p-5 font-bold flex items-center justify-between transition-all duration-200 group cursor-pointer`}
              >
                <div className="flex items-center gap-3">{action.icon}<span>{action.label}</span></div>
                <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout (Table & Activity) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Data */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Mail size={22} className="text-blue-600" /> Data Terbaru</h2>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-12"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
              ) : (
                recentLetters.length > 0 ? (
                  <Table columns={tableColumns} data={recentLetters} />
                ) : (
                  <div className="text-center py-8 text-gray-500">Belum ada data terbaru.</div>
                )
              )}
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">📊 Aktivitas Sistem</h2>
              <div className="space-y-4">
                {activities.map((activity, idx) => (
                  <motion.div key={activity.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + idx * 0.05 }} className="border-l-2 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded-r transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{activity.icon}</span>
                      <div className="flex-1">
                        <p className="text-gray-800 font-semibold text-sm">{activity.text}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </MainLayout>
  );
}

