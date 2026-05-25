import apiClient from "./api";

export const authService = {
  login: (data) => apiClient.post("/auth/login", data),
  register: (data) => apiClient.post("/auth/register", data),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getProfile: () => apiClient.get("/auth/me"),
};

export const pengajuanService = {
  // GET /api/mahasiswa/pengajuan — ambil riwayat pengajuan mahasiswa yang login
  getRiwayat: () => apiClient.get("/mahasiswa/pengajuan"),

  // POST /api/mahasiswa/pengajuan — buat pengajuan baru (multipart/form-data)
  create: (data) =>
    apiClient.post("/mahasiswa/pengajuan", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // DELETE /api/mahasiswa/pengajuan/:id — hapus pengajuan (hanya Pending)
  delete: (id) => apiClient.delete(`/mahasiswa/pengajuan/${id}`),
};

export const dosenService = {
  getPengajuanMasuk: () => apiClient.get("/dosen/pengajuan"),
  updateStatus: (id, data) => apiClient.put(`/dosen/pengajuan/${id}`, data),
};

export const userService = {
  getUsers: () => apiClient.get("/admin/users"),
  getUserDetail: (id) => apiClient.get(`/admin/users/${id}`),
  createUser: (data) => apiClient.post("/admin/users", data),
  updateUser: (id, data) => apiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
};
