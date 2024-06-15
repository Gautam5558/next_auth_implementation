"use server";

import { signIn } from "@/auth";
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

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
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
