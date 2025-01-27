import "./menu.scss";
import { useNavigate } from "react-router-dom";

const Menu = ({ relatedPosts }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

  // Function to handle the click on 'Read More' button
  const handleReadMore = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="relatedPost">
      <h2>Others you may like</h2>
      {relatedPosts?.map((post) => (
        <div className="post" key={post.id}>
          <img
            src={`${baseUrl}/uploads/${
              post.img ? post.img : "./default-image.png"
            }`}
            onClick={() => handleReadMore(post.id)}
          />
          <h1 onClick={() => handleReadMore(post.id)}>{post.title}</h1>
          <button onClick={() => handleReadMore(post.id)}>Read More</button>
        </div>
      ))}
    </div>
  );
};

export default Menu;
