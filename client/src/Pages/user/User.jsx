import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import "./user.scss";
import moment from "moment";
import axiosInstance from "../../util/axiosInstance";
import UpdateProfile from "../../Component/update/UpdateProfile";
import { AuthContext } from "../../context/authContext";

const User = () => {
  const { currentUser } = useContext(AuthContext);
  const { uid } = useParams();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(`/auth/user/${uid}`);
        setUser(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch user details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [uid]);

  const handleReadMore = (postId) => {
    setUser((prevState) => ({
      ...prevState,
      posts: prevState.posts.map((post) =>
        post.id === postId ? { ...post, expanded: !post.expanded } : post
      ),
    }));
  };

  if (isLoading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <>
      <div className="profile">
        <img
          src={user?.profileImg ? `${user?.profileImg}` : "/default-user.png"}
          alt={user.name}
        />
        <h1>{user.name} Profile</h1>
        <p>Email: {user.email}</p>
        {currentUser.id === user.id && (
          <>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
              <UpdateProfile setIsEditing={setIsEditing} />
            )}
          </>
        )}
      </div>

      <div className="post">
        <h2>Posts</h2>
        {user.posts && user.posts.length > 0 ? (
          user.posts.map((post) => (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              {post.img && <img src={`${post?.img}`} alt={post.title} />}
              <div
                className={`desc ${post.expanded ? "expanded" : ""}`}
                dangerouslySetInnerHTML={{ __html: post?.desc }}
              ></div>
              <button
                className="read-more-btn"
                onClick={() => handleReadMore(post.id)}
              >
                {post.expanded ? "Read Less" : "Read More"}
              </button>
              <p>Posted {moment(post.date).fromNow()}</p>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </>
  );
};

export default User;
