
export const logoutUser = () => {
    localStorage.removeItem("user");
    window.location.href = "/login"; 
  };
  