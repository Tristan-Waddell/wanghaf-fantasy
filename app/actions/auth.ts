"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteCurrentSession } from "@/lib/auth";
import { query } from "@/lib/db";

export type AuthFormState = { error?: string };

const signupSchema = z.object({
  displayName: z.string().trim().min(2).max(40),
  email: z.email().trim().toLowerCase().max(254),
  password: z.string().min(8).max(128),
});

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a name, a valid email, and a password of at least 8 characters." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  try {
    const result = await query<{ id: string }>(
      `INSERT INTO users (display_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [parsed.data.displayName, parsed.data.email, passwordHash],
    );

    await createSession(result.rows[0].id);
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return { error: "An account with that email already exists." };
    }
    throw error;
  }

  redirect("/");
}

const loginSchema = z.object({
  email: z.email().trim().toLowerCase().max(254),
  password: z.string().min(1).max(128),
});

export async function login(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return { error: "Invalid email or password." };

  const result = await query<{ id: string; password_hash: string }>(
    `SELECT id, password_hash FROM users WHERE lower(email) = $1`,
    [parsed.data.email],
  );
  const account = result.rows[0];

  if (!account || !(await bcrypt.compare(parsed.data.password, account.password_hash))) {
    return { error: "Invalid email or password." };
  }

  await createSession(account.id);
  redirect("/");
}

export async function logout() {
  await deleteCurrentSession();
  redirect("/");
}

