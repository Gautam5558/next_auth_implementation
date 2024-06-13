import { registerFormschema } from "@/schemas";
import { z } from "zod";

export const register = async ({
  values,
}: {
  values: z.infer<typeof registerFormschema>;
}) => {
  const validateFeilds = registerFormschema.safeParse(values);
  if (!validateFeilds.success) {
    return { error: "Invalid feilds" };
  }

  return { success: "Email sent" };
};
