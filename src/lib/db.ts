import sql from "better-sqlite3";

const db = sql("data.db");

function initDb() {
  db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY, 
        firstName TEXT, 
        lastName TEXT,
        password TEXT,
        email TEXT NOT NULL UNIQUE
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
        FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
      )`);
  db.exec(`
      CREATE TABLE IF NOT EXISTS likes (
        userId INTEGER, 
        postId INTEGER, 
        PRIMARY KEY(userId, postId),
        FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE, 
        FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
      )`);

  db.exec(`CREATE TABLE IF NOT EXISTS sessions (
          id TEXT NOT NULL PRIMARY KEY,
          expires_at INTEREG NOT NULL,
          user_id TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

  // Creating two dummy users if they don't exist already
  const stmt = db.prepare("SELECT COUNT(*) AS count FROM users");
  const countUsers = stmt.get() as { count: number }; // Explicitly cast the result

  if (countUsers.count === 0) {
    db.exec(`
      INSERT INTO users (firstName, lastName, email, password)
      VALUES ('Vasil', 'Nikolov', 'vasil@example.com', '123456')
    `);

    db.exec(`
      INSERT INTO users (firstName, lastName, email, password)
      VALUES ('Gosho', 'Petkov', 'gosho@example.com', '123456')
    `);
  }
}

initDb();
