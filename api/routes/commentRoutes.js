import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js"; 
import { addComment, countCommentsByPostId, deleteComment, getComments, getCommentStatus, updateComment } from "../controllers/commentController.js";

const router = express.Router();


// Comment routes
router.post(
  "/:postId/comments",
  authMiddleware,
  uploadMiddleware.single("file"),
  addComment
);
router.get("/:postId/comments", getComments);
router.put(
  "/comments/:commentId",
  authMiddleware,
  uploadMiddleware.single("file"),
  updateComment
);
router.get('/count/:postId', countCommentsByPostId);
router.get("/:postId/status", authMiddleware, getCommentStatus);
router.delete("/comments/:commentId", authMiddleware, deleteComment);


export default router;