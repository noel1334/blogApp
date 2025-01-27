import "./register.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../util/axiosInstance";

const Register = () => {
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          name="name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        <span>
          Do you have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
