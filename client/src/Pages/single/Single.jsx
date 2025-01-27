import "./single.scss";
import { useContext, useEffect, useState } from "react";
import Menu from "../../Component/menu/Menu";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../../util/axiosInstance";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import CommentsSection from "../../Component/comment/CommentsSection";
import Loader from "../../Component/loader/Loader";
import PostFooter from "../../Component/postfooter/PostFooter";

const Single = () => {
  const [post, setPost] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [hasCommented, setHasCommented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const location = useLocation();
  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get(`/posts/${postId}`);
        setPost(res.data);

        // Fetch likes and comments data
        const [
          likesResponse,
          likeStatusResponse,
          likedUsersResponse,
          commentsCountResponse,
          commentStatusResponse,
        ] = await Promise.all([
          axiosInstance.get(`/likes/${postId}`),
          axiosInstance.get(`/likes/${postId}/likes/status`),
          axiosInstance.get(`/likes/${postId}/likes`),
          axiosInstance.get(`/comments/count/${postId}`),
          axiosInstance.get(`/comments/${postId}/status`),
        ]);

        setIsLiked(likeStatusResponse.data.isLiked);
        setLikedUsers(likedUsersResponse.data.likes);
        setCommentsCount(commentsCountResponse.data.commentsCount);
        setHasCommented(commentStatusResponse.data.hasCommented);

        // Ensure likes count is updated in state
        setPost((prevPost) => ({
          ...prevPost,
          likes: likesResponse.data.likesCount, // Ensure this is updated
        }));

        // Fetch related posts based on category
        const relatedPostsResponse = await axiosInstance.get(
          `/posts?cat=${res.data.cat}`
        );

        // Filter out the current post from the related posts
        const filteredPosts = relatedPostsResponse.data.filter(
          (relatedPost) => relatedPost.id !== res.data.id
        );
        setRelatedPosts(filteredPosts);
      } catch (err) {
        setError(
          err.response?.data || "Failed to fetch post. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleLikeToggle = async (newLikeState) => {
    try {
      const response = newLikeState
        ? await axiosInstance.post(`/likes/${postId}/likes`)
        : await axiosInstance.delete(`/likes/${postId}/likes`);

      // Update the likes count and isLiked state
      setPost((prevPost) => ({
        ...prevPost,
        likes: response.data.likesCount,
      }));
      setIsLiked(newLikeState);
    } catch (error) {
      console.error(
        "Error toggling like:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="singleMain">
      {isLoading ? (
        <>
          {error ? (
            <h1 style={{ color: "red" }}>{error}</h1>
          ) : (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <Loader size="40px" color="#2ecc71" type="spin" />
              <div className="loading">Loading post...</div>
            </div>
          )}
        </>
      ) : (
        <div className="single">
          {post.img && (
            <div className="img">
              <img
                src={`${baseUrl}/uploads/${post?.img}` || "./default-image.png"}
                alt={post?.title}
              />
            </div>
          )}

          <div className="content">
            <h1>{post?.title}</h1>
            <div
              className="desc"
              dangerouslySetInnerHTML={{ __html: post?.desc }}
            ></div>
            <PostFooter
              likes={post.likes}
              comments={commentsCount}
              isLiked={isLiked}
              onLikeToggle={handleLikeToggle}
              likedUsers={likedUsers}
              postId={postId}
              hasCommented={hasCommented}
            />
          </div>

          <div className="user">
            <div className="userImage">
              <>
                {currentUser ? (
                  <Link className="link editBtn" to={`/profile/${post.uid}`}>
                    <img
                      src={
                        post.userImg
                          ? `${baseUrl}/uploads/${post.userImg}`
                          : "/default-user.png"
                      }
                      alt={post?.username}
                    />
                  </Link>
                ) : (
                  <img
                    src={
                      post.userImg
                        ? `${baseUrl}/uploads/${post.userImg}`
                        : "/default-user.png"
                    }
                    alt={post?.username}
                  />
                )}
              </>
              <div className="userprofile">
                {currentUser ? (
                  <Link
                    to={`/profile/${post.uid}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {post.username}
                  </Link>
                ) : (
                  <p style={{ textDecoration: "none", color: "inherit" }}>
                    {post.username}
                  </p>
                )}
                <p>Posted {moment(post.postDate).fromNow()}</p>
              </div>
              {currentUser?.email === post?.email && (
                <div className="edit">
                  <Link
                    className="link editBtn"
                    to={`/write?edit=${postId}`}
                    state={{
                      title: post?.title,
                      desc: post?.desc,
                      img: post?.img,
                      category: post?.cat,
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    className="delete"
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        "Are you sure you want to delete this post?"
                      );
                      if (confirmDelete) {
                        try {
                          await axiosInstance.delete(`/posts/${postId}`);
                          alert("Post deleted successfully.");
                          window.location.replace("/");
                        } catch (error) {
                          console.error("Error deleting post:", error);
                          alert("Failed to delete the post. Please try again.");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="comment">
            <CommentsSection />
          </div>
        </div>
      )}
      <Menu relatedPosts={relatedPosts} />
    </div>
  );
};

export default Single;
