import "./footer.scss";
import logo from "../../assets/img/logo.png";

const Footer = () => {
  return (
    <div className="footer">
      <img src={logo} alt="Logo" />
      <p>
        I love React and I <strong>make it with React</strong>.
      </p>
    </div>
  );
};

export default Footer;
