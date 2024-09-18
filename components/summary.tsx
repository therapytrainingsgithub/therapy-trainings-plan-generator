import React from "react";
import { useAppContext } from "@/app/context/appContext";
import jsPDF from "jspdf";

const Summary = () => {
  const {
    selectedDisorder,
    selectedSymptoms,
    selectedApproach,
    selectedGoals,
    selectedObjectives,
    showSummary,
  } = useAppContext();

  // Function to copy the summary to the clipboard
  const handleCopyWorksheet = () => {
    const summaryContent = `
      Disorder: ${selectedDisorder || "None"}
      Symptoms: ${selectedSymptoms || "None"}
      Treatment Approach: ${selectedApproach || "None"}
      Goals: ${selectedGoals.length > 0 ? selectedGoals.join(", ") : "None"}
      Objectives: ${
        selectedObjectives.length > 0 ? selectedObjectives.join(", ") : "None"
      }
    `;

    navigator.clipboard
      .writeText(summaryContent)
      .then(() => alert("Worksheet copied to clipboard!"))
      .catch((err) => console.error("Failed to copy worksheet: ", err));
  };

  // Function to download the summary as a PDF
  const handleDownloadWorksheet = () => {
    if (showSummary) {
      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Set font size
      doc.setFontSize(12);

      // Format the content
      const summaryContent = `
      Disorder: ${selectedDisorder || "None"}
      Symptoms: ${selectedSymptoms || "None"}
      Treatment Approach: ${selectedApproach || "None"}
      Goals: ${selectedGoals.length > 0 ? selectedGoals.join(", ") : "None"}
      Objectives: ${
        selectedObjectives.length > 0 ? selectedObjectives.join(", ") : "None"
      }
      `;

      // Add some padding and wrap the text within the page's width
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const maxLineWidth = pageWidth - margin * 2;

      // Split the content into multiple lines to fit within the page width
      const splitContent = doc.splitTextToSize(summaryContent, maxLineWidth);

      // Add the formatted text to the PDF
      doc.text(splitContent, margin, 20); // Adjust starting position

      // Save the PDF with a filename, using a custom name
      doc.save(`Treatment_Plan_Summary.pdf`);
    } else {
      console.error("No summary to download. Please fill out the worksheet.");
    }
  };

  return (
    <main className="flex justify-center">
      {/* Treatment Plan Summary */}
      {showSummary && (
        <div className="bg-white p-6 rounded-md shadow-lg w-[70%]">
          <h3 className="text-xl font-bold mb-4">Treatment Plan Summary</h3>
          <div className="mb-4">
            <h6 className="font-semibold text-gray-700">Disorder:</h6>
            <p className="text-gray-800">{selectedDisorder || "None"}</p>
          </div>
          <div className="mb-4">
            <h6 className="font-semibold text-gray-700">Symptoms:</h6>
            <p className="text-gray-800">
              {selectedSymptoms.length > 0
                ? selectedSymptoms.join(", ")
                : "None"}
            </p>
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
          <div className="mt-5 flex justify-end space-x-2">
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
    </main>
  );
};

export default Summary;
