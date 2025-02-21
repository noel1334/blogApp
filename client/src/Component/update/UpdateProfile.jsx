import { useState, useContext, useRef } from "react";
import "./updateProfile.scss";
import axiosInstance from "../../util/axiosInstance";
import { AuthContext } from "../../context/authContext";
import { FaImage } from "react-icons/fa"; // Import the image icon

const UpdateProfile = ({ setIsEditing }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [username, setUsername] = useState(currentUser?.username || "");
  const [userImg, setUserImg] = useState(currentUser?.userImg || "");
  const [tempImg, setTempImg] = useState(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      if (userImg instanceof File) {
        formData.append("userImg", userImg);
      }
      if (password) {
        formData.append("password", password);
      }

      console.log("Sending FormData:", Array.from(formData.entries()));

      const res = await axiosInstance.put(
        `/auth/update/${currentUser.id}`,
        formData
      );

      setCurrentUser(res.data);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setMessage(
        "Failed to update profile. Please check your inputs and try again."
      );
    } finally {
      setIsLoading(false); // Set loading to false when update finishes (success or fail)
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImg(file);
      setTempImg(URL.createObjectURL(file));
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // Programmatically click the file input
  };

  return (
    <div className="updateProfile">
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleUpdate}>
        <div className="formGroup">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="userImg">Profile Picture</label>
          <div className="image-upload-container">
            <FaImage
              className="image-upload-icon"
              onClick={handleIconClick}
              style={{ cursor: "pointer" }}
            />
            <input
              type="file"
              id="userImg"
              onChange={handleImageChange}
              disabled={isLoading}
              ref={fileInputRef} // Attach the ref
              style={{ display: "none" }} // Hide the file input
            />
          </div>
          {tempImg && (
            <img src={tempImg} alt="Temporary Preview" className="tempImage" />
          )}
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          disabled={isLoading}
        >
          Cancel
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UpdateProfile;
