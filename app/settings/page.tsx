"use client";

import React from "react";
import { AppProvider } from "../context/appContext";
import { ToastContainer } from "react-toastify";
import ChangePasswordForm from "@/components/changePasswordForm";
import Header from "@/components/header";
import { useRouter } from "next/navigation";

function Settings() {
  return (
    <AppProvider>
      <ToastContainer />
      <SettingsContent />
    </AppProvider>
  );
}

function SettingsContent() {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/");
  };

  // No action for "Settings" button
  const handleSettingsClick = () => {
    // Do nothing
  };

  return (
    <>
      <div className="space-y-10">
        <Header />
        <div className="flex space-x-4 px-10">
          <button onClick={handleHomeClick} className="text-blue-600 underline">
            Home
          </button>
          <span>{">"}</span>
          <button onClick={handleSettingsClick} className="text-gray-600">
            Settings
          </button>
        </div>

        <div className="flex flex-col space-y-10 p-10">
          <div>
            <h1 className="font-bold text-2xl">Change Password</h1>
            <div className="bg-white p-10 rounded-md border shadow-lg flex flex-col justify-center space-y-4">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
