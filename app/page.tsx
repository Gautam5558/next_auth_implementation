import LoginButton from "@/components/auth/LoginButton";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["600"] });

export default function HomePage() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-blue-600 ">
      <div className="space-y-6">
        <h1
          className={
            "text-6xl font-semibold text-white drop-shadow-md" +
            ` ${poppins.className}`
          }
        >
          🔐 Auth
        </h1>
        <p className="text-white text-lg">A simple authentication service</p>
        <div className="text-center">
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
