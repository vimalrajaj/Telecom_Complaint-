import api from './api';

export const complaintService = {
  getAll: () => api.get('/complaints'),
  getById: (id) => api.get(`/complaints/${id}`),
  create: (data) => api.post('/complaints', data),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  remove: (id) => api.delete(`/complaints/${id}`),
};
