import UserInfo from "@/components/UserInfo";
import { currentUser } from "@/lib/currentUser";
import React from "react";

const ServerPage = async () => {
  const user = await currentUser();

  return <UserInfo label="💻Server component" user={user} />;
};

export default ServerPage;
