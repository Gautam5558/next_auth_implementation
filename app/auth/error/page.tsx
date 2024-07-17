import ErrorCard from "@/components/auth/ErrorCard";
import React from "react";

// We will get redirected to this page if there was a network issue or some error during auth
// with google or github that is social auth not with credentials

const AuthErrorPage = () => {
  return <ErrorCard />;
};

export default AuthErrorPage;
