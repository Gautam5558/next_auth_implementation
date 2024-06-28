"use server";

import { z } from "zod";
import { newPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/passwordResetToken";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const newPassword = async (
  values: z.infer<typeof newPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "Token doesnt exist", success: undefined };
  }

  const validateFeilds = newPasswordSchema.safeParse(values);
  if (!validateFeilds.success) {
    return { error: "Invalid feilds", success: undefined };
  }

  const { password } = validateFeilds.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid Token", success: undefined };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired", success: undefined };
  }

  const existingUser = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return { error: "User doesn't exist", success: undefined };
  }

  // encrypting password to store in db
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // Deleting the entry from resetPasswordToken model as we only required it for the verification
  // Now we no longer nedd it so we delete it to make our db clean , concise, maintained.
  await db.passwordResetToken.delete({ where: { token } });

  return { success: "Password updated", error: undefined };
};
