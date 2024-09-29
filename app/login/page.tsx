"use client";
import React, { useState, useEffect } from "react";
import { login } from "./action";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing eye icons
import { toast, ToastContainer } from "react-toastify"; // Importing toast
import "react-toastify/dist/ReactToastify.css"; // Importing CSS for toast notifications

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result) {
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session) {
          setIsLoggedIn(true);
        } else {
          throw new Error("Session not established after login");
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative py-5 px-10 space-y-10 bg-[#f5f5f5] h-screen flex justify-center items-center">
      <ToastContainer /> {/* Add ToastContainer to the component */}
      <div className="bg-white p-10 rounded-md border shadow-lg w-full">
        <div className="flex justify-center">
          <img
            src="https://earnextramiles.s3.ap-south-1.amazonaws.com/uat/logo_1726732771800.png"
            alt="logo"
          />
        </div>

        <div className="relative py-8 px-5 rounded-xl flex flex-col items-center space-y-10">
          <div className="relative z-10">
            <h1 className="font-bold text-3xl mb-5">
              Treatment Plan Generator
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

                <div className="flex flex-col space-y-1 w-full relative">
                  <label htmlFor="password">Password</label>
                  <input
                    className="rounded-md px-5 py-2 border-2 w-full"
                    placeholder="****************"
                    type={showPassword ? "text" : "password"} // Toggle password visibility
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                    className="absolute right-3 top-10 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                    {/* Toggle icon */}
                  </button>
                </div>

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

        <div className="flex flex-start">
          <div>©Copyright Therapy Trainings™</div>
        </div>
      </div>
    </main>
  );
};

export default Page;
