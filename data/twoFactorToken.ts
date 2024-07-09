import { db } from "@/lib/db";

export const getTwofactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twoFactorToken;
  } catch (err) {
    return null;
  }
};

export const getTwofactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email: email },
    });
    return twoFactorToken;
  } catch (err) {
    return null;
  }
};
