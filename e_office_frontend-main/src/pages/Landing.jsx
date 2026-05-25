import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  FileText,
  Users,
  Mail,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Bell,
  UserCheck,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
      {/* Header/Navbar */}
      <header className="w-full max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#1D63DC] p-2 rounded-xl text-white shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#1E293B]">
            E-Office <span className="text-[#1D63DC]">Kampus</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-[#1E293B] font-semibold text-sm">
          <a href="#fitur" className="hover:text-[#1D63DC] transition">
            Fitur
          </a>
          <a href="#statistik" className="hover:text-[#1D63DC] transition">
            Statistik
          </a>
          <a href="#tentang" className="hover:text-[#1D63DC] transition">
            Tentang
          </a>
        </nav>
        <div className="flex gap-2">
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl font-bold bg-white border border-[#1D63DC] text-[#1D63DC] hover:bg-[#1D63DC] hover:text-white transition"
          >
            Portal Login
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-12 md:gap-20">
        {/* Left: Text */}
        <div className="flex-1 text-left">
          <span className="inline-block bg-[#EAF1FF] text-[#1D63DC] font-bold px-4 py-1 rounded-full mb-4 text-xs">
            Sistem Informasi Surat & Tugas Akhir
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1E293B] mb-4 leading-tight">
            Mudahkan <span className="text-[#1D63DC]">Pengajuan Surat</span> &
            <br />
            <span className="text-[#1D63DC]">Tugas Akhir</span> Mahasiswa
          </h1>
          <p className="text-[#64748B] text-base md:text-lg mb-8 max-w-xl font-medium">
            E-Office Kampus adalah aplikasi web untuk memproses pengajuan surat,
            pendaftaran judul Tugas Akhir, dan manajemen dokumen akademik secara
            digital, cepat, dan transparan.
          </p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl font-bold bg-[#1D63DC] text-white hover:bg-[#154db3] transition shadow-blue-200 shadow-sm"
            >
              Masuk Portal
            </Link>
            <a
              href="#fitur"
              className="px-6 py-3 rounded-xl font-bold bg-white border border-[#1D63DC] text-[#1D63DC] hover:bg-[#1D63DC] hover:text-white transition"
            >
              Lihat Fitur
            </a>
          </div>
        </div>
        {/* Right: Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/login_illustration.png"
            alt="Ilustrasi E-Office"
            className="w-full max-w-md object-contain drop-shadow-xl"
          />
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="w-full max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] mb-8 text-center">
          Fitur Utama
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md flex flex-col items-center text-center">
            <FileText className="w-10 h-10 text-[#1D63DC] mb-3" />
            <h3 className="font-bold text-lg mb-2">Pengajuan Surat Online</h3>
            <p className="text-[#64748B] text-sm">
              Ajukan berbagai surat akademik (aktif kuliah, izin penelitian,
              dsb) secara digital dan pantau statusnya secara real-time.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md flex flex-col items-center text-center">
            <BookOpen className="w-10 h-10 text-[#1D63DC] mb-3" />
            <h3 className="font-bold text-lg mb-2">
              Pendaftaran Judul Tugas Akhir
            </h3>
            <p className="text-[#64748B] text-sm">
              Daftarkan judul Tugas Akhir, upload proposal, dan pantau proses
              persetujuan dosen pembimbing secara efisien.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md flex flex-col items-center text-center">
            <Bell className="w-10 h-10 text-[#1D63DC] mb-3" />
            <h3 className="font-bold text-lg mb-2">Notifikasi & Tracking</h3>
            <p className="text-[#64748B] text-sm">
              Dapatkan notifikasi status pengajuan, revisi, dan persetujuan
              langsung ke akun Anda.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-md flex flex-col items-center text-center">
            <Users className="w-10 h-10 text-[#1D63DC] mb-3" />
            <h3 className="font-bold text-lg mb-2">Manajemen User & Role</h3>
            <p className="text-[#64748B] text-sm">
              Admin dapat mengelola akun mahasiswa, dosen, dan staff dengan
              mudah melalui dashboard khusus.
            </p>
          </div>
        </div>
      </section>

      {/* Statistik Section */}
      <section id="statistik" className="w-full max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] mb-8 text-center">
          Statistik Sistem
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white rounded-2xl px-10 py-8 border border-gray-100 shadow flex flex-col items-center">
            <FileText className="w-8 h-8 text-[#1D63DC] mb-2" />
            <span className="text-2xl font-bold text-[#1D63DC]">1,200+</span>
            <span className="text-[#64748B] text-sm">Total Pengajuan</span>
          </div>
          <div className="bg-white rounded-2xl px-10 py-8 border border-gray-100 shadow flex flex-col items-center">
            <Users className="w-8 h-8 text-[#1D63DC] mb-2" />
            <span className="text-2xl font-bold text-[#1D63DC]">350+</span>
            <span className="text-[#64748B] text-sm">Akun Terdaftar</span>
          </div>
          <div className="bg-white rounded-2xl px-10 py-8 border border-gray-100 shadow flex flex-col items-center">
            <BookOpen className="w-8 h-8 text-[#1D63DC] mb-2" />
            <span className="text-2xl font-bold text-[#1D63DC]">200+</span>
            <span className="text-[#64748B] text-sm">Judul TA Didaftarkan</span>
          </div>
          <div className="bg-white rounded-2xl px-10 py-8 border border-gray-100 shadow flex flex-col items-center">
            <Bell className="w-8 h-8 text-[#1D63DC] mb-2" />
            <span className="text-2xl font-bold text-[#1D63DC]">3,000+</span>
            <span className="text-[#64748B] text-sm">Notifikasi Terkirim</span>
          </div>
        </div>
      </section>

      {/* Tentang Section */}
      <section
        id="tentang"
        className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12"
      >
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] mb-4">
            Tentang E-Office Kampus
          </h2>
          <p className="text-[#64748B] text-base mb-4 max-w-xl font-medium">
            E-Office Kampus dikembangkan untuk mendukung digitalisasi
            administrasi akademik di lingkungan perguruan tinggi. Dengan sistem
            ini, proses surat-menyurat, pengajuan tugas akhir, dan manajemen
            dokumen menjadi lebih mudah, cepat, dan transparan.
          </p>
          <ul className="list-disc pl-6 text-[#1D63DC] font-semibold space-y-2">
            <li>Autentikasi aman dengan JWT</li>
            <li>Role-based access: Mahasiswa, Dosen, Admin</li>
            <li>Upload & download dokumen PDF</li>
            <li>Tracking status pengajuan secara real-time</li>
            <li>Dashboard statistik & notifikasi otomatis</li>
          </ul>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/hero.png"
            alt="Ilustrasi Digitalisasi"
            className="w-full max-w-md object-contain drop-shadow-xl"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-8 border-t border-gray-200 mt-8 text-center text-[#94A3B8] font-semibold text-sm">
        © 2026 E-Office Kampus. Sistem Informasi Surat & Tugas Akhir. All rights
        reserved.
      </footer>
    </div>
  );
}
