import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getAllPosts,
  getSinglePost,
  getCategories,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js"; 

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  uploadMiddleware.single("file"), 
  createPost
);
router.put("/:postId", authMiddleware, uploadMiddleware.single("file"),  updatePost);
router.delete("/:postId", authMiddleware, deletePost);
router.get("/user", authMiddleware, getUserPosts);
router.get("/:id", getSinglePost);
router.get("/", getAllPosts);
router.get("/categories", getCategories); 


export default router;
