"use client";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginFormschema } from "@/schemas";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import { login } from "@/actions/login";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormschema>>({
    resolver: zodResolver(loginFormschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  // This state is used to show 2FA UI if it is enabled when we try to login using credentials
  // As 2FA is only for credentials , Google , Github is already 2FA intrinsically
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const errorMessage =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with a different provider!"
      : "";

  async function onSubmit(values: z.infer<typeof loginFormschema>) {
    setError(undefined);
    setSuccess(undefined);
    setIsLoading(true);
    const res = await login({ values });
    setIsLoading(false);
    setError(res?.error);
    setSuccess(res?.success);
    console.log(res);
    if (res?.twoFactor) {
      setShowTwoFactor(true);
    }
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="12345"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="johndoe@example.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="******"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <Button className="px-0 font-normal" variant="link">
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {(error || errorMessage.length > 0) && (
            <FormError message={error || errorMessage} />
          )}
          {success && <FormSuccess message={success} />}
          <Button className="w-full" type="submit" disabled={isLoading}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
