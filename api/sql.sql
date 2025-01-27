
-- Truncate all the tables in your database in the correct order
TRUNCATE TABLE comments;
TRUNCATE TABLE likes;
TRUNCATE TABLE posts;
TRUNCATE TABLE users;

-- Alter the likes table to add foreign key constraints with CASCADE
ALTER TABLE likes
  ADD CONSTRAINT FK_likes_postId FOREIGN KEY (postId) 
  REFERENCES posts(id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

ALTER TABLE likes
  ADD CONSTRAINT FK_likes_userId FOREIGN KEY (userId) 
  REFERENCES users(id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- Alter the comments table to add foreign key constraints with CASCADE
ALTER TABLE comments
  ADD CONSTRAINT FK_comments_postId FOREIGN KEY (postId) 
  REFERENCES posts(id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

ALTER TABLE comments
  ADD CONSTRAINT FK_comments_userId FOREIGN KEY (userId) 
  REFERENCES users(id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;

-- Alter the posts table to add foreign key constraint with CASCADE
ALTER TABLE posts
  ADD CONSTRAINT FK_posts_userId FOREIGN KEY (uid) 
  REFERENCES users(id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE;
