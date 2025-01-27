import "./write.scss";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosInstance from "../../util/axiosInstance";

const Write = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [currentImg, setCurrentImg] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isEditMode = query.get("edit");

  useEffect(() => {
    if (isEditMode) {
      const { title, desc, img, category } = location.state || {};
      setTitle(title || "");
      setDesc(desc || "");
      setCategory(category || "");
      setCurrentImg(img || "");
    }
  }, [isEditMode, location.state]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Generate a preview URL for the selected image
    const reader = new FileReader();
    reader.onload = (event) => {
      setCurrentImg(event.target.result);
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("category", category);

    if (file) {
      formData.append("file", file);
    } else if (isEditMode && currentImg) {
      formData.append("currentImg", currentImg);
    }

    try {
      if (isEditMode) {
        await axiosInstance.put(`/posts/${isEditMode}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/posts/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to save the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            theme="snow"
            value={desc}
            onChange={setDesc}
            className="editor"
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h2>Public</h2>
          {currentImg && (
            <div className="current-image">
              <img
                src={file ? currentImg : `${baseUrl}/uploads/${currentImg}`}
                alt="Preview"
              />
            </div>
          )}
          <input
            type="file"
            id="input"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="input" className="upload">
            Upload Image
          </label>
          <div className="buttons">
            <button onClick={handleSubmit} disabled={loading}>
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Post"
                : "Publish Post"}
            </button>
          </div>
        </div>
        <div className="item">
          <h2>Category</h2>
          {[
            "Politics",
            "Sport",
            "Celebrities",
            "Crime",
            "Technology",
            "Science",
            "Art",
            "Fashion",
          ].map((cat) => (
            <div className="cat" key={cat}>
              <input
                type="radio"
                name="category"
                id={cat}
                value={cat}
                checked={category === cat}
                onChange={(e) => setCategory(e.target.value)}
              />
              <label htmlFor={cat}>{cat}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Write;
