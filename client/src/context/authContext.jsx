import { createContext, useState, useEffect } from "react";
import axiosInstance from "../util/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const response = await axiosInstance.post("/auth/login", inputs);
    setCurrentUser(response.data);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        await axiosInstance.get("/auth/validate");
      } catch (error) {
        console.error("Token validation failed:", error);
        setCurrentUser(null);
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    };

    if (currentUser) {
      validateToken();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, setCurrentUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
