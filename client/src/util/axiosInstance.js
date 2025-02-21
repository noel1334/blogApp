import axios from "axios";
import { logoutUser } from "./authUtils";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || "https://blogapp-r16r.onrender.com";
const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      logoutUser(); 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
