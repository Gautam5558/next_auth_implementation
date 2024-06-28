"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { getVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { loginFormschema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async ({
  values,
}: {
  values: z.infer<typeof loginFormschema>;
}) => {
  const validatedFeilds = loginFormschema.safeParse(values);

  if (!validatedFeilds.success) {
    return { error: "Invalid feilds", success: undefined };
  }

  const { email, password } = validatedFeilds.data;

  const existingUser = await db.user.findFirst({ where: { email } });

  // if user hasnt registered or user has previosly registered with github, google

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      success: undefined,
      error: "User isnt registered or registered with github or google",
    };
  }

  // if user has already registered but hasn't verified the email

  if (!existingUser.emailVerified) {
    const verificationToken = await getVerificationToken(existingUser.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent again!", error: undefined };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    console.log("hnji");
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin": {
          return { error: "Invalid credentails", success: undefined };
        }
        default: {
          return { error: "Something went wrong", success: undefined };
        }
      }
    }
    throw err;
  }

  return { success: "Email sent!", error: undefined };
};
