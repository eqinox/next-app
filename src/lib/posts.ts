import sql from "better-sqlite3";
import { PostType } from "@/types/posts";
import { deleteImage } from "./cloudinary";

const db = sql("data.db");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, 
      firstName TEXT, 
      lastName TEXT,
      email TEXT
    )`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY, 
      imageUrl TEXT NOT NULL,
      title TEXT NOT NULL, 
      content TEXT NOT NULL, 
      createDate TEXT DEFAULT CURRENT_TIMESTAMP,
      updateDate TEXT DEFAULT CURRENT_TIMESTAMP,
      userId INTEGER, 
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    )`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      userId INTEGER, 
      postId INTEGER, 
      PRIMARY KEY(userId, postId),
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE, 
      FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
    )`);

  // Creating two dummy users if they don't exist already
  const stmt = db.prepare("SELECT COUNT(*) AS count FROM users");
  const countUsers = stmt.get() as { count: number }; // Explicitly cast the result

  if (countUsers.count === 0) {
    db.exec(`
    INSERT INTO users (firstName, lastName, email)
    VALUES ('Vasil', 'Nikolov', 'vasil@example.com')
  `);

    db.exec(`
    INSERT INTO users (firstName, lastName, email)
    VALUES ('Gosho', 'Petkov', 'gosho@example.com')
  `);
  }
}

initDb();

export async function getAllPosts() {
  const stmt = db.prepare("SELECT * FROM posts");
  const posts = stmt.all();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return posts;
}

export async function getPostById(postId: number): Promise<PostType> {
  const stmt = db.prepare("SELECT * FROM posts WHERE id = ?");

  const post = stmt.get(postId) as PostType;

  return post;
}

export async function storePost(post: PostType) {
  const stmt = db.prepare(
    `INSERT INTO posts (imageUrl, title, content, userId)
    VALUES (?, ?, ?, ?)`,
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return stmt.run(post.imageUrl, post.title, post.content, post.userId);
}

export async function updatePost(post: PostType) {
  const stmt = db.prepare(
    `UPDATE posts
     SET title = ?, content = ?, updateDate = ?
     WHERE id = ?`,
  );

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const updateDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  return stmt.run(post.title, post.content, updateDate, post.id);
}

export async function deletePost(postId: number) {
  console.log(`Deleting post with ID: ${postId}`);

  const post = db.prepare("SELECT * FROM posts WHERE id = ?");
  const res: PostType = post.get(postId) as PostType;

  let imagePublicId: string = "";
  const match = res.imageUrl.match(/(nextjsApp.+?)\./);
  if (match) {
    imagePublicId = match[1];
  }

  try {
    await deleteImage(imagePublicId);
  } catch (err) {
    throw new Error(
      `Post with ID ${postId} cannot be deleted because image with publicId: ${imagePublicId} cannot be deleted or does not exist`,
    );
  }

  const stmt = db.prepare("DELETE FROM posts WHERE id = ?");

  const result = stmt.run(postId);

  if (result.changes === 0) {
    throw new Error(
      `Post with ID ${postId} does not exist or could not be deleted.`,
    );
  }

  console.log(`Post with ID ${postId} successfully deleted.`);
  return result;
}
