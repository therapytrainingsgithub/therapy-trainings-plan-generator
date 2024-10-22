"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { signup } from "./action";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const result = await signup(formData);
    if (result?.error) {
      if (result.error.includes("Email not confirmed")) {
        router.push("/login?signup=success");
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    } else {
      // If no error and data is there, just redirect
      router.push("/login?signup=success");
      setLoading(false);
    }
  };

  return (
    <div
      className="h-[100vh] flex flex-col justify-center items-center p-4 overflow-y-null" // Prevent scrolling on mobile
    >
      {/* Add logo outside the box */}
      <Image
        src="/images/logo.png"
        alt="Therapy Trainings Logo"
        width={250}
        height={80}
        className="mb-8"
      />
      <h1 className="text-[#191919] text-[22px] sm:text-[28px] font-roboto font-bold mb-8 leading-none">
        Therapy Worksheet & Treatment Planner
      </h1>
      {/* The signup box */}
      <Card className="w-full max-w-sm p-4 flex-grow-0">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardFooter>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-4 items-center"
          >
            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email:
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                className="w-full"
                required
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password:
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                className="w-full"
                required
              />
            </div>
            <Button
              loading={loading}
              formAction={signup}
              className="bg-[#709D51] hover:bg-[#50822D] w-full text-white"
              disabled={loading} // Disable button while loading
            >
              Sign Up
            </Button>

            <Link href={"/login"}>
              <p className="mt-4 text-center text-sm text-blue-600">
                Already have an account? Log In.
              </p>
            </Link>

            {error && (
              <p className="mt-4 text-center text-sm text-red-600">{error}</p>
            )}
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
