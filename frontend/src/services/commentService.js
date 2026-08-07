import api from './api';

export const commentService = {
  getAll: (complaintId) => api.get(`/complaints/${complaintId}/comments`),
  add: (complaintId, message) => api.post(`/complaints/${complaintId}/comments`, { message }),
};
