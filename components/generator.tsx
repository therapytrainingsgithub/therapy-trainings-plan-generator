import React, { useState, useEffect } from "react";
import { useAppContext } from "../app/context/appContext";

interface Goal {
  goal: string;
  objectives: string[];
}

interface Disorder {
  id: string;
  name: string;
  symptoms: any;
}

const treatmentApproaches: string[] = [
  "Cognitive Behavioral Therapy (CBT)",
  "Interpersonal Therapy (IPT)",
  "Medication management",
];

const Generator: React.FC = () => {
  const [goalLoading, setGoalLoading] = useState<boolean>(false);
  const [objectiveLoading, setObjectiveLoading] = useState<boolean>(false);
  const [disorders, setDisorders] = useState<Disorder[]>([])
  const {
    selectedDisorder,
    setSelectedDisorder,
    selectedSymptoms,
    setSelectedSymptoms,
    selectedApproach,
    setSelectedApproach,
    selectedGoals,
    setSelectedGoals,
    selectedObjectives,
    setSelectedObjectives,
    allObjectives,
    setAllObjectives,
    setShowSummary,
    setShowSheets,
  } = useAppContext();

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchDisorders = async () => {
      try {
        const response = await fetch('api/getDisorder');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        setDisorders(data)
      } catch (error) {
        console.log(error)
      }
    };

    fetchDisorders();
  }, []);

  useEffect(() => {
    if (selectedDisorder) {
      const disorder = disorders.find((d) => d.name === selectedDisorder);
      if (disorder) {
        console.log(disorder)
        const fetchedSymptoms = disorder.symptoms[0]
        setSymptoms(fetchedSymptoms);
        setSelectedSymptoms([]);
      }
    } else {
      setSymptoms([]);
      setSelectedSymptoms([]);
    }
  }, [selectedDisorder, setSelectedSymptoms]);

  useEffect(() => {
    if (selectedApproach) {
      generateGoalsObjectives();
    }
  }, [selectedApproach, selectedDisorder]); // Added selectedDisorder as dependency

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prevSymptoms) =>
      prevSymptoms.includes(symptom)
        ? prevSymptoms.filter((s) => s !== symptom)
        : [...prevSymptoms, symptom]
    );
  };

  const handleApproachSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const approach = event.target.value;
    setSelectedApproach(approach);
    setAllObjectives([]);
    setSelectedObjectives([]);
  };

  const handleGoalSelect = (goal: Goal) => {
    setSelectedGoals((prev) => {
      const updatedGoals = prev.includes(goal.goal)
        ? prev.filter((g) => g !== goal.goal)
        : [...prev, goal.goal];

      const newObjectives = updatedGoals.flatMap(
        (g) => goals.find((gObj) => gObj.goal === g)?.objectives || []
      );
      setAllObjectives(newObjectives);

      setSelectedObjectives((prev) =>
        prev.filter((o) => newObjectives.includes(o))
      );

      return updatedGoals;
    });
  };

  const handleObjectiveSelect = (objective: string) => {
    setSelectedObjectives((prev) =>
      prev.includes(objective)
        ? prev.filter((o) => o !== objective)
        : [...prev, objective]
    );
    setShowSummary(true);
    setShowSheets(true);
  };

  useEffect(() => {
    if (selectedObjectives.length === 0 || selectedGoals.length === 0) {
      setShowSheets(false);
    }
  }, [selectedObjectives, selectedGoals]);

  const generateGoalsObjectives = async () => {
    try {
      setGoalLoading(true);
      const response = await fetch("/api/postDisorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disorder: selectedDisorder,
          symptoms: selectedSymptoms,
          treatment_approach: selectedApproach,
        }),
      });

      if (response.ok) {
        const responseText = await response.json();
        const data = formatResponse(responseText.completion);
        setGoals(data.goals);
      } else {
        console.error("Network response was not ok:", response.statusText);
      }
    } catch (error) {
      console.error("Error in generateGoalsObjectives:", error);
    } finally {
      setGoalLoading(false);
    }
  };

  function formatResponse(responseText: string): { goals: Goal[] } {
    const start = responseText.indexOf("{");
    const end = responseText.lastIndexOf("}") + 1;

    if (start === -1 || end === -1) {
      throw new Error("No JSON data found in the response");
    }

    const jsonString = responseText.substring(start, end);

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error("Error parsing JSON data");
    }
  }

  const refreshObjectives = async () => {
    try {
      setObjectiveLoading(true);
      setAllObjectives([]);

      // Send request to fetch new goals and objectives
      const response = await fetch("/api/postDisorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disorder: selectedDisorder,
          symptoms: selectedSymptoms,
          treatment_approach: selectedApproach,
          existing_Goals_Objectives: goals,
        }),
      });

      if (response.ok) {
        const responseText = await response.json();
        const data = formatResponse(responseText.completion);
        setGoals(data.goals);

        const filteredGoals = data.goals.filter((goal) =>
          selectedGoals.includes(goal.goal)
        );

        if (filteredGoals.length > 0) {
          const objectives = filteredGoals
            .map((goal) => goal.objectives)
            .flat();
          console.log("objectives", objectives);
          setAllObjectives(objectives);
        } else {
          console.log("No matching filtered goals found.");
          setAllObjectives([]);
        }
      } else {
        console.error("Network response was not ok:", response.statusText);
      }
    } catch (error) {
      console.error("Error in refreshObjectives:", error);
    } finally {
      setObjectiveLoading(false);
      console.log(allObjectives, selectedObjectives);
    }
  };

  return (
    <main className="space-y-5 flex justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-[70%]">
        <div className="mb-4 flex flex-col space-y-1">
          <label className="font-bold">Disorders</label>
          <select
            onChange={(e) => setSelectedDisorder(e.target.value)}
            className="w-full md:w-[50%] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
            value={selectedDisorder || ""}
          >
            <option value="" disabled>
              Select a disorder
            </option>
            {disorders.map((disorder) => (
              <option key={disorder.id} value={disorder.name}>
                {disorder.name}
              </option>
            ))}
          </select>
        </div>

        {selectedDisorder && symptoms.length > 0 && (
          <div className="mb-4 space-y-1">
            <div className="flex space-x-4">
              <h3 className="font-bold">Symptoms</h3>
              {selectedSymptoms.length === 0 && (
                <h3 className="font-semibold text-red-500 text-sm">
                  Please Select Symptoms
                </h3>
              )}
            </div>
            {symptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSymptomToggle(symptom)}
                className={`mr-2 mb-2 p-2 border rounded-md transition-colors duration-200 ${
                  selectedSymptoms.includes(symptom)
                    ? "bg-[#709d50] text-white hover:bg-[#50822d]"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        )}

        {selectedSymptoms.length > 0 && (
          <div className="mb-4 flex flex-col space-y-1">
            <label className="font-bold">Treatment Approaches</label>
            <select
              onChange={handleApproachSelect}
              className="w-[50%] p-2 border rounded"
              value={selectedApproach || ""}
            >
              <option value="">Select an approach</option>
              {treatmentApproaches.map((approach) => (
                <option key={approach} value={approach}>
                  {approach}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedApproach && (
          <div className="mb-4 space-y-1">
            <div className="flex space-x-4">
              <h3 className="font-bold">Goals</h3>
              {goalLoading === false && selectedGoals.length === 0 && (
                <h3 className="font-semibold text-red-500 text-sm">
                  Please Select Goals
                </h3>
              )}
            </div>
            {goalLoading ? (
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
              goals.map((goalObj) => (
                <button
                  key={goalObj.goal}
                  onClick={() => handleGoalSelect(goalObj)}
                  className={`mr-2 mb-2 p-2 border rounded-md transition-colors duration-200 ${
                    selectedGoals.includes(goalObj.goal)
                      ? "bg-[#709d50] text-white hover:bg-[#50822d]"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {goalObj.goal}
                </button>
              ))
            )}
          </div>
        )}

        {selectedGoals.length > 0 && (
          <div className="mb-4 space-y-1">
            <div className="flex space-x-4 items-center">
              <h3 className="font-bold">Objectives</h3>
              {objectiveLoading === false &&
                selectedObjectives.length === 0 && (
                  <h3 className="font-semibold text-red-500 text-sm">
                    Please Select Objectives
                  </h3>
                )}
            </div>
            {objectiveLoading ? (
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
              allObjectives.length > 0 && (
                <div>
                  {allObjectives.map((objective) => (
                    <button
                      key={objective}
                      onClick={() => handleObjectiveSelect(objective)}
                      className={`mr-2 mb-2 p-2 border rounded-md transition-colors duration-200 ${
                        selectedObjectives.includes(objective)
                          ? "bg-[#709d50] text-white hover:bg-[#50822d]"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {objective}
                    </button>
                  ))}
                </div>
              )
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => refreshObjectives()}
                className="p-2 bg-[#709d50] text-white rounded-md hover:bg-[#50822d] transition-colors duration-200"
              >
                Refresh Objectives
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Generator;
