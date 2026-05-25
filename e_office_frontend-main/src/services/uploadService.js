import apiClient from './api';

export const uploadService = {
  // Upload a file (e.g., PDF) and return the response containing file URL
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Adjust the endpoint as needed on backend
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
