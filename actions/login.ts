"use server";

import { signIn } from "@/auth";
import { getTwofactorConfirmationByUserId } from "@/data/twoFactorConfirmation";
import { getTwofactorTokenByEmail } from "@/data/twoFactorToken";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken, getVerificationToken } from "@/lib/tokens";
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

  const { email, password, code } = validatedFeilds.data;

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

  // logic for 2FA
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // Logic if 2FA code is inputed and not credentials are inputed
      const twoFactorToken = await getTwofactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Invalid Token!", success: undefined };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid Token!", success: undefined };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Token Expired!", success: undefined };
      }

      // As token is verified so its work of verification is done hence we will delete it
      // So that db remains concise , clear and doesnt contain unnecessary entries of data

      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

      // Now we will check if the user already logged in before using 2FA, so there would be
      // a entry in 2 factor confirmation table corresponding to the user which we dont need
      // as we want user to again login using 2 FA as we have enabled it fore every login of user
      // So if exists we will delete old one and create new one , even if it doesnt we will create
      // a new one for 2FA confirmation

      const existingConfirmation = await getTwofactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true, success: undefined, error: undefined };
    }
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
