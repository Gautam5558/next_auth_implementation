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
import { registerFormschema } from "@/schemas";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import { useState } from "react";
import { register } from "@/actions/register";

const RegisterForm = () => {
  const form = useForm<z.infer<typeof registerFormschema>>({
    resolver: zodResolver(registerFormschema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  async function onSubmit(values: z.infer<typeof registerFormschema>) {
    console.log(values);
    setError("");
    setSuccess("");
    setIsLoading(true);
    const res = await register({ values });
    setIsLoading(false);
    setError(res.error);
    setSuccess(res.success);
  }

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Login if already registered?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="john doe"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <Button className="w-full" type="submit" disabled={isLoading}>
            Register
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
