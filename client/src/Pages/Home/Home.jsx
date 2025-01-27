import "./home.scss";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../util/axiosInstance";
import Loader from "../../Component/loader/Loader";
import PostFooter from "../../Component/postfooter/PostFooter";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const cat = useLocation().search;
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const [expandedPosts, setExpandedPosts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/posts${cat}`);
        const postsWithLikesAndComments = await Promise.all(
          res.data.map(async (post) => {
            const [
              likesResponse,
              likeStatusResponse,
              likedUsersResponse,
              commentsCountResponse,
              commentStatusResponse,
            ] = await Promise.all([
              axiosInstance.get(`/likes/${post.id}`),
              axiosInstance.get(`/likes/${post.id}/likes/status`),
              axiosInstance.get(`/likes/${post.id}/likes`),
              axiosInstance.get(`/comments/count/${post.id}`),
              axiosInstance.get(`/comments/${post.id}/status`),
            ]);

            return {
              ...post,
              likes: likesResponse.data.likesCount,
              isLiked: likeStatusResponse.data.isLiked,
              likedUsers: likedUsersResponse.data.likes,
              comments: commentsCountResponse.data.commentsCount,
              hasCommented: commentStatusResponse.data.hasCommented,
            };
          })
        );
        setPosts(postsWithLikesAndComments);
      } catch (err) {
        setError(
          err.response?.data || "Failed to fetch posts. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cat]);

  const toggleReadMore = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLike = async (postId, isLiked) => {
    try {
      const response = isLiked
        ? await axiosInstance.post(`/likes/${postId}/likes`)
        : await axiosInstance.delete(`/likes/${postId}/likes`);

      const updatedLikesCount = response.data.likesCount;

      // Update the specific post's likes count in the state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: updatedLikesCount } : post
        )
      );
    } catch (error) {
      console.error(
        "Error updating like:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          {error ? (
            <h1 style={{ color: "red" }}>{error}</h1>
          ) : (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <Loader size="40px" color="#2ecc71" type="spin" />
              <div className="loading">Loading posts...</div>
            </div>
          )}
        </>
      ) : (
        <div className="home">
          <div className="container">
            <div className="posts">
              {posts.map((post) => (
                <div className="post" key={post?.id}>
                  <Link className="link img" to={`/post/${post.id}`}>
                    <img src={`${baseUrl}/uploads/${post?.img}`} alt="" />
                  </Link>
                  <div className="content">
                    <Link className="link" to={`/post/${post.id}`}>
                      <h1>{post?.title}</h1>
                    </Link>
                    <div className="contentPost">
                      <div
                        className="desc"
                        dangerouslySetInnerHTML={{
                          __html: expandedPosts[post.id]
                            ? post?.desc
                            : post?.desc.slice(0, 100) + "...",
                        }}
                      ></div>
                      <button onClick={() => toggleReadMore(post.id)}>
                        {expandedPosts[post.id] ? "Show Less" : "Read More"}
                      </button>
                    </div>
                  </div>
                  <PostFooter
                    likes={post.likes}
                    comments={post.comments}
                    isLiked={post.isLiked}
                    onLikeToggle={(isLiked) => handleLike(post.id, isLiked)}
                    likedUsers={post.likedUsers}
                    postId={post.id}
                    hasCommented={post.hasCommented}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
