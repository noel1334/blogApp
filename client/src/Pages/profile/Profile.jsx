import { useState, useContext } from "react";
import "./profile.scss";
import UpdateProfile from "../../Component/update/UpdateProfile";
import { AuthContext } from "../../context/authContext";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  // Check if profile image exists, if not, fallback to default image
  const profileImg = currentUser?.img
    ? `${currentUser.img}`
    : "/default-user.png";

  return (
    <div className="profile">
      {!isEditing ? (
        <div className="profileView">
          <img src={profileImg} alt="Profile" className="profileImage" />
          <h1>{currentUser?.username}</h1>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <UpdateProfile setIsEditing={setIsEditing} />
      )}
    </div>
  );
};

export default Profile;
