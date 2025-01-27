
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.authToken; 
  if (!token) return res.status(401).json({ message: 'Authentication failed. Token not provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired.' });

    req.user = user; 
    next();
  });
};

export default authMiddleware;
