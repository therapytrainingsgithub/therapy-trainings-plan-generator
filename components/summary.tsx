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

      // Add logo (assuming you have a base64 or URL for the logo)
      const logoUrl = "/images/logo.png"; // Update with your logo URL or base64 string
      const logoWidth = 30; // Adjust width for the logo (double the height)
      const logoHeight = 8; // Adjust height for the logo
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Center logo
      doc.addImage(logoUrl, "PNG", logoX, 10, logoWidth, logoHeight); // Position the logo

      // Add heading
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const heading = "Treatment Plan";
      const headingX =
        (doc.internal.pageSize.getWidth() - doc.getTextWidth(heading)) / 2; // Center heading
      doc.text(heading, headingX, logoHeight + 20); // Position heading below the logo

      // Set font size for content
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      // Create a summary content array for key-value pairs
      const content = [
        { key: "Disorder", value: selectedDisorder || "None" },
        { key: "Symptoms", value: selectedSymptoms || "None" },
        { key: "Treatment Approach", value: selectedApproach || "None" },
        {
          key: "Goals",
          value: selectedGoals.length > 0 ? selectedGoals.join(", ") : "None",
        },
        {
          key: "Objectives",
          value:
            selectedObjectives.length > 0
              ? selectedObjectives.join(", ")
              : "None",
        },
      ];

      // Starting position for the content
      let yPos = logoHeight + 40; // Start below the heading

      // Add each key-value pair to the PDF
      content.forEach((item) => {
        // Set key to bold
        doc.setFont("helvetica", "bold");
        doc.text(item.key + ":", 10, yPos);

        // Set value to regular, position below the key
        doc.setFont("helvetica", "normal");
        const valueY = yPos + 10; // Position value on the next line
        doc.text(String(item.value), 10, valueY); // Left aligned
        yPos += 20; // Increase vertical position for the next pair
      });

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
            <h6 className="font-semibold">Disorder:</h6>
            <p>{selectedDisorder || "None"}</p>
          </div>
          <div className="mb-4">
            <h6 className="font-semibold">Symptoms:</h6>
            <p>
              {selectedSymptoms.length > 0
                ? selectedSymptoms.join(", ")
                : "None"}
            </p>
          </div>
          <div className="mb-4">
            <h6 className="font-semibold">Treatment Approach:</h6>
            <p>{selectedApproach || "None"}</p>
          </div>
          <div className="mb-4">
            <h6 className="font-semibold">Goals:</h6>
            <p>
              {selectedGoals.length > 0 ? selectedGoals.join(", ") : "None"}
            </p>
          </div>
          <div>
            <h6 className="font-semibold">Objectives:</h6>
            <p>
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
