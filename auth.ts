/*import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
});
*/

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    /* async signIn({ user }) {
      const existingUser = await db.user.findUnique({ where: { id: user.id } });
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }

      return true;
    },
    */

    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") {
        return true;
      }
      const existingUser = await db.user.findUnique({ where: { id: user.id } });

      // prevent login without email verification
      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        // To Do : Resolve typescript issue
        // @ts-ignore
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await db.user.findUnique({
        where: { id: token.sub },
      });
      if (!existingUser) {
        return token;
      }

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
