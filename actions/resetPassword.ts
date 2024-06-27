"use server";

import { db } from "@/lib/db";
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

  return { success: "Reset Password Email Sent!", error: undefined };
};
