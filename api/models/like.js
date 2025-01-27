import db from "../config/db.js";

const Like = {
  // Add a new like
  addLike: async (postId, userId, date) => {
    const sql = `
      INSERT INTO likes (postId, userId, date) 
      VALUES (?, ?, ?)
    `;
    return db.execute(sql, [postId, userId, date]);
  },

  // Remove a like
  removeLike: async (postId, userId) => {
    const sql = `
      DELETE FROM likes 
      WHERE postId = ? AND userId = ?
    `;
    return db.execute(sql, [postId, userId]);
  },

  // Check if a user has liked a specific post
  findLike: async (postId, userId) => {
    const sql = `
      SELECT * FROM likes 
      WHERE postId = ? AND userId = ?
    `;
    const [rows] = await db.execute(sql, [postId, userId]);
    return rows[0];
  },

  // Get all likes for a post
  getLikesByPostId: async (postId) => {
    const sql = `
      SELECT 
        l.userId, 
        u.username, 
        u.img AS userImg 
      FROM likes l 
      JOIN users u ON l.userId = u.id 
      WHERE l.postId = ?
    `;
    const [rows] = await db.execute(sql, [postId]);
    return rows;
  },
  

  // Count the total number of likes for a post
  countLikesByPostId: async (postId) => {
    const sql = `
      SELECT COUNT(*) AS likesCount 
      FROM likes 
      WHERE postId = ?
    `;
    const [rows] = await db.execute(sql, [postId]);
    return rows[0].likesCount;
  },
};

export default Like;
