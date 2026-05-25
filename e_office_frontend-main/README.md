# 📬 E-Office Kampus Frontend
## Sistem Informasi Surat-Menyurat & Tugas Akhir

Aplikasi web modern untuk mengelola surat-menyurat dan tugas akhir mahasiswa di kampus.

---

## 🚀 Fitur Utama

- ✉️ **Manajemen Surat Masuk/Keluar** - Kelola surat dengan mudah
- 📋 **Sistem Persetujuan** - Alur persetujuan surat yang terstruktur
- 🎓 **Manajemen Tugas Akhir** - Pantau progress tugas akhir mahasiswa
- 👥 **Manajemen User** - Admin dapat mengelola pengguna dan role
- 📊 **Dashboard** - Visualisasi data dan statistik
- 🔐 **Autentikasi & Otorisasi** - Keamanan berbasis role

---

## 📁 Struktur Project

```
src/
├── assets/           # Gambar, logo, dan aset statis
├── components/       # Komponen React reusable
│   ├── Sidebar.jsx   # Sidebar navigation
│   ├── Navbar.jsx    # Top navigation bar
│   ├── Card.jsx      # Card component
│   ├── Button.jsx    # Button component
│   ├── Table.jsx     # Table component
│   └── index.js      # Export semua components
├── layouts/          # Layout templates
│   ├── MainLayout.jsx # Layout utama (Sidebar + Navbar)
│   └── index.js
├── pages/            # Halaman utama aplikasi
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── SuratMasuk.jsx
│   ├── SuratKeluar.jsx
│   ├── TugasAkhir.jsx
│   └── index.js
├── services/         # API services
│   ├── api.js        # Axios instance
│   └── index.js      # Services (auth, surat, tugas akhir)
├── utils/            # Utility functions
│   └── index.js      # Helper functions
├── App.jsx           # Main app dengan routing
├── main.jsx          # Entry point
└── index.css         # Global styles
```

---

## 🛠️ Setup & Instalasi

### Prerequisites
- Node.js v16+
- npm atau yarn

### Langkah Instalasi

```bash
# 1. Clone repository
git clone <repository-url>

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Jalankan development server
npm run dev
```

---

## 📝 Environment Variables

Buat file `.env.local` di root project:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🎨 Teknologi yang Digunakan

- **React 19** - UI Library
- **React Router v7** - Client-side routing
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Framer Motion** - Animations

---

## 📖 Panduan Penggunaan

### 1. Login
Masuk dengan akun Anda. Demo credentials:
- Email: `demo@kampus.ac.id`
- Password: `demo123`

### 2. Dashboard
Lihat statistik dan akses cepat ke fitur utama.

### 3. Surat Masuk
Kelola surat yang masuk dengan fitur pencarian dan filter.

### 4. Tugas Akhir
Pantau dan persetujui tugas akhir mahasiswa.

---

## 🔌 Integrasi API

Semua API calls sudah dikonfigurasi di `src/services/index.js`. 

Contoh penggunaan:
```javascript
import { suratService } from '../services';

// Get surat masuk
const response = await suratService.getMasuk();

// Create surat baru
await suratService.createSurat({ data });

// Approve surat
await suratService.approveSurat(suratId);
```

---

## 🚀 Build & Deploy

```bash
# Development
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

---

## 📱 Responsive Design

Aplikasi sepenuhnya responsive dan dapat diakses dari:
- Desktop
- Tablet
- Mobile

---

## 🔒 Autentikasi

Token JWT disimpan di localStorage. Setiap request otomatis menyertakan token di header:
```
Authorization: Bearer <token>
```

---

## 🎯 Route Map

| Path | Deskripsi |
|------|-----------|
| `/login` | Halaman login |
| `/dashboard` | Dashboard utama |
| `/surat-masuk` | Daftar surat masuk |
| `/surat-keluar` | Daftar surat keluar |
| `/tugas-akhir` | Manajemen tugas akhir |
| `/persetujuan` | Surat perlu persetujuan |
| `/users` | Manajemen user (admin) |
| `/settings` | Pengaturan |

---

## 📞 Support & Kontribusi

Untuk pertanyaan atau kontribusi, silakan buat issue atau pull request.

---

## 📄 Lisensi

Project ini merupakan tugas akhir untuk mata kuliah Pemrograman Web.

---

**Dibuat dengan ❤️ untuk Project UAS Pemrograman Web**
