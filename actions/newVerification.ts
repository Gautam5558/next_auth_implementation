"use server";

import { getVerificationTokenByToken } from "@/data/verificationToken";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token doesn't exist", success: null };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired", success: null };
  }

  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return { error: "Email does not exist", success: null };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({ where: { id: existingToken.id } });
  return { success: "Email verified", error: null };
};
