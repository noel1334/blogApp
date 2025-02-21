import { FaThumbsUp, FaComment } from "react-icons/fa";
import { useState } from "react";
import "./postfooter.scss";
import { Link } from "react-router-dom";

const PostFooter = ({
  likes,
  comments,
  isLiked: initialLikedState,
  onLikeToggle,
  likedUsers = [],
  postId,
  hasCommented,
}) => {
  const [isLiked, setIsLiked] = useState(initialLikedState);
  const [showLikes, setShowLikes] = useState(false);

  const handleLikeClick = () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    onLikeToggle(newLikeState);
  };

  const toggleLikesList = () => {
    setShowLikes((prev) => !prev);
  };

  return (
    <div className="post-footer">
      <div className="footer-item like" onClick={handleLikeClick}>
        <FaThumbsUp className={`icon ${isLiked ? "active" : ""}`} />
        <span>{likes || 0}</span>
      </div>
      <div className="likes-list-toggle" onClick={toggleLikesList}>
        <span>{showLikes ? "Hide Likes" : "Show Likes"}</span>
        {showLikes && (
          <div className="likes-list">
            {likedUsers.length > 0 ? (
              likedUsers.map((user) => (
                <div key={user.userId} className="like-user">
                  <Link className="link editBtn" to={`/profile/${user.userId}`}>
                    <img
                      src={
                        user.userImg ? `${user.userImg}` : "/default-user.png"
                      }
                      alt={user.username}
                    />
                  </Link>
                  <span>{user.username || "Anonymous"}</span>
                </div>
              ))
            ) : (
              <span>No likes yet</span>
            )}
          </div>
        )}
      </div>
      <div className="footer-item comment">
        <Link className="link" to={`/post/${postId}`}>
          <FaComment
            className={`icon ${hasCommented ? "active-comment" : ""}`}
          />
        </Link>
        <span>{comments || 0}</span>
      </div>
    </div>
  );
};

export default PostFooter;
