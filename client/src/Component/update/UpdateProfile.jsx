import { useState, useContext } from "react";
import "./updateProfile.scss";
import axiosInstance from "../../util/axiosInstance";
import { AuthContext } from "../../context/authContext";

const UpdateProfile = ({ setIsEditing }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [username, setUsername] = useState(currentUser?.username || "");
  const [userImg, setUserImg] = useState(currentUser?.userImg || "");
  const [tempImg, setTempImg] = useState(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImg(file);
      setTempImg(URL.createObjectURL(file));
    }
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
          />
        </div>
        <div className="formGroup">
          <label htmlFor="userImg">Profile Picture</label>
          <input type="file" id="userImg" onChange={handleImageChange} />
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
          />
        </div>
        <button type="submit">Update Profile</button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UpdateProfile;
