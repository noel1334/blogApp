import express from 'express';
import {
  register,
  login,
  logout,
  updateUser,
  deleteUser,
  getUserById,
  validateToken,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.get("/validate", authMiddleware, validateToken);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update/:id', authMiddleware, uploadMiddleware.single('userImg'), updateUser);
router.get('/user/:uid', authMiddleware,  getUserById);
router.delete('/delete', authMiddleware, deleteUser);

export default router;
