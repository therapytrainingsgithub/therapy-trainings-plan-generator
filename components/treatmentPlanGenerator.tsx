import React from "react";
import Generator from "./generator";
import Summary from "./summary";
import Sheets from "./sheets";

const TreatmentPlanGenerator = () => {
  return (
    <>
      <main className="space-y-5 p-4">
        <Generator />
        <Summary />
        <Sheets />
      </main>
    </>
  );
};

export default TreatmentPlanGenerator;
