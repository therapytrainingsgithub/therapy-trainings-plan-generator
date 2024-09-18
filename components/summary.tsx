import React from "react";
import { useAppContext } from "@/app/context/appContext";

const Summary = () => {
  const {
    selectedDisorder,
    selectedSymptoms,
    selectedApproach,
    selectedGoals,
    selectedObjectives,
  } = useAppContext();
  return (
    <>
    <main className="flex justify-center">
              {/* Treatment Plan Summary */}
      {selectedObjectives.length > 0 && (
        <div className="bg-white p-6 rounded-md shadow-lg w-[70%]">
          <h3 className="text-xl font-bold mb-4">Treatment Plan Summary</h3>
          <div className="mb-4">
            <h6 className="font-semibold text-gray-700">Disorder:</h6>
            <p className="text-gray-800">{selectedDisorder}</p>
          </div>
          <div className="mb-4">
            <h6 className="font-semibold text-gray-700">Symptoms:</h6>
            <p className="text-gray-800">{selectedSymptoms}</p>
          </div>
          <div className="mb-4">
            <h6 className="font-semibold text-gray-700">Treatment Approach:</h6>
            <p className="text-gray-800">{selectedApproach || "None"}</p>
          </div>
          <div className="mb-4">
            <h6 className="font-semibold text-gray-700">Goals:</h6>
            <p className="text-gray-800">
              {selectedGoals.length > 0 ? selectedGoals.join(", ") : "None"}
            </p>
          </div>
          <div>
            <h6 className="font-semibold text-gray-700">Objectives:</h6>
            <p className="text-gray-800">
              {selectedObjectives.length > 0
                ? selectedObjectives.join(", ")
                : "None"}
            </p>
          </div>
        </div>
      )}
    </main>
    </>
  );
};

export default Summary;
