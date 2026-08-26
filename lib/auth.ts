import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

const SESSION_COOKIE = "wanghaf_session";
const SESSION_LENGTH_MS = 30 * 24 * 60 * 60 * 1000;

export type CurrentUser = {
  id: string;
  displayName: string;
  email: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_LENGTH_MS);

  await query(
    `INSERT INTO sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [hashToken(token), userId, expiresAt],
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const result = await query<{
    id: string;
    display_name: string;
    email: string;
  }>(
    `SELECT users.id, users.display_name, users.email
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = $1 AND sessions.expires_at > NOW()`,
    [hashToken(token)],
  );

  const user = result.rows[0];
  return user
    ? { id: user.id, displayName: user.display_name, email: user.email }
    : null;
});

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(token)]);
  }

  cookieStore.delete(SESSION_COOKIE);
}

