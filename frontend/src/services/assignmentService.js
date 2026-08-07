import api from './api';

export const assignmentService = {
  getAll: () => api.get('/assignments'),
  getMine: () => api.get('/assignments/me'),
  create: (complaint_id, engineer_id) => api.post('/assignments', { complaint_id, engineer_id }),
  updateStatus: (id, status) => api.put(`/assignments/${id}`, { status }),
};
