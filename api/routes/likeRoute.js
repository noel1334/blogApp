import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { toggleLike, getLike, getLikes, checkIfLiked } from "../controllers/likeController.js";

const router = express.Router();

// Like routes
router.post("/:postId/likes", authMiddleware, toggleLike);
router.delete("/:postId/likes", authMiddleware, toggleLike);
router.get("/:postId", getLike);
router.get("/:postId/likes", getLikes);
router.get("/:postId/likes/status", authMiddleware, checkIfLiked);


export default router;

