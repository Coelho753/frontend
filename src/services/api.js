import axios from 'axios';

const api = axios.create({
  baseURL: 'https://meu-backend.onrender.com'
});

export default api;
