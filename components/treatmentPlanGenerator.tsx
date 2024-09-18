import React from "react";
import Generator from "./generator";
import Summary from "./summary";
import Sheets from "./sheets";

const TreatmentPlanGenerator = () => {
  return (
    <>
      <main className="space-y-5 p-4">

        <h1 className="text-3xl font-bold text-center">
          Treatment Plan Generator
        </h1>

        <Generator />
        <Summary />
        <Sheets />
      </main>
    </>
  );
};

export default TreatmentPlanGenerator;
