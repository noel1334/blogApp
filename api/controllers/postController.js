import Post from "../models/post.js";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Helper function to delete an image file
const deleteImageFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete image:", err);
      else console.log("Image deleted successfully:", filePath);
    });
  } else {
    console.log("Image file does not exist:", filePath);
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { title, desc, category } = req.body;
  const userId = req.user.id;
  const img = req.file ? req.file.filename : null;
  const date = new Date();

  try {
    const result = await Post.create(title, desc, img, date, userId, category);
    res.status(200).json({
      message: "Post created successfully",
      postId: result[0].insertId,
    });
  } catch (err) {
    if (img) {
      const filePath = path.join(__dirname, "..", "uploads", img).replace(/^\\/, "");
      deleteImageFile(filePath);
    }
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Error creating post.", error: err });
  }
};

// Update an existing post
export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, desc, category } = req.body;
  const img = req.file ? req.file.filename : null;
  const date = new Date();

  if (!title || !desc || !category || !postId) {
    if (img) {
      const filePath = path.join(__dirname, "..", "uploads", img).replace(/^\\/, "");
      deleteImageFile(filePath);
    }
    return res.status(400).json("Missing required fields");
  }

  try {
    const post = await Post.findById(postId);
    if (!post || post.uid !== req.user.id) {
      if (img) {
        const filePath = path.join(__dirname, "..", "uploads", img).replace(/^\\/, "");
        deleteImageFile(filePath);
      }
      return res.status(403).json("Unauthorized to update this post");
    }

    // Delete the old image if a new image is being uploaded
    if (img && post.img) {
      const oldImagePath = path.join(__dirname, "..", "uploads", post.img).replace(/^\\/, "");
      deleteImageFile(oldImagePath);
    }

    await Post.update(postId, title, desc, img, date, category, !!img);
    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    if (img) {
      const filePath = path.join(__dirname, "..", "uploads", img).replace(/^\\/, "");
      deleteImageFile(filePath);
    }
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

    // Delete the associated image if it exists
    if (post.img) {
      const filePath = path.join(__dirname, "..", "uploads", post.img).replace(/^\\/, "");
      deleteImageFile(filePath);
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
    res.status(200).json(categories); // Return categories as a JSON response
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

