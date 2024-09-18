"use client";
import React, { useState } from "react";
import { login } from "./action";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <main className="relative py-5 px-10 space-y-10 bg-[#f5f5f5] h-screen flex justify-center items-center">
      <div className="bg-white p-10 rounded-md border shadow-lg w-full">
        {/* header */}
        <div className="flex justify-center">
          <img src="./images/logo.png" alt="logo" />
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

                <div className="w-full">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-white bg-[#709d50] hover:bg-[#50822d] w-full"
                  >
                    Submit
                  </button>
                </div>
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
