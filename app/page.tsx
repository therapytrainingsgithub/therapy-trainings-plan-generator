"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Header from "@/components/header";
import TreatmentPlanGenerator from "@/components/treatmentPlanGenerator";
import { AppProvider } from "./context/appContext";

export default function Home() {
  return (
    <>
      <AppProvider>
        <ToastContainer />
        <HomeContent />
      </AppProvider>
    </>
  );
}

function HomeContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-5 px-10 space-y-10 bg-[#f5f5f5] font-roboto">
          <TreatmentPlanGenerator />
        </main>
      </div>
    </>
  );
}
