import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import likRoute from './routes/likeRoute.js';
import cors from 'cors';
// import path from 'path'; // Removed path import

dotenv.config();
const app = express();
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
// app.use('/uploads', express.static(path.join('uploads'))); // Removed static middleware

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likRoute);

// Error handling for file uploads
app.use((err, req, res, next) => {
  if (err.message === 'Only image files are allowed') {
    res.status(400).json({ message: err.message });
  } else {
    next(err);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running on port', process.env.PORT || 3000));