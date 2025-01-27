import "./Loader.scss";

const Loader = ({ size = "50px", color = "#3498db", type = "spin" }) => {
  return (
    <div
      className={`loader ${type}`}
      style={{
        width: size,
        height: size,
        borderColor: `${color} transparent transparent transparent`,
      }}
    ></div>
  );
};

export default Loader;
