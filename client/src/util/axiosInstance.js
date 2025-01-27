import axios from "axios";
import { logoutUser } from "./authUtils";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
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
