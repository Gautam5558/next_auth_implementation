import { auth } from "@/auth";
import { currentUser } from "@/lib/currentUser";
import React from "react";

const ServerPage = async () => {
  const user = await currentUser();

  return <div></div>;
};

export default ServerPage;
