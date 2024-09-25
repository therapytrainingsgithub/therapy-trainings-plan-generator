import React, { useState, useEffect } from "react";
import { useAppContext } from "../app/context/appContext";

interface Goal {
  goal: string;
  objectives: string[];
}

interface Disorder {
  id: string;
  name: string;
  symptoms: string[];
}

const disorders: Disorder[] = [
  // Schizophrenia Spectrum and Other Primary Psychotic Disorders
  {
    id: "F20.0",
    name: "Schizophrenia",
    symptoms: [
      "Delusions",
      "Hallucinations",
      "Disorganized speech",
      "Negative symptoms",
    ],
  },
  {
    id: "F21.0",
    name: "Schizotypal disorder",
    symptoms: [
      "Odd beliefs or magical thinking",
      "Unusual perceptual experiences",
      "Suspiciousness",
      "Inappropriate or constricted affect",
    ],
  },
  {
    id: "F22.0",
    name: "Persistent delusional disorders",
    symptoms: [
      "Delusions that persist for at least one month",
      "No hallucinations or disorganized speech",
    ],
  },
  {
    id: "F23.0",
    name: "Acute and transient psychotic disorders",
    symptoms: [
      "Sudden onset of psychotic symptoms",
      "Delusions",
      "Hallucinations",
      "Disorganized behavior",
    ],
  },
  {
    id: "F24.0",
    name: "Induced delusional disorder",
    symptoms: [
      "Delusions induced by another person",
      "Symptoms resolve when the influencing factor is removed",
    ],
  },
  {
    id: "F25.0",
    name: "Schizoaffective disorders",
    symptoms: [
      "Symptoms of schizophrenia",
      "Mood disorder episodes (mania or depression)",
    ],
  },
  {
    id: "F28.0",
    name: "Other nonorganic psychotic disorders",
    symptoms: [
      "Psychotic symptoms not covered by other categories",
      "Includes various symptoms based on specific disorder",
    ],
  },
  {
    id: "F29.0",
    name: "Unspecified nonorganic psychosis",
    symptoms: [
      "Psychotic symptoms not specified elsewhere",
      "General psychotic symptoms",
    ],
  },

  // Mood Disorders
  {
    id: "F30.0",
    name: "Manic episode",
    symptoms: [
      "Elevated mood",
      "Increased activity",
      "Grandiosity",
      "Decreased need for sleep",
      "Talkativeness",
      "Racing thoughts",
      "Impulsivity",
    ],
  },
  {
    id: "F31.0",
    name: "Bipolar affective disorder",
    symptoms: [
      "Manic episodes",
      "Depressive episodes",
      "Mood swings between mania and depression",
    ],
  },
  {
    id: "F32.0",
    name: "Major depressive disorder, single episode",
    symptoms: [
      "Depressed mood",
      "Loss of interest or pleasure",
      "Significant weight change",
      "Sleep disturbances",
      "Fatigue",
      "Feelings of worthlessness",
    ],
  },
  {
    id: "F33.0",
    name: "Recurrent depressive disorder",
    symptoms: [
      "Multiple episodes of major depression",
      "Similar symptoms to single episode but recurrent",
    ],
  },
  {
    id: "F34.0",
    name: "Persistent mood [affective] disorders",
    symptoms: [
      "Chronic mood disturbances",
      "Depressive or manic symptoms lasting for extended periods",
    ],
  },

  // Anxiety Disorders
  {
    id: "F40.0",
    name: "Phobic anxiety disorders",
    symptoms: [
      "Intense fear of specific objects or situations",
      "Avoidance behavior",
      "Panic attacks when exposed to the phobic stimulus",
    ],
  },
  {
    id: "F41.0",
    name: "Other anxiety disorders",
    symptoms: [
      "Generalized anxiety",
      "Excessive worry",
      "Restlessness",
      "Muscle tension",
      "Sleep disturbances",
    ],
  },
  {
    id: "F43.0",
    name: "Reaction to severe stress and adjustment disorders",
    symptoms: [
      "Stress-related symptoms",
      "Adjustment difficulties",
      "Emotional disturbances following stress",
    ],
  },

  // Obsessive-Compulsive and Related Disorders
  {
    id: "F42.0",
    name: "Obsessive-compulsive disorder",
    symptoms: [
      "Obsessions (persistent, unwanted thoughts)",
      "Compulsions (repetitive behaviors performed to reduce anxiety)",
    ],
  },

  // Trauma and Stressor-Related Disorders
  {
    id: "F43.1",
    name: "Acute stress reaction",
    symptoms: [
      "Immediate stress response",
      "Confusion",
      "Disorientation",
      "Difficulty sleeping",
    ],
  },
  {
    id: "F43.2",
    name: "Post-traumatic stress disorder",
    symptoms: [
      "Re-experiencing the trauma",
      "Avoidance of reminders",
      "Hyperarousal (e.g., irritability, hypervigilance)",
    ],
  },
  {
    id: "F43.3",
    name: "Adjustment disorders",
    symptoms: [
      "Emotional or behavioral symptoms in response to identifiable stressors",
      "Symptoms appear within three months of the stressor",
    ],
  },

  // Eating Disorders
  {
    id: "F50.0",
    name: "Anorexia nervosa",
    symptoms: [
      "Severe restriction of food intake",
      "Intense fear of gaining weight",
      "Distorted body image",
    ],
  },
  {
    id: "F50.1",
    name: "Bulimia nervosa",
    symptoms: [
      "Binge eating",
      "Compensatory behaviors (e.g., vomiting, excessive exercise)",
      "Preoccupation with weight and body shape",
    ],
  },
  {
    id: "F50.2",
    name: "Binge eating disorder",
    symptoms: [
      "Frequent episodes of eating large amounts of food",
      "Feelings of loss of control during binge episodes",
    ],
  },
  {
    id: "F50.8",
    name: "Other eating disorders",
    symptoms: ["Various symptoms specific to less common eating disorders"],
  },

  // Neurodevelopmental Disorders
  {
    id: "F80.0",
    name: "Specific developmental disorders of speech and language",
    symptoms: [
      "Speech and language difficulties",
      "Delayed language acquisition",
      "Communication problems",
    ],
  },
  {
    id: "F81.0",
    name: "Specific developmental disorders of scholastic skills",
    symptoms: [
      "Difficulty with reading, writing, or arithmetic",
      "Academic performance issues",
    ],
  },
  {
    id: "F82.0",
    name: "Specific developmental disorder of motor function",
    symptoms: [
      "Motor coordination difficulties",
      "Clumsiness",
      "Difficulty with fine and gross motor skills",
    ],
  },
  {
    id: "F84.0",
    name: "Pervasive developmental disorders",
    symptoms: [
      "Autism spectrum disorders",
      "Impaired social interaction",
      "Communication difficulties",
      "Restricted, repetitive behaviors",
    ],
  },

  // Personality Disorders
  {
    id: "F60.0",
    name: "Paranoid personality disorder",
    symptoms: [
      "Distrust and suspicion",
      "Belief that others are exploiting or deceiving",
      "Suspiciousness",
    ],
  },
  {
    id: "F60.1",
    name: "Schizoid personality disorder",
    symptoms: [
      "Detachment from social relationships",
      "Limited range of emotions",
      "Indifference to praise or criticism",
    ],
  },
  {
    id: "F60.2",
    name: "Dissocial personality disorder",
    symptoms: [
      "Disregard for others' rights",
      "Deceitfulness",
      "Impulsivity",
      "Irritability",
    ],
  },
  {
    id: "F60.3",
    name: "Borderline personality disorder",
    symptoms: [
      "Instability in relationships",
      "Self-image",
      "Emotions",
      "Impulsivity",
    ],
  },
  {
    id: "F60.4",
    name: "Histrionic personality disorder",
    symptoms: [
      "Excessive emotionality",
      "Attention-seeking behavior",
      "Dramatic or theatrical behavior",
    ],
  },
  {
    id: "F60.5",
    name: "Anankastic personality disorder",
    symptoms: [
      "Preoccupation with orderliness",
      "Perfectionism",
      "Control",
      "Rigidity",
    ],
  },
  {
    id: "F60.6",
    name: "Avoidant personality disorder",
    symptoms: [
      "Hypersensitivity to criticism",
      "Feelings of inadequacy",
      "Social inhibition",
    ],
  },
  {
    id: "F60.7",
    name: "Dependent personality disorder",
    symptoms: [
      "Excessive need to be taken care of",
      "Submissive behavior",
      "Difficulty making decisions",
    ],
  },
  {
    id: "F60.8",
    name: "Other personality disorders",
    symptoms: [
      "Various symptoms specific to less common personality disorders",
    ],
  },
];

const treatmentApproaches: string[] = [
  "Cognitive Behavioral Therapy (CBT)",
  "Interpersonal Therapy (IPT)",
  "Medication management",
];

const Generator: React.FC = () => {
  const [goalLoading, setGoalLoading] = useState<boolean>(false);
  const [objectiveLoading, setObjectiveLoading] = useState<boolean>(false);
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
    if (selectedDisorder) {
      const disorder = disorders.find((d) => d.name === selectedDisorder);
      if (disorder) {
        setSymptoms(disorder.symptoms);
        setSelectedSymptoms([]); // Clear previously selected symptoms
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
