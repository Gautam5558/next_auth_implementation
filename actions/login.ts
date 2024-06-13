"use server";

import { loginFormschema } from "@/schemas";
import { z } from "zod";

export const login = async ({
  values,
}: {
  values: z.infer<typeof loginFormschema>;
}) => {
  const validatedFeilds = loginFormschema.safeParse(values);

  if (!validatedFeilds.success) {
    return { error: "Invalid feilds" };
  }

  return { success: "Email sent!" };
};
