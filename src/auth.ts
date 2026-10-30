
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginLimiter, getClientIp } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },

  pages: {
    signIn: "/admin/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Admin email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials, request) {
        // 1. Apply login rate limit before checking credentials
        if (!loginLimiter) {
          console.error("Admin login rate limiter is unavailable.");
          return null;
        }

        try {
          const ip = getClientIp(request);
          const result = await loginLimiter.limit(`admin-login:${ip}`);

          if (!result.success) {
            console.warn("Admin login rate limit exceeded.");
            return null;
          }
        } catch (error) {
          console.error("Admin login rate limiter failed:", error);
          return null;
        }

        // 2. Validate configured admin credentials
        const adminEmail = process.env.ADMIN_EMAIL;
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;

        if (
          !adminEmail ||
          !passwordHash ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        // 3. Verify email
        const email = credentials.email.trim().toLowerCase();
        const normalizedAdminEmail = adminEmail.trim().toLowerCase();

        if (email !== normalizedAdminEmail) {
          return null;
        }

        // 4. Verify password
        const passwordMatches = await bcrypt.compare(
          credentials.password,
          passwordHash
        );

        if (!passwordMatches) {
          return null;
        }

        // 5. Return authenticated admin
        return {
          id: "ya-admin",
          name: "YA Admin",
          email: normalizedAdminEmail,
        };
      },
    }),
  ],
});
