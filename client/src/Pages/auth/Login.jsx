import "./login.scss";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="email"
          required
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          required
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Login"}
        </button>
        {err && <p style={{ color: "red", marginTop: "10px" }}>{err}</p>}
        <span>
          Don’t you have an account?{" "}
          <Link to="/register" className="link">
            Register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
