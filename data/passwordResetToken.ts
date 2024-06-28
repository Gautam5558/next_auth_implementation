import { db } from "@/lib/db";

// Just some utility funxtion to make our code in the server actions much more cleaner, concise and small

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });
    return passwordResetToken;
  } catch (err) {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { token },
    });
    return passwordResetToken;
  } catch (err) {
    return null;
  }
};
