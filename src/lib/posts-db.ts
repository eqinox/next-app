import sql from "better-sqlite3";
import { PostType, PostTypeDB } from "@/types/post-types";
import { deleteImage } from "./cloudinary";
import { UserType } from "@/types/user-types";

const db = sql("data.db");

export async function getAllPosts() {
  const stmt = db.prepare(`
    SELECT 
      posts.id,
      posts.imageUrl,
      posts.title,
      posts.content,
      posts.createDate,
      posts.updateDate,
      posts.userId,
      users.firstName,
      users.lastName
    FROM posts
    JOIN users ON posts.userId = users.id
  `);

  const rawPosts = stmt.all() as [PostType & UserType];

  // Map the results to include `createdBy` property
  const posts = rawPosts.map((post) => ({
    id: post.id,
    imageUrl: post.imageUrl,
    title: post.title,
    content: post.content,
    createDate: post.createDate,
    updateDate: post.updateDate,
    createdBy: {
      id: post.userId,
      firstName: post.firstName,
      lastName: post.lastName,
    },
  }));

  // Simulate delay for testing purposes
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return posts;
}

export async function getPostById(postId: number): Promise<PostType> {
  const stmt = db.prepare("SELECT * FROM posts WHERE id = ?");

  const post = stmt.get(postId) as PostType;

  return post;
}

export async function storePost(post: PostTypeDB) {
  const stmt = db.prepare(
    `INSERT INTO posts (imageUrl, title, content, userId)
    VALUES (?, ?, ?, ?)`,
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return stmt.run(post.imageUrl, post.title, post.content, post.userId);
}

export async function updatePost(post: PostTypeDB) {
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
  const res: PostTypeDB = post.get(postId) as PostTypeDB;

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
