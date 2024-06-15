import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { loginFormschema } from "./schemas";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

export default {
  providers: [
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
