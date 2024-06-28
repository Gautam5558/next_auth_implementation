"use server";

import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getPasswordResetToken } from "@/lib/tokens";
import { ResetFormschema } from "@/schemas";
import { z } from "zod";

export const resetPassword = async (
  values: z.infer<typeof ResetFormschema>
) => {
  const validateFields = ResetFormschema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Email", success: undefined };
  }

  const { email } = validateFields.data;

  const existingUser = await db.user.findUnique({ where: { email } });

  if (!existingUser) {
    return { error: "Email doesn't exist", success: undefined };
  }

  // To do => send user an email to reset password
  const passwordResetToken = await getPasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset Password Email Sent!", error: undefined };
};
