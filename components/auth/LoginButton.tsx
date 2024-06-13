"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const navigate = useRouter();

  if (mode === "modal") {
    return <span>TODO:Implement Modal</span>;
  }

  const handleClick = () => {
    navigate.push("/auth/login");
  };

  return (
    <span
      onClick={() => {
        handleClick();
      }}
      className="cursor-pointer"
    >
      {children}
    </span>
  );
};

export default LoginButton;
