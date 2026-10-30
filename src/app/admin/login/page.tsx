
"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: "/admin",
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <Link href="/" className="admin-login-logo">
          YA<span>.</span>
        </Link>

        <p className="admin-login-eyebrow">PRIVATE ADMIN AREA</p>
        <h1>Welcome back.</h1>
        <p className="admin-login-description">
          Sign in to manage your portfolio and contact messages.
        </p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={254}
            disabled={loading}
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            maxLength={128}
            disabled={loading}
          />

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in securely"}
          </button>
        </form>

        <Link href="/" className="admin-login-back">
          ← Back to portfolio
        </Link>
      </div>
    </main>
  );
}
