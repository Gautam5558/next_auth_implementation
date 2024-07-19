"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import React from "react";

const ClientPage = () => {
  const user = useCurrentUser();

  return <div>ClientPage</div>;
};

export default ClientPage;
