import { useState, useEffect, useRef, useContext } from "react";
import moment from "moment";
import "./CommentsList.scss";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import { AuthContext } from "../../context/authContext";
import axiosInstance from "../../util/axiosInstance";

const CommentsList = ({ comments, onCommentUpdate }) => {
  const { currentUser } = useContext(AuthContext);
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
  const [showMenuId, setShowMenuId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingFile, setEditingFile] = useState(null);
  const endOfCommentsRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (endOfCommentsRef.current) {
      endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const handleMenuClick = (commentId) => {
    setShowMenuId(showMenuId === commentId ? null : commentId);
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axiosInstance.delete(`/comments/comments/${commentId}`);
        onCommentUpdate();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleEdit = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditingText(text);
    setEditingFile(null);
    setShowMenuId(null);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingText("");
    setEditingFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditingFile({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (commentId) => {
    try {
      const formData = new FormData();
      formData.append("commentText", editingText);
      if (editingFile?.file) {
        formData.append("file", editingFile.file);
      }
      await axiosInstance.put(`/comments/comments/${commentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onCommentUpdate();
      setEditingCommentId(null);
      setEditingText("");
      setEditingFile(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="commentsList">
      {comments.map((comment) => (
        <div
          key={comment.id || `${comment.text}-${comment.date}`}
          className={`comment ${showMenuId === comment.id ? "showMenu" : ""}`}
        >
          <div className="commentHeader">
            {/* <img
              src={`${baseUrl}/uploads/${comment?.userImg}`}
              alt="User Avatar"
              className="userAvatar"
            /> */}
            <img
              src={
                comment?.userImg
                  ? `${baseUrl}/uploads/${comment.userImg}`
                  : "/default-user.png"
              }
              alt="User Avatar"
              className="userAvatar"
            />
            <div>
              <span className="username">{comment.username}</span>
              <span className="commentDate">
                {moment(comment.date).fromNow()}
              </span>
            </div>

            {currentUser?.id === comment.uid && (
              <>
                <span
                  className="threeDots"
                  onClick={() => handleMenuClick(comment.id)}
                >
                  &#8942;
                </span>

                {showMenuId === comment.id && (
                  <div className="optionsMenu">
                    <div
                      className="option"
                      onClick={() => handleEdit(comment.id, comment.text)}
                    >
                      <FiEdit style={{ color: "yellow", marginRight: "8px" }} />
                      Edit
                    </div>
                    <div
                      className="option"
                      onClick={() => handleDelete(comment.id)}
                    >
                      <FiTrash2 style={{ color: "red", marginRight: "8px" }} />
                      Delete
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {editingCommentId === comment.id ? (
            <div className="editComment">
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                autoFocus
              ></textarea>

              <label className="fileUpdateLabel" onClick={handleFileInputClick}>
                <FiUpload style={{ marginRight: "8px" }} />
                {editingFile || comment.file ? "Update Image" : "Add Image"}
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />

              {editingFile?.preview ? (
                <div className="previewFile">
                  <img src={editingFile.preview} alt="Preview" />
                  <p>(New Image Preview)</p>
                </div>
              ) : (
                comment.file && (
                  <div className="existingFile">
                    <img
                      src={`${baseUrl}/uploads/${comment.file}`}
                      alt="Current File"
                    />
                    <p>(Current Image)</p>
                  </div>
                )
              )}

              <div className="editActions">
                <FiCheck
                  className={`saveIcon ${
                    !editingText && !editingFile ? "disabled" : ""
                  }`}
                  onClick={() => handleEditSubmit(comment.id)}
                />
                <FiX className="cancelIcon" onClick={handleEditCancel} />
              </div>
            </div>
          ) : (
            <p className="commentText">{comment.text}</p>
          )}
          {comment.file && (
            <div className="commentFile">
              <img
                src={`${baseUrl}/uploads/${comment?.file}`}
                alt="Attached File"
              />
            </div>
          )}
          <div ref={endOfCommentsRef}></div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
