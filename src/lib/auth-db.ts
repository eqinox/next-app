import { UserType, UserTypeDB } from "@/types/user-types";
import sql from "better-sqlite3";
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { cookies } from "next/headers";

const db = sql("data.db");

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export async function createAuthSession(userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function verifyAuth() {
  const sessionCookie = (await cookies()).get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return {
      users: null,
      session: null,
    };
  }

  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return {
      users: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch (error) {}

  return result;
}

export async function destroySession() {
  const { session } = await verifyAuth();
  if (!session) {
    return {
      error: "Unauthorized!",
    };
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function createUser(user: UserTypeDB): Promise<UserType> {
  const stmt = db.prepare(
    `INSERT INTO users (firstName, lastName, email, password)
     VALUES (?, ?, ?, ?)`,
  );

  const result = stmt.run(
    user.firstName,
    user.lastName,
    user.email,
    user.password,
  );

  const getStmt = db.prepare(`SELECT * FROM users WHERE id = ?`);

  return getStmt.get(result.lastInsertRowid) as UserType;
}

export async function getUserByEmail(email: string): Promise<UserType> {
  return db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as UserType;
}

export async function getUserById(id: string): Promise<UserType> {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserType;
}
