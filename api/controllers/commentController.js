import db from "../config/db.js";  
import Comment from "../models/Comment.js";
import axios from "axios";

// Function to upload to ImgBB (same as in postController)
const uploadToImgBB = async (fileBuffer, apiKey) => {
  try {
    const formData = new FormData();
    formData.append("image", new Blob([fileBuffer]));
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


// Add a new comment
export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { commentText } = req.body;
  const userId = req.user.id;
  const date = new Date();
  let file = null; // Changed from req.file to file
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: "ImgBB API key not set in environment." });
  }

  try {
    if (!commentText && !req.file) {
      return res.status(400).json({ message: "Comment text or file is required." });
    }

    //Upload file to ImgBB if exist
    if (req.file) {
      file = await uploadToImgBB(req.file.buffer, apiKey);
    }

    // Attempt to add the comment
    const result = await Comment.addComment(postId, userId, commentText, file, date);

    // If the comment is successfully added, respond with the success message
    res.status(201).json({
      message: "Comment added successfully",
      comment: {
        id: result[0].insertId,
        text: commentText,
        file,
        date,
        userId,
        postId,
      },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Get comments by postId
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.getCommentsByPostId(postId);
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to fetch comments");
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { commentText } = req.body;
  const userId = req.user.id;
  const date = new Date();
  let file = null;
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: "ImgBB API key not set in environment." });
  }

  try {
    // Check if comment exists and belongs to the user
    const comment = await Comment.findCommentById(commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    if (comment.userId !== userId) {
      return res.status(403).json("Unauthorized to update this comment");
    }

    //Handle file upload to ImgBB
     if (req.file) {
      file = await uploadToImgBB(req.file.buffer, apiKey);
    }

    // Update the comment in the database
    const updatedComment = await Comment.updateComment(
      commentId,
      userId,
      commentText,
      file || comment.file, 
      date
    );

    if (updatedComment[0].affectedRows === 0) {
      return res.status(400).json("Failed to update comment");
    }

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json("Failed to update comment");
  }
};

export const countCommentsByPostId = async (req, res) => {
  const { postId } = req.params;

  try {
    const commentsCount = await Comment.countCommentsByPostId(postId);

    // Send the count as the response
    return res.status(200).json({ commentsCount });
  } catch (error) {
    console.error('Error fetching comment count:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCommentStatus = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS commentCount FROM comments WHERE postId = ? AND userId = ?",
      [postId, userId]
    );
    res.json({ hasCommented: rows[0].commentCount > 0 });
  } catch (error) {
    console.error("Error fetching comment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  try {
    const comment = await Comment.findCommentById(commentId);
    if (!comment || comment.userId !== userId) {
      return res.status(403).json("Unauthorized to delete this comment");
    }

    await Comment.deleteComment(commentId, userId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to delete comment");
  }
};