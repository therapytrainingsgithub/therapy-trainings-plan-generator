import React, { useState } from "react";
import { useAppContext } from "@/app/context/appContext";

const Sheets = () => {
  const [worksheetLoading, setWorksheetLoading] = useState(false);
  const [homeworkLoading, setHomeworkLoading] = useState(false);
  const [worksheetIdeas, setWorksheetIdeas] = useState<string[]>([]);
  const [selectedWorksheet, setSelectedWorksheet] = useState<string | null>(
    null
  );
  const [generatedWorksheet, setGeneratedWorksheet] = useState<string>("");
  const [homeworkIdeas, setHomeworkIdeas] = useState<string[]>([]);
  const {
    selectedDisorder,
    selectedSymptoms,
    selectedApproach,
    selectedGoals,
    selectedObjectives,
    allObjectives,
  } = useAppContext();

  const handleGenerateWorksheetIdeas = () => {
    generateWorksheet();
    const treatmentPlan = {
      disorder: selectedDisorder,
      symptoms: selectedSymptoms,
      approach: selectedApproach,
      goals: selectedGoals,
      objectives: allObjectives,
    };
    console.log(treatmentPlan);
  };

  const handleSelectWorksheet = (idea: string) => {
    setSelectedWorksheet(idea);
    console.log(idea);
    // Generate worksheet content based on idea
    const worksheet = idea?.content;
    setGeneratedWorksheet(worksheet);
  };

  const handleCopyWorksheet = () => {
    navigator.clipboard
      .writeText(generatedWorksheet)
      .then(() => alert("Worksheet copied to clipboard!"))
      .catch((err) => console.error("Failed to copy worksheet: ", err));
  };

  const handleDownloadWorksheet = () => {
    if (
      typeof selectedWorksheet.content === "string" &&
      selectedWorksheet.content.trim()
    ) {
      const element = document.createElement("a");
      const file = new Blob([generatedWorksheet], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${selectedWorksheet.content.replace(
        /\s+/g,
        "_"
      )}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      console.log(selectedWorksheet.content);
      console.error(
        "Invalid selectedWorksheet. Please select a valid worksheet."
      );
    }
  };

  const handleGenerateHomeworkIdeas = () => {
    if (selectedDisorder && selectedApproach && selectedGoals.length > 0) {
      generateHomework();
    }
  };

  const generateWorksheet = async () => {
    const treatmentPlan = {
      disorder: selectedDisorder,
      symptoms: selectedSymptoms,
      approach: selectedApproach,
      goals: selectedGoals,
      objectives: allObjectives,
    };
    try {
      setWorksheetLoading(true);
      // Send the POST request
      const response = await fetch("/api/getWorksheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ treatmentPlan }),
      });

      // Check if the response is OK
      if (response.ok) {
        try {
          // Get the response text
          const responseText = await response.json();
          console.log(responseText);
          const data = formatResponse(responseText.completion);
          const worksheet = data.worksheet[0]?.worksheets;
          const idea = worksheet.map((idea) => idea.idea);
          setWorksheetIdeas(worksheet);
          console.log(worksheetIdeas);
          console.log(idea);
        } catch (error) {
          console.error("Error processing response:", error);
        }
      } else {
        console.error("Network response was not ok:", response.statusText);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setWorksheetLoading(false);
    }
  };

  const generateHomework = async () => {
    const treatmentPlan = {
      disorder: selectedDisorder,
      symptoms: selectedSymptoms,
      approach: selectedApproach,
      goals: selectedGoals,
      objectives: allObjectives,
    };
    try {
      setHomeworkLoading(true);
      // Send the POST request
      const response = await fetch("/api/getHomework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ treatmentPlan }),
      });
      if (response.ok) {
        try {
          // Get the response text
          const responseText = await response.json();
          const data = JSON.parse(responseText.completion)?.homework;
          setHomeworkIdeas(data);
        } catch (error) {
          console.error("Error processing response:", error);
        }
      } else {
        console.error("Network response was not ok:", response.statusText);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setHomeworkLoading(false);
    }
  };

  function formatResponse(responseText: string) {
    // Define a regular expression to match JSON data between curly braces
    const jsonMatch = responseText.match(/\{.*\}/s);

    if (!jsonMatch) {
      throw new Error("No JSON data found in the response");
    }

    // Extract the JSON string from the match
    const jsonString = jsonMatch[0];

    // Parse the JSON string into an object
    try {
      const jsonData = JSON.parse(jsonString);
      return jsonData;
    } catch (error) {
      throw new Error("Error parsing JSON data");
    }
  }

  return (
    <>
      <main className="flex justify-center">
        {selectedObjectives.length > 0 && (
          <div className="bg-white p-6 rounded-md shadow-lg w-[70%]">
            {/* Worksheet Ideas */}
            {selectedObjectives.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold">Worksheet Ideas</h3>
                <button
                  onClick={handleGenerateWorksheetIdeas}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  Generate Worksheet Ideas
                </button>

                {/* Show loading spinner if worksheetLoading is true */}
                {worksheetLoading && (
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
                )}

                {/* Show worksheet ideas if available */}
                {worksheetIdeas.length > 0 && (
                  <div className="mt-2 sm:space-x-2 sm:space-y-0 space-y-2">
                    {worksheetIdeas.map((idea, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectWorksheet(idea)}
                        className="p-2 bg-[#709d50] text-white rounded-md hover:bg-[#50822d] transition-colors duration-200"
                      >
                        {idea.idea}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Generated Worksheet */}
            {generatedWorksheet && (
              <div className="mb-4">
                <h3 className="font-bold">Generated Worksheet</h3>
                <textarea
                  value={generatedWorksheet}
                  readOnly
                  className="w-full p-2 border rounded-md"
                  rows={5}
                ></textarea>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleCopyWorksheet}
                    className="p-2 bg-[#709d50] text-white rounded-md hover:bg-[#50822d] transition-colors duration-200"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={handleDownloadWorksheet}
                    className="p-2 bg-[#709d50] text-white rounded-md hover:bg-[#50822d] transition-colors duration-200"
                  >
                    Download as Text
                  </button>
                </div>
              </div>
            )}

            {/* Homework Ideas */}
            {selectedObjectives.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold">Homework Ideas</h3>
                <button
                  onClick={handleGenerateHomeworkIdeas}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  Generate Homework Ideas
                </button>

                {/* Show loading spinner if homework is loading */}
                {homeworkLoading && (
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
                )}

                {/* Show homework ideas once loaded */}
                {homeworkIdeas.length > 0 && (
                  <ul className="mt-2 list-disc list-inside">
                    {homeworkIdeas.map((idea) => (
                      <li key={idea}>{idea}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default Sheets;
