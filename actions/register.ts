"use server";

import { db } from "@/lib/db";
import { registerFormschema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async ({
  values,
}: {
  values: z.infer<typeof registerFormschema>;
}) => {
  const validateFeilds = registerFormschema.safeParse(values);
  if (!validateFeilds.success) {
    return { error: "Invalid feilds" };
  }

  // now lets create our 1st user as client is generated

  const { name, email, password } = validateFeilds.data;

  const userExists = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists) {
    return { error: "User with this email already exists" };
  }

  // encrypting password to store in db
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  console.log("hnji");

  console.log(newUser);

  // TODO send verification email

  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Email sent" };
};
