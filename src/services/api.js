import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-be0a.onrender.com'
});

export default api;

