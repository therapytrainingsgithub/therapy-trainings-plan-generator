"use client";

import React from "react";
import Header from "@/components/header";
import TreatmentPlanGenerator from "@/components/treatmentPlanGenerator";
import { AppProvider } from "../context/appContext";

const Treatment = () => {
  return (
    <AppProvider>
        <TreatmentContent />
    </AppProvider>
  );
};

const TreatmentContent = () => {
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
};

export default Treatment;
