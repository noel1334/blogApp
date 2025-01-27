import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CommentsList.scss";
import AddComment from "./AddComment";
import CommentsList from "./CommentsList";
import { AuthContext } from "../../context/authContext";
import axiosInstance from "../../util/axiosInstance";

const CommentsSection = () => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const location = useLocation();
  const postId = location.pathname.split("/").pop();

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comments/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  return (
    <div className="commentsSection">
      <h3>Comments</h3>
      <CommentsList comments={comments} onCommentUpdate={fetchComments} />
      {currentUser && (
        <AddComment postId={postId} onComment={handleAddComment} />
      )}
    </div>
  );
};

export default CommentsSection;
