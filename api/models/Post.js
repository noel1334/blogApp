import db from '../config/db.js';

const Post = {
  create: async (title, desc,  img, date, userId, category) => {
    const sql = 'INSERT INTO posts (title, `desc`, img, date, uid, cat) VALUES (?, ?, ?, ?, ?, ?)';
    return db.execute(sql, [title, desc, img || null, date, userId, category]); 
  },

  update: async (postId, title, desc, img, date, category, updateImage) => {
    const baseQuery = `
      UPDATE posts 
      SET title = ?, \`desc\` = ?, date = ?, cat = ?
    `;
  
    const sql = updateImage
      ? `${baseQuery}, img = ? WHERE id = ?`
      : `${baseQuery} WHERE id = ?`;
  
    const params = updateImage
      ? [title, desc, date, category, img, postId]
      : [title, desc, date, category, postId];
  
    return db.execute(sql, params);
  },

  
  delete: async (postId) => {
    const sql = 'DELETE FROM posts WHERE id = ?';
    return db.execute(sql, [postId]);
  },

  findByOwner: async (uid) => {
    const sql = 'SELECT * FROM posts WHERE uid = ?';
    const [rows] = await db.execute(sql, [uid]);
    return rows;
  },

  findAll: async () => {
    const sql = 'SELECT * FROM posts';
    const [rows] = await db.execute(sql);
    return rows;
  },
  
    findByCat: async (q) => {
      const sql = 'SELECT * FROM posts WHERE cat = ?';
      const [rows] = await db.execute(sql, [q]);
      return rows;
    },
  
    findById: async (postId) => {
      const sql = `SELECT p.id, p.title, p.desc, p.img, p.uid,  p.date AS postDate, p.cat, u.username, u.email, u.img AS userImg 
                    FROM posts p join users u on p.uid = u.id WHERE p.id = ?`;
      const [rows] = await db.execute(sql, [postId]);
      return rows[0];
    },

};

export default Post;
