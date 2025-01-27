import db from '../config/db.js';

const User = {
  create: async (name, email, password, currentDate) => {
    const sql = 'INSERT INTO users (username, email, password, date) VALUES (?, ?, ?, ?)';
    return db.execute(sql, [name, email, password, currentDate]);
  },

  findById: async (id) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },
  findUserById: async (uid) => {
    const sql = `
      SELECT 
        u.id, u.username, u.email, u.img, u.date, 
        p.id AS postId, p.title, p.desc, p.img AS postImg, p.date AS postDate 
      FROM users u 
      LEFT JOIN posts p ON u.id = p.uid 
      WHERE u.id = ?`;
    const [rows] = await db.execute(sql, [uid]);
    // console.log("SQL Query Result:", rows);
    return rows;
  },
  

  findByEmail: async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(sql, [email]);
    return rows[0];
  },

  update: async (userId, username, profileImage, password) => {
    let sql, params;

    if (password) {
      sql = 'UPDATE users SET username = ?, img = ?, password = ? WHERE id = ?';
      params = [username, profileImage, password, userId];
    } else {
      sql = 'UPDATE users SET username = ?, img = ? WHERE id = ?';
      params = [username, profileImage, userId];
    }

    return db.execute(sql, params);
  },

  delete: async (id) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    return db.execute(sql, [id]);
  },
};

export default User;
