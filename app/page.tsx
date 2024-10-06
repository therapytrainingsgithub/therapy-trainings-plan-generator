"use client";

import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Header from "@/components/header";
import TreatmentPlanGenerator from "@/components/treatmentPlanGenerator";
import { AppProvider } from "./context/appContext";
import Treatment from "./treatment/page";

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
        // Simulating a data fetch with a timeout
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
        {/* You can replace this spinner with a CSS framework-based spinner or a custom loader */}
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
      <Treatment />
    </>
  );
}
