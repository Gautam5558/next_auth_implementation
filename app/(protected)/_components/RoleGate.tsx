"use client";
import FormError from "@/components/FormError";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import { UserRole } from "@prisma/client";
import React from "react";

const RoleGate = ({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole: UserRole;
}) => {
  const user = useCurrentUser();
  // @ts-ignore
  if (user?.role !== allowedRole) {
    return <FormError message="You are not allowed to view this content" />;
  }

  return <>{children}</>;
};

export default RoleGate;
