import { NextResponse } from "next/server";

// API handler function using the App Router approach
export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ message: "Missing API key" }, { status: 500 });
  }

  try {
    // Parse the incoming request body
    const { disorder, symptoms, treatment_approach } = await req.json();

    console.log("Received data:", { disorder, symptoms, treatment_approach });

    // Validate incoming data
    if (!disorder || !symptoms || !treatment_approach) {
      return NextResponse.json(
        { message: "Disorders, symptoms, and treatment approach are required" },
        { status: 400 }
      );
    }

    // Construct the prompt with clear formatting instructions
    const prompt = `
      \n\nHuman: Based on the following details:
      - Disorders: ${disorder}
      - Symptoms: ${symptoms.join(", ")}
      - Treatment Approach: ${treatment_approach}
      Please provide 3 therapy goals for this treatment. For each goal, include 2-3 specific objectives. 
      Return the response in JSON format with the following structure:
      {
        "goals": [
          {
            "goal": "string",
            "objectives": ["string", "string"]
          }
        ]
      }
      Only include the JSON object with the array named "goals". Do not include any other information.
    \n\nAssistant: `;

    console.log("Constructed prompt:", prompt);

    // Fetch data from the external API
    const response = await fetch("https://api.anthropic.com/v1/complete", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-2.1",
        max_tokens_to_sample: 1024,
        prompt,
      }),
      redirect: "follow",
    });

    // Check for response errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Anthropics API:", errorText);
      return NextResponse.json(
        { message: "Error from Anthropics API" },
        { status: response.status }
      );
    }

    // Return the result
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
