import { auth, signOut } from "@/auth";
import React from "react";

const Settings = async () => {
  const session = await auth();

  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
};

export default Settings;
