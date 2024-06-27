// a file used to generate tokens and make sure if a token exists remove it first
import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";

export const getVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + 1 * 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({ where: { id: existingToken.id } });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
};
