"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  login,
  signup,
  type AuthFormState,
} from "@/app/actions/auth";

const initialState: AuthFormState = {};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, formAction, pending] = useActionState(
    mode === "signup" ? signup : login,
    initialState,
  );
  const isSignup = mode === "signup";

  return (
    <form className="auth-form" action={formAction}>
      {isSignup && (
        <label>
          Display name
          <input
            name="displayName"
            type="text"
            minLength={2}
            maxLength={40}
            autoComplete="name"
            placeholder="Your league name"
            required
          />
        </label>
      )}

      <label>
        Email address
        <input
          name="email"
          type="email"
          maxLength={254}
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          minLength={isSignup ? 8 : 1}
          maxLength={128}
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder={isSignup ? "At least 8 characters" : "Your password"}
          required
        />
      </label>

      {state.error && <p className="form-message error" role="alert">{state.error}</p>}

      <button className="primary-button full-button" disabled={pending} type="submit">
        {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
      </button>

      <p className="auth-switch">
        {isSignup ? "Already in the league?" : "New to WANGHAF?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}

