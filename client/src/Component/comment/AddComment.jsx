import { useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { FiPaperclip } from "react-icons/fi"; // Import react-icon
import "./AddComment.scss";
import axiosInstance from "../../util/axiosInstance";

const AddComment = ({ onComment, postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const profileImg = currentUser?.img
    ? `${currentUser.img}`
    : "/default-user.png";
  console.log(profileImg);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim() && !file) {
      setError("Please add a comment or attach a file!");
      return;
    }

    const formData = new FormData();
    formData.append("commentText", comment);
    if (file) formData.append("file", file);

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `/comments/${postId}/comments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // Ensure the response includes user details and the newly added comment
      onComment({
        id: response.data.comment.id,
        text: response.data.comment.text,
        username: currentUser.username,
        userImg: currentUser.img || "default-user.png",
        date: response.data.comment.date,
        file: response.data.comment.file,
      });
      setComment("");
      setFile(null);
      setFilePreview(null);
      setError("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to post the comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="addComment">
      <form onSubmit={handleCommentSubmit}>
        <div className="commentRow">
          <img src={profileImg} alt="User Avatar" className="userAvatar" />
          <div className="textareaWrapper">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
            ></textarea>
            <FiPaperclip className="attachIcon" onClick={triggerFileInput} />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="submitBtn" disabled={isLoading}>
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
        {filePreview && (
          <div className="previewFile">
            <img src={filePreview} alt="File Preview" />
            <p>(New File Preview)</p>
          </div>
        )}
        {error && <p className="errorText">{error}</p>}
      </form>
    </div>
  );
};

export default AddComment;
