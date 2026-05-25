import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Users,
  ChevronDown,
  Key,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { authService } from "../services";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        title: "Oops!",
        text: "Harap masukkan username/NIM/NIDN dan password Anda.",
        icon: "warning",
        confirmButtonColor: "#1D63DC",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({
        username: email,
        password: password,
      });

      // Axios membungkus response dalam .data
      const data = response.data;

      localStorage.setItem("token", data.access_token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          nama: data.user.nama,
          role: data.user.role,
          username: data.user.username,
        })
      );

      Swal.fire({
        title: "Berhasil Masuk!",
        text: `Selamat datang kembali, ${data.user.nama || "Pengguna"}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({
        title: "Gagal Masuk",
        text:
          err.response?.data?.detail ||
          "Kredensial salah atau terjadi kesalahan pada server.",
        icon: "error",
        confirmButtonColor: "#1D63DC",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nama || !email || !password) {
      Swal.fire({
        title: "Formulir Belum Lengkap",
        text: "Harap lengkapi semua field yang tersedia.",
        icon: "warning",
        confirmButtonColor: "#1D63DC",
      });
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        username: email,
        nama: nama,
        password: password,
        role: role,
      });

      Swal.fire({
        title: "Pendaftaran Berhasil!",
        text: "Akun Anda telah berhasil terdaftar. Silakan login.",
        icon: "success",
        confirmButtonColor: "#1D63DC",
      });
      setIsRegister(false);
    } catch (err) {
      Swal.fire({
        title: "Pendaftaran Gagal",
        text:
          err.response?.data?.detail ||
          "Registrasi gagal. Cek kembali data Anda.",
        icon: "error",
        confirmButtonColor: "#1D63DC",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-150 flex flex-col md:flex-row">
        <div className="w-full md:w-[45%] bg-[#EAF1FF] p-8 md:p-10 flex flex-col justify-between items-start relative overflow-hidden">
          {/* Logo & Sub-header */}
          <div className="flex items-center gap-3 z-10">
            <div className="bg-[#1D63DC] p-2 rounded-xl text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-sm tracking-wide text-[#1E293B] uppercase">
                SISTEM AKADEMIK
              </h2>
              <p className="text-xs text-[#1D63DC] font-semibold">
                Universitas UIN SUSKA RIAU
              </p>
            </div>
          </div>

          <div className="w-full my-auto py-8 z-10 text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight mb-2">
              Selamat Datang!
            </h1>
            <p className="text-[#64748B] text-sm md:text-base leading-relaxed mb-6 font-medium max-w-sm">
              Silakan masuk untuk mengakses sistem akademik kampus.
            </p>
            <div className="w-full max-w-[340px] mx-auto mt-6">
              <img
                src="/login_illustration.png"
                alt="Ilustrasi Akademik"
                className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          <div className="z-10 text-xs text-[#94A3B8] font-semibold">
            © 2026 Universitas UIN SUSKA RIAU. Semua Hak Dilindungi.
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50 rounded-full filter blur-2xl opacity-80 pointer-events-none translate-y-1/3 -translate-x-1/4"></div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white text-left">
          {/* TAB NAVIGATION */}
          <div className="flex border-b border-gray-200 mb-8 w-full">
            <button
              onClick={() => {
                setIsRegister(false);
                setEmail("");
                setPassword("");
              }}
              className={`flex-1 pb-4 text-center font-bold text-lg transition-all border-b-2 relative ${
                !isRegister
                  ? "text-[#1D63DC] border-[#1D63DC]"
                  : "text-[#94A3B8] border-transparent hover:text-gray-600"
              }`}
            >
              Login
              {!isRegister && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D63DC]"
                />
              )}
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setEmail("");
                setPassword("");
              }}
              className={`flex-1 pb-4 text-center font-bold text-lg transition-all border-b-2 relative ${
                isRegister
                  ? "text-[#1D63DC] border-[#1D63DC]"
                  : "text-[#94A3B8] border-transparent hover:text-gray-600"
              }`}
            >
              Register
              {isRegister && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1D63DC]"
                />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!isRegister ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                    Masuk ke Akun Anda
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 font-medium">
                    Gunakan akun yang telah terdaftar
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Username / NIM / NIDN
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan username / NIM / NIDN"
                        className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password"
                        className="w-full pl-11 pr-11 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1D63DC] hover:bg-[#154db3] disabled:bg-blue-300 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-blue-200 mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? "Menghubungkan..." : "Masuk"}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Belum punya akun?{" "}
                    <button
                      onClick={() => setIsRegister(true)}
                      className="text-[#1D63DC] font-bold hover:underline"
                    >
                      Daftar disini
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                    Daftar Akun Baru
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 font-medium">
                    Lengkapi data untuk mendaftar
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Username / NIM / NIDN
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan username / NIM / NIDN"
                        className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Buat Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Buat password minimal 6 karakter"
                        className="w-full pl-11 pr-11 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E293B] mb-2 uppercase tracking-wide">
                      Pilih Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 bg-[#F8FAFC] border border-gray-200 rounded-xl text-sm font-medium text-gray-800 appearance-none focus:outline-none focus:border-[#1D63DC] focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="dosen">Dosen</option>
                        <option value="admin">Administrator / Staff</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#1D63DC] hover:bg-[#154db3] disabled:bg-blue-300 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-blue-200 mt-4 flex items-center justify-center gap-2"
                  >
                    {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Sudah memiliki akun?{" "}
                    <button
                      onClick={() => setIsRegister(false)}
                      className="text-[#1D63DC] font-bold hover:underline"
                    >
                      Masuk disini
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FLOATING DEMO PANEL */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="flex items-center justify-center w-12 h-12 bg-[#1E293B] text-white hover:bg-slate-700 rounded-full shadow-lg border-2 border-slate-600 transition-transform active:scale-95 focus:outline-none"
            title="Akses Demo Developer"
          >
            <Key
              className={`w-5 h-5 ${showDemo ? "rotate-45 text-yellow-400" : ""} transition-transform duration-200`}
            />
          </button>

          <AnimatePresence>
            {showDemo && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute bottom-16 right-0 w-72 bg-[#1E293B] border border-slate-700 p-5 rounded-2xl shadow-xl space-y-4 text-white"
              >
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-1.5 text-yellow-400">
                    <span>💡</span> Demo Access Panel
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Pilih akun simulasi untuk mengisi formulir secara otomatis.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEmail("mahasiswa");
                      setPassword("password");
                      setRole("mahasiswa");
                    }}
                    className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <p className="text-slate-200">Mahasiswa Account</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        mahasiswa / password
                      </p>
                    </div>
                    <span className="text-[9px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">
                      MHS
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setEmail("dosen");
                      setPassword("password");
                      setRole("dosen");
                    }}
                    className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <p className="text-slate-200">Dosen Account</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        dosen / password
                      </p>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      DSN
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setEmail("admin");
                      setPassword("password");
                      setRole("admin");
                    }}
                    className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <p className="text-slate-200">Admin Account</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        admin / password
                      </p>
                    </div>
                    <span className="text-[9px] bg-yellow-500/20 text-yellow-400 font-bold px-2 py-0.5 rounded">
                      ADM
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
