import Post from "../models/post.js";
import db from "../config/db.js";  
import axios from "axios";


// Function to upload to ImgBB
const uploadToImgBB = async (fileBuffer, apiKey) => {
  try {
    const formData = new FormData();
    formData.append("image", new Blob([fileBuffer]));  // Use Blob
    formData.append("key", apiKey);

    const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return response.data.data.url;
    } else {
      console.error("ImgBB upload failed:", response.data);
      throw new Error("ImgBB upload failed");
    }
  } catch (error) {
    console.error("Error uploading to ImgBB:", error);
    throw error;
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { title, desc, category } = req.body;
  const userId = req.user.id;
  let img = null;
  const date = new Date();
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: "ImgBB API key not set in environment." });
  }

  try {
    if (req.file) {
      img = await uploadToImgBB(req.file.buffer, apiKey);  
    }

    const result = await Post.create(title, desc, img, date, userId, category);
    res.status(200).json({
      message: "Post created successfully",
      postId: result[0].insertId,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Error creating post.", error: err });
  }
};

// Update an existing post
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, desc, category } = req.body;
  let img = null;
  const date = new Date();
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: "ImgBB API key not set in environment." });
  }

  if (!title || !desc || !category || !postId) {
    return res.status(400).json("Missing required fields");
  }

  try {
    const post = await Post.findById(postId);
    if (!post || post.uid !== req.user.id) {
      return res.status(403).json("Unauthorized to update this post");
    }

    if (req.file) {
      img = await uploadToImgBB(req.file.buffer, apiKey);

      if (post.img) {
        // Implement logic to delete from ImgBB using the stored deletion URL if available.
      }
    }

    await Post.update(postId, title, desc, img, date, category, !!img);
    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json("Failed to update post");
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post || post.uid !== req.user.id) {
      return res.status(403).json("Unauthorized to delete this post");
    }

    if (post.img) {
      // Implement logic to delete from ImgBB using the stored deletion URL if available.
    }

    await Post.delete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json("Failed to delete post");
  }
};

// Get all posts of a user
export const getUserPosts = async (req, res) => {
  try {
    const uid = req.user.id;
    const posts = await Post.findByOwner(uid);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json("Failed to fetch user posts");
  }
};

// Get a single post by ID
export const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching single post:", error);
    res.status(500).json("Failed to fetch single post");
  }
};

// Get all posts or posts by category
export const getAllPosts = async (req, res) => {
  try {
    const q = req.query.cat;
    if (q) {
      const posts = await Post.findByCat(q);
      res.status(200).json(posts);
    } else {
      const posts = await Post.findAll();
      res.status(200).json(posts);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json("Failed to fetch posts");
  }
};

// Fetch unique categories
export const getCategories = async (req, res) => {
  try {
    const sql = 'SELECT DISTINCT cat FROM categories';
    const [categories] = await db.execute(sql);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};