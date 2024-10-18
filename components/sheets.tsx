import React, { useEffect, useState } from "react";
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
  const [selectedWorksheet, setSelectedWorksheet] = useState<
    WorksheetIdea | any
  >(null);
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
  const [selectedIdea, setSelectedIdea] = useState<WorksheetIdea | null>(null);

  useEffect(() => {
    if (selectedGoals.length === 0 || selectedObjectives.length === 0) {
      setWorksheetIdeas([]);
      setSelectedWorksheet(null);
      setGeneratedWorksheet("");
      setHomeworkIdeas([]);
      setSelectedIdea(null);
    }
  }, [selectedGoals, selectedObjectives]);

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

  const handleRefreshWorksheetIdeas = () => {
    refreshWorksheet();
    const treatmentPlan = {
      disorder: selectedDisorder,
      symptoms: selectedSymptoms,
      approach: selectedApproach,
      goals: selectedGoals,
      objectives: allObjectives,
      ideas: worksheetIdeas,
    };
    console.log(treatmentPlan);
  };

  const handleSelectWorksheet = (idea: WorksheetIdea) => {
    setSelectedWorksheet(idea);
    setGeneratedWorksheet(idea.content || "");
    setSelectedIdea(idea);
  };

  const handleCopyWorksheet = () => {
    navigator.clipboard
      .writeText(generatedWorksheet)
      .then(() => alert("Worksheet copied to clipboard!"))
      .catch((err) => console.error("Failed to copy worksheet: ", err));
  };

  const handleCopyHomework = () => {
    // Join the array into a single string, separated by newlines or commas
    const contentToCopy = homeworkIdeas.join("\n"); // Change "\n" to ", " if you prefer comma separation

    navigator.clipboard
      .writeText(contentToCopy)
      .then(() => alert("Worksheet copied to clipboard!"))
      .catch((err) => console.error("Failed to copy worksheet: ", err));
  };

  const handleDownloadWorksheet = () => {
    if (
      selectedWorksheet &&
      Array.isArray(selectedWorksheet.content) &&
      selectedWorksheet.content.length > 0
    ) {
      const doc = new jsPDF();
  
      // Add logo (optional)
      const logoUrl = "/images/logo.png";
      const logoWidth = 60;
      const logoHeight = 20;
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2;
      doc.addImage(logoUrl, "PNG", logoX, 10, logoWidth, logoHeight);
  
      // Fetch heading and subtitle from the backend (if available)
  
      // Starting Y position below the logo
      let yPos = logoHeight + 30;
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  
      // Add main title (fetched from backend)
  
      // Add underline (horizontal line) under the subtitle

      // Move Y position down to start content
      yPos += 10;
  
      // Now, proceed with content (as per the previous design)
      selectedWorksheet.content.forEach((task: any, index: any) => {
        // Check for page breaks
        if (yPos + 60 > doc.internal.pageSize.getHeight()) {
          doc.addPage(); // Add a new page if content exceeds page height
          yPos = 20; // Reset Y position after page break
        }
  
        // Draw green header with straight lower border (no rounded bottom corners)
        const headerHeight = 10;
        doc.setFillColor(87, 167, 108); // Green color
        doc.rect(margin, yPos, pageWidth, headerHeight, "F"); // Green header with no rounded bottom
  
        // Add white header text
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255); // White text
        doc.text(task.header, margin + 5, yPos + 7);
  
        // Move down for content box
        yPos += headerHeight;
  
        // Draw content box with straight top border (to align with the green header) and rounded bottom corners
        const boxHeight = 25 + (task.points ? task.points.length * 6 : 0); // Adjust box height based on content
        doc.setDrawColor(87, 167, 108); // Border color matching header
        doc.rect(margin, yPos, pageWidth, boxHeight);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0); 
        const splitDescription = doc.splitTextToSize(task.description, pageWidth - 10); // Adjust text width
        doc.text(splitDescription, margin + 5, yPos + 5); // Add description text
  
        yPos += 15; // Move down for bullet points
        if (task.points && task.points.length > 0) {
          const columnWidth = pageWidth / task.points.length; // Equal spacing for bullet points
          doc.setFont("helvetica", "italic");
  
          task.points.forEach((point: string, i: number) => {
            const pointX = margin + i * columnWidth + 5;
            doc.text(point, pointX, yPos);
          });
        }
  
        yPos += 30; // Ensure spacing between sections to prevent overlap
      });
  
      const fileName = selectedWorksheet.idea.substring(0, 20).replace(/\s+/g, "_");
      doc.save(`${fileName}.pdf`);
    } else {
      console.error("Invalid selectedWorksheet. Please select a valid worksheet.");
    }
  };
  
  
  

  const handleDownloadHomework = () => {
    if (homeworkIdeas && homeworkIdeas.length > 0) {
      const doc = new jsPDF();

      // Add logo
      const logoUrl = "/images/logo.png"; // Update with your logo URL or base64 string
      const logoWidth = 60; // Adjust width for the logo
      const logoHeight = 20; // Adjust height for the logo
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Center logo
      doc.addImage(logoUrl, "PNG", logoX, 10, logoWidth, logoHeight); // Position the logo

      // Add heading
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const heading = "Homework"; // Change the heading as needed
      const headingX =
        (doc.internal.pageSize.getWidth() - doc.getTextWidth(heading)) / 2; // Center heading
      doc.text(heading, headingX, logoHeight + 20); // Position heading below the logo

      // Set font size for content
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      // Starting position for the content
      let yPos = logoHeight + 40; // Start below the heading
      const margin = 10; // Margin for text

      // Add each homework idea to the PDF
      homeworkIdeas.forEach((idea) => {
        // Split the text into lines that fit within the page width
        const splitLines = doc.splitTextToSize(
          `• ${idea}`,
          doc.internal.pageSize.getWidth() - margin * 2
        );

        // Add each line to the PDF
        splitLines.forEach((line: string) => {
          doc.text(line, margin, yPos); // Add each line of content
          yPos += 10; // Increase vertical position for the next line
        });
      });

      // Save the PDF with a filename
      const fileName = "Homework_Ideas"; // Change this as needed
      doc.save(`${fileName}.pdf`);
    } else {
      console.error("Invalid homeworkIdeas. Please provide valid ideas.");
    }
  };

  const handleGenerateHomeworkIdeas = () => {
    if (selectedDisorder && selectedApproach && selectedGoals.length > 0) {
      generateHomework();
    }
  };

  const handleRefreshHomeworkIdeas = () => {
    if (selectedDisorder && selectedApproach && selectedGoals.length > 0) {
      refreshHomework();
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
      setSelectedWorksheet(null);
      setWorksheetIdeas([]);
      setGeneratedWorksheet("");
      setWorksheetLoading(true);
      setSelectedIdea(null);
      const response = await fetch("/api/getWorksheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ treatmentPlan }),
      });

      if (response.ok) {
        try {
          const responseText = await response.json();
          const data = formatResponse(responseText.completion);
          const worksheet = data.worksheet[0].worksheets as WorksheetIdea[];
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

  const refreshWorksheet = async () => {
    const ideas = worksheetIdeas.map((idea) => idea.idea);
    const treatmentPlan = {
      disorder: selectedDisorder,
      symptoms: selectedSymptoms,
      approach: selectedApproach,
      goals: selectedGoals,
      objectives: allObjectives,
      ideas: ideas,
    };
    try {
      setSelectedWorksheet(null);
      setWorksheetIdeas([]);
      setGeneratedWorksheet("");
      setWorksheetLoading(true);
      setSelectedIdea(null);
      const response = await fetch("/api/refreshWorksheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ treatmentPlan }),
      });

      if (response.ok) {
        try {
          const responseText = await response.json();
          const data = formatResponse(responseText.completion);
          const worksheet = data.worksheet[0].worksheets as WorksheetIdea[];
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
      setHomeworkIdeas([]);
      setHomeworkLoading(true);
      const response = await fetch("/api/getHomework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ treatmentPlan }),
      });
      if (response.ok) {
        try {
          const responseText = await response.json();
          const data = formatResponse(responseText.completion)
            ?.homework as string[];
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

  const refreshHomework = async () => {
    const treatmentPlan = {
      disorder: selectedDisorder,
      symptoms: selectedSymptoms,
      approach: selectedApproach,
      goals: selectedGoals,
      objectives: allObjectives,
      ideas: homeworkIdeas,
    };
    try {
      setHomeworkIdeas([]);
      setHomeworkLoading(true);
      const response = await fetch("/api/refreshHomework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ treatmentPlan }),
      });
      if (response.ok) {
        try {
          const responseText = await response.json();
          const data = formatResponse(responseText.completion)
            ?.homework as string[];
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
              <div className="mb-4 space-y-1">
                <h3 className="font-bold">Worksheet Ideas</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleGenerateWorksheetIdeas}
                    className="p-2 bg-[#50822d] text-white rounded"
                  >
                    Generate Worksheet
                  </button>

                  {/* Conditionally display 'Please Select Idea' message */}
                  {worksheetIdeas.length > 0 && !selectedIdea && (
                    <h3 className="font-semibold text-red-500 text-sm">
                      Please Select Worksheet Idea
                    </h3>
                  )}
                </div>

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

                {worksheetIdeas.length > 0 && (
                  <div className="mt-4 space-y-4 md:space-y-0 md:space-x-4 md:mt-4 md:flex">
                    {worksheetIdeas.map((idea, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectWorksheet(idea)}
                        className={`p-2 rounded-md shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                          selectedIdea === idea
                            ? "bg-[#709d50] text-white hover:bg-[#50822d] focus:ring-[#50822d]"
                            : "bg-gray-200 hover:bg-gray-400 focus:ring-gray-400"
                        }`}
                      >
                        {idea.idea}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Generated Worksheet */}
            {generatedWorksheet && worksheetIdeas.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold">Generated Worksheet</h3>
                <div className="border border-gray-400 border-solid p-2">
                  {" "}
                  {/* Changed to solid for visibility */}
                  <table className="min-w-full border-collapse border border-gray-300">
                    <tbody>
                      {selectedWorksheet.content.map(
                        (task: any, index: any) => (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2">
                              {task.header}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {task.description}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={handleRefreshWorksheetIdeas}
                    className="p-2 bg-[#709d50] text-white rounded-md hover:bg-[#50822d] transition-colors duration-200"
                  >
                    Refresh
                  </button>
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
              <div className="mb-4 space-y-1">
                <h3 className="font-bold">Homework Ideas</h3>
                <button
                  onClick={handleGenerateHomeworkIdeas}
                  className="p-2 bg-[#50822d] text-white rounded"
                >
                  Generate Homework
                </button>

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

                {homeworkIdeas.length > 0 && (
                  <div>
                    <h3 className="font-bold mt-4">Generated Homework</h3>
                    <textarea
                      readOnly
                      className="w-full p-2 border rounded-md"
                      rows={8}
                      value={homeworkIdeas
                        .map((idea) => `• ${idea}`)
                        .join("\n")} // Adding "• " to simulate bullets
                    ></textarea>

                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={handleRefreshHomeworkIdeas}
                        className="p-2 bg-[#709d50] text-white rounded-md hover:bg-[#50822d] transition-colors duration-200"
                      >
                        Refresh
                      </button>
                      <button
                        onClick={handleCopyHomework}
                        className="p-2 bg-[#709d50] text-white rounded-md hover:bg-[#50822d] transition-colors duration-200"
                      >
                        Copy to Clipboard
                      </button>
                      <button
                        onClick={handleDownloadHomework}
                        className="p-2 bg-[#709d50] text-white rounded-md hover:bg-[#50822d] transition-colors duration-200"
                      >
                        Download as PDF
                      </button>
                    </div>
                  </div>
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
