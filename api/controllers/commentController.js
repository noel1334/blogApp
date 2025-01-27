import path from "path";
import fs from "fs";
import Comment from "../models/Comment.js";
import db from "../config/db.js";

// Update the __dirname workaround for ES Modules
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

// Add a new comment
export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { commentText } = req.body;
  const file = req.file ? req.file.filename : null;
  const userId = req.user.id;
  const date = new Date();

  try {
    if (!commentText && !file) {
      return res.status(400).json({ message: "Comment text or file is required." });
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

    // If there was an error, delete the uploaded image (if any)
    if (file) {
      const filePath = path.join(__dirname, "..", "uploads", file).replace(/^\\/, "");
      deleteImageFile(filePath); // Delete the image file
    }

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
  const file = req.file ? req.file.filename : null;
  const userId = req.user.id;
  const date = new Date();

  try {
    // Check if comment exists and belongs to the user
    const comment = await Comment.findCommentById(commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    if (comment.userId !== userId) {
      return res.status(403).json("Unauthorized to update this comment");
    }

    // If there's a new file and the comment already has a file, delete the old one
    if (file && comment.file) {
      const oldFilePath = path.join(__dirname, "..", "uploads", comment.file).replace(/^\\/, "");
      // Delete the old file only if the new file is different
      if (comment.file !== file) {
        deleteImageFile(oldFilePath);
      }
    }

    // Update the comment in the database (retain the old file if no new file is uploaded)
    const updatedComment = await Comment.updateComment(
      commentId,
      userId,
      commentText,
      file || comment.file, // Keep the old file if no new file is provided
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

    // Delete old file if exists
    if (comment.file) {
      const oldFilePath = path.join(__dirname, "..", "uploads", comment.file).replace(/^\\/, "");
      deleteImageFile(oldFilePath);
    }

    await Comment.deleteComment(commentId, userId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to delete comment");
  }
};
