import "./write.scss";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosInstance from "../../util/axiosInstance";

// import { useNavigate } from "react-router-dom";

const Write = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  // const navigate = useNavigate();
  console.log(desc);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("category", category);
    if (file) formData.append("file", file);

    try {
      const res = await axiosInstance.post("/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      // navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
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
            className="edittor"
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h2>Public</h2>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <div className="buttons">
            <button onClick={handleSubmit}>Publish</button>
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
