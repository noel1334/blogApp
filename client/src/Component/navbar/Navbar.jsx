import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/img/logo.png";
import { AuthContext } from "../../context/authContext";
import "./Navbar.scss";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        <div className="toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        <div className={`links ${isMenuOpen ? "active" : ""}`}>
          {[
            { to: "/?cat=politics", label: "POLITICS" },
            { to: "/?cat=sport", label: "SPORT" },
            { to: "/?cat=celebrities", label: "CELEBRITIES" },
            { to: "/?cat=crime", label: "CRIME" },
            { to: "/?cat=technology", label: "TECHNOLOGY" },
            { to: "/?cat=science", label: "SCIENCE" },
            { to: "/?cat=art", label: "ART" },
            { to: "/?cat=fashion", label: "FASHION" },
          ].map((link, idx) => (
            <Link key={idx} className="link" to={link.to} onClick={closeMenu}>
              <h6>{link.label}</h6>
            </Link>
          ))}

          {currentUser && (
            <span className="username-span">
              <Link to="/profile" className="user" onClick={closeMenu}>
                <h2>{currentUser?.username}</h2>
              </Link>
            </span>
          )}

          <span>
            {currentUser ? (
              <h2
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Logout
              </h2>
            ) : (
              <Link to="/login" onClick={closeMenu}>
                <h2>Login</h2>
              </Link>
            )}
          </span>
          <span>
            <Link className="link write-link" to="/write" onClick={closeMenu}>
              Write
            </Link>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
