// a file used to generate tokens and make sure if a token exists remove it first
import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/passwordResetToken";
import crypto from "crypto";
import { getTwofactorTokenByEmail } from "@/data/twoFactorToken";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getTwofactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return twoFactorToken;
};

export const getVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 1 * 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({ where: { id: existingToken.id } });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
};

export const getPasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 1 * 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({ where: { id: existingToken.id } });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return passwordResetToken;
};
