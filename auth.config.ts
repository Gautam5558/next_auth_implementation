import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { loginFormschema } from "./schemas";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFeilds = loginFormschema.safeParse(credentials);
        if (validatedFeilds.success) {
          const { email, password } = validatedFeilds.data;

          const user = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatchesOrNot = await bcrypt.compare(
            password,
            user.password
          );
          if (passwordMatchesOrNot) {
            const userData = {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            } as any;

            return userData;
          }
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
