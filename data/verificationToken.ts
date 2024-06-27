import { db } from "@/lib/db";

// Just some utility funxtion to make our code in the server actions much more cleaner, concise and small

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (err) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { token },
    });
    return verificationToken;
  } catch (err) {
    return null;
  }
};
