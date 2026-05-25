# 🎨 UI/UX Design System Specification: E-Office Learning Center

Dokumen ini berfungsi sebagai panduan sistem desain (*Design System*) untuk modul **E-Office Learning Center** (Platform Pelatihan & Edukasi Pegawai). Panduan ini mengintegrasikan aturan **UI/UX Pro Max Skill** dengan arsitektur frontend pada proyek `e_office_frontend`.

---

## 1. Konsep Visual & Tema
* **Tema Utama:** *Playful Professional* — Menggabungkan fungsionalitas aplikasi kantor (*E-Office*) yang formal dengan pendekatan visual edukasi yang kasual, interaktif, dan tidak membosankan.
* **Gaya UI:** **Claymorphism** 
  * Karakteristik: Bentuk melengkung besar (*large rounded corners*), efek 3D lembut menggunakan kombinasi *inner shadow* (bayangan dalam) dan *drop shadow* luar, serta warna pastel yang cerah (*vibrant pastel*).

---

## 2. Palet Warna (Vibrant & Engaging)

Untuk menjaga konsistensi dengan tema *E-Office* namun tetap *playful*, kita menggunakan kombinasi warna berikut (diimplementasikan via Tailwind CSS):

| Kegunaan | Warna | Kode Hex | Kelas Tailwind |
| :--- | :--- | :--- | :--- |
| **Primary (Brand Office)** | Ocean Blue | `#2563EB` | `bg-blue-600` |
| **Secondary (Playful Accent)** | Vibrant Amber | `#F59E0B` | `bg-amber-500` |
| **Success (Progress/Badges)** | Emerald Mint | `#10B981` | `bg-emerald-500` |
| **Claymorphism Card Bg** | Soft Tint White | `#FFFFFF` (80% Opacity) | `bg-white/80 backdrop-blur-md` |
| **Background Base** | Creamy Ice | `#F8FAFC` | `bg-slate-50` |

---

## 3. Spesifikasi Komponen Claymorphism (Tailwind CSS)

Untuk memunculkan efek "lempung/plastik 3D" (Claymorphism) pada kartu katalog kursus dan demo progres, gunakan racikan utilitas Tailwind berikut:

```html
<!-- Contoh Blueprint Kartu Claymorphism -->
<div class="bg-white/80 backdrop-blur-md rounded-3xl p-6 
            shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] 
            shadow-[inset_0_4px_6px_rgba(255,255,255,0.6),inset_0_-4px_6px_rgba(0,0,0,0.05)] 
            border border-white/40 transition-all duration-300 hover:scale-[1.02]">
  <!-- Konten Kartu -->
</div>