import { NextResponse } from "next/server";

// API handler function using the App Router approach
export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ message: "Missing API key" }, { status: 500 });
  }

  try {
    const { treatmentPlan } = await req.json();

    console.log("Received data:", { treatmentPlan });

    // Validate incoming data
    if (!treatmentPlan) {
      return NextResponse.json(
        { message: "Disorders, symptoms, and treatment approach are required" },
        { status: 400 }
      );
    }

    // Construct the prompt with clear formatting instructions
    const prompt = `
    \n\nHuman: Based on the following details:
    - Disorders: ${treatmentPlan.disorder}
    - Symptoms: ${treatmentPlan.symptoms.join(", ")}
    - Treatment Approach: ${treatmentPlan.approach}
    - Goals: ${treatmentPlan.goals}
    - Objectives: ${treatmentPlan.objectives}
    
    For the provided information, suggest 3 worksheet ideas relevant to the patient's treatment. For each idea, include 4 therapeutic tasks. Each task should have a header and a description, such as tracking behaviors, journaling, or self-reflection exercises. Also don't repeat the ideas and their content which are ${
      treatmentPlan.ideas
    }, just generate new ones.
    
    Return the response in JSON format with the following structure:
    {
      "worksheet": [
        {
          "worksheets": [
            {
              "idea": "string",
              "content": [
                {
                  "header": "string",
                  "description": "string"
                },
                {
                  "header": "string",
                  "description": "string"
                },
                {
                  "header": "string",
                  "description": "string"
                },
                {
                  "header": "string",
                  "description": "string"
                }
              ]
            },
            {
              "idea": "string",
              "content": [
                {
                  "header": "string",
                  "description": "string"
                },
                {
                  "header": "string",
                  "description": "string"
                },
                {
                  "header": "string",
                  "description": "string"
                },
                {
                  "header": "string",
                  "description": "string"
                }
              ]
            },
            {
              "idea": "string",
              "content": [
                {
                  "header": "string",
                  "description": "string"
                },
                {
                  "header": "string",
                  "description": "string"
                },
                {
                  "header": "string",
                  "description": "string"
                },
                {
                  "header": "string",
                  "description": "string"
                }
              ]
            }
          ]
        }
      ]
    }
    Only include the JSON object with the array named "worksheet". Do not include any other information.
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
