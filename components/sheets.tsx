import React, { useState } from "react";
import { useAppContext } from "@/app/context/appContext";
import jsPDF from "jspdf";

interface WorksheetIdea {
  idea: string;
  content?: string; // Optional, as content may not always be provided
}

const Sheets = () => {
  const [worksheetLoading, setWorksheetLoading] = useState<boolean>(false);
  const [homeworkLoading, setHomeworkLoading] = useState<boolean>(false);
  const [worksheetIdeas, setWorksheetIdeas] = useState<WorksheetIdea[]>([]);
  const [selectedWorksheet, setSelectedWorksheet] =
    useState<WorksheetIdea | null>(null);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<string>("");
  const [homeworkIdeas, setHomeworkIdeas] = useState<string[]>([]);
  const {
    selectedDisorder,
    selectedSymptoms,
    selectedApproach,
    selectedGoals,
    selectedObjectives,
    allObjectives,
    showSheets,
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

  const handleSelectWorksheet = (idea: WorksheetIdea) => {
    setSelectedWorksheet(idea);
    console.log(idea);
    // Generate worksheet content based on idea
    const worksheet = idea.content || ""; // Provide default empty string if content is undefined
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
      selectedWorksheet &&
      typeof selectedWorksheet.content === "string" &&
      selectedWorksheet.content.trim()
    ) {
      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Set font size
      doc.setFontSize(12);

      // Add some padding and wrap the text within the page's width
      const content = selectedWorksheet.content;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const maxLineWidth = pageWidth - margin * 2;

      // Split the content into multiple lines to fit within the page width
      const splitContent = doc.splitTextToSize(content, maxLineWidth);

      // Add the formatted text to the PDF
      doc.text(splitContent, margin, 20); // Adjust starting position

      // Save the PDF with a filename, using content for naming
      const fileName = selectedWorksheet.content
        .substring(0, 20)
        .replace(/\s+/g, "_");
      doc.save(`${fileName}.pdf`);
    } else {
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
          const worksheet = data.worksheet[0].worksheets as WorksheetIdea[]; // Type assertion for array
          console.log(worksheet);
          setWorksheetIdeas(worksheet);
        } catch (error) {
          console.error("Error processing response:", error);
        }
      } else {
        console.error("Network response was not ok:", response.statusText);
      }
    } catch (error) {
      console.error("Error in generateWorksheet:", error);
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
          const data = formatResponse(responseText.completion)
            ?.homework as string[]; // Type assertion for array
          console.log(data);
          setHomeworkIdeas(data);
        } catch (error) {
          console.error("Error processing response:", error);
        }
      } else {
        console.error("Network response was not ok:", response.statusText);
      }
    } catch (error) {
      console.error("Error in generateHomework:", error);
    } finally {
      setHomeworkLoading(false);
    }
  };

  function formatResponse(responseText: string): any {
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

  return (
    <>
      <main className="flex justify-center">
        {showSheets && (
          <div className="bg-white p-6 rounded-md shadow-lg w-[70%]">
            {/* Worksheet Ideas */}
            {selectedObjectives.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold">Worksheet Ideas</h3>
                <button
                  onClick={handleGenerateWorksheetIdeas}
                  className="p-2 bg-[#50822d] text-white rounded"
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
                  <div className="mt-4 space-y-4 md:space-y-0 md:space-x-4 md:flex">
                    {worksheetIdeas.map((idea, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectWorksheet(idea)}
                        className="p-2 bg-[#709d50] text-white rounded-md shadow-md hover:bg-[#50822d] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#50822d] focus:ring-opacity-50"
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
                    Download as PDF
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
                  className="p-2 bg-[#50822d] text-white rounded"
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

                {/* Show homework ideas if available */}
                {homeworkIdeas.length > 0 && (
                  <ul className="mt-2 list-disc pl-5">
                    {homeworkIdeas.map((idea, index) => (
                      <li key={index} className="p-2">
                        {idea}
                      </li>
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
