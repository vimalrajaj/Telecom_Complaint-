import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
      return Promise.reject(new Error('Cannot connect to server. Make sure the backend is running on port 5000.'));
    }
    const message = err.response?.data?.message || err.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default api;
