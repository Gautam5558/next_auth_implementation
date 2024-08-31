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
import { getTwofactorConfirmationByUserId } from "./data/twoFactorConfirmation";

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

      // prevent login if 2FA enabled
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwofactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        // delete two factor confirmation for next signin (This behaviour is optional => You can either 2FA each time user logs in or only for the 1st time, here i am implementing it for every login hence i am deleting my @FA confirmation after login)
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
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

      if (session.user) {
        // To Do : Resolve typescript issue
        // @ts-ignore
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
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
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
