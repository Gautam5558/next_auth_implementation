"use client";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import React from "react";

// Settings page in case when page.tsx is a client component => we will logout and get currently
// logged in user's data in the following way as menthtioned in the code below and layout.tsx

// Another way to logout when page.tsx / settings page is a client component

const Settings = () => {
  const user = useCurrentUser();

  const handleClick = async () => {
    await logout();
  };

  return (
    <div className="bg-white p-10 rounded-xl">
      <button
        type="submit"
        onClick={() => {
          handleClick();
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Settings;
