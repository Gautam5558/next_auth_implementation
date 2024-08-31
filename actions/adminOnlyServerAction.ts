"use server";

import { currentUser } from "@/lib/currentUser";
import { UserRole } from "@prisma/client";

export const adminOnlyServerAction = async () => {
  const user = await currentUser();
  // @ts-ignore
  if (user.role === UserRole.ADMIN) {
    return { success: true };
  } else {
    return { success: false };
  }
};
