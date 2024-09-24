"use client";
import React, { useState, useEffect } from "react";
import { login } from "./action";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If login is successful and isLoggedIn is set, push to "/"
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null); // Reset error message on new attempt

    try {
      // Wait for the login function to complete
      const result = await login(email, password);

      if (result) {
        // Explicitly wait for the session to be established
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session) {
          setIsLoggedIn(true); // Set isLoggedIn state to true
        } else {
          throw new Error("Session not established after login");
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative py-5 px-10 space-y-10 bg-[#f5f5f5] h-screen flex justify-center items-center">
      <div className="bg-white p-10 rounded-md border shadow-lg w-full">
        {/* header */}
        <div className="flex justify-center">
          <img
            src="https://earnextramiles.s3.ap-south-1.amazonaws.com/uat/logo_1726732771800.png"
            alt="logo"
          />
        </div>

        {/* form */}
        <div className="relative py-8 px-5 rounded-xl flex flex-col items-center space-y-10">
          {/* Content */}
          <div className="relative z-10">
            <h1 className="font-bold text-3xl mb-5">
              Clinical Supervision Tracker
            </h1>
            <div className="w-full">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center space-y-6"
              >
                <div className="flex flex-col space-y-1 w-full">
                  <label htmlFor="email">Email</label>
                  <input
                    className="rounded-md px-5 py-2 border-2"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="username@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1 w-full">
                  <label htmlFor="password">Password</label>
                  <input
                    className="rounded-md px-5 py-2 border-2"
                    placeholder="****************"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="text-red-500 text-sm">{errorMessage}</div>
                )}

                {/* Loading Spinner */}
                {loading ? (
                  <div className="flex justify-center items-center">
                    <div
                      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-black motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] w-full"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex flex-start">
          <div>©Copyright Therapy Trainings™</div>
        </div>
      </div>
    </main>
  );
};

export default Page;
