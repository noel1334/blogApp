import db from '../config/db.js';

const Comment = {

        addComment: async (postId, userId, commentText, filePath, date) => {
      const sql = `
        INSERT INTO comments (postId, userId, text, file, date) 
        VALUES (?, ?, ?, ?, ?)
      `;
      return db.execute(sql, [postId, userId, commentText || null, filePath || null, date]);
    },
    

    // Get all comments for a post
    getCommentsByPostId: async (postId) => {
      const sql = `
        SELECT c.id, c.text, u.id as uid, c.file, c.date, u.username, u.img AS userImg 
        FROM comments c 
        JOIN users u ON c.userId = u.id 
        WHERE c.postId = ?
        ORDER BY c.date ASC
      `;
      const [rows] = await db.execute(sql, [postId]);
      return rows;
    }, 
    
  // Update a comment
    updateComment: async (commentId, userId, text, filePath, date) => {
      const sql = `
        UPDATE comments 
        SET text = ?, file = ?, date = ? 
        WHERE id = ? AND userId = ?
      `;

      try {
        const result = await db.execute(sql, [
          text,
          filePath || null, 
          date,
          commentId,
          userId,
        ]);

        console.log(`Updated comment with ID: ${commentId}`);
        return result;
      } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
      }
    },

    countCommentsByPostId: async (postId) => {
      const sql = `
        SELECT COUNT(*) AS commentsCount
        FROM comments
        WHERE postId = ?
      `;
      const [rows] = await db.execute(sql, [postId]);
      return rows[0].commentsCount;
    },
    
    // Delete a comment
    deleteComment: async (commentId, userId) => {
      const sql = `
        DELETE FROM comments 
        WHERE id = ? AND userId = ?
      `;
      return db.execute(sql, [commentId, userId]);
    },
  
    findCommentById: async (commentId) => {
      try {
        const sql = `SELECT * FROM comments WHERE id = ?`;
        const [rows] = await db.execute(sql, [commentId]);
        return rows[0];
      } catch (error) {
        console.error("Error finding comment:", error);
        throw error;
      }
    },
}

export default Comment;