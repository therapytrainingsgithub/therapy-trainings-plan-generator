import { NextResponse } from "next/server";

// Define the interface for a goal with objectives
interface Goal {
  goal: string;
  objectives: string[]; // List of objectives for the goal
}

// API handler function using the App Router approach
export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ message: "Missing API key" }, { status: 500 });
  }

  try {
    // Parse the incoming request body
    const {
      disorder,
      symptoms,
      treatment_approach,
      existing_Goals_Objectives,
    }: {
      disorder: string;
      symptoms: string[];
      treatment_approach: string;
      existing_Goals_Objectives?: Goal[];
    } = await req.json();

    console.log("Received data:", {
      disorder,
      symptoms,
      treatment_approach,
      existing_Goals_Objectives,
    });

    // Validate incoming data
    if (!disorder || !symptoms || !treatment_approach) {
      return NextResponse.json(
        { message: "Disorder, symptoms, and treatment approach are required" },
        { status: 400 }
      );
    }

    // Check if existing goals are provided
    if (existing_Goals_Objectives && existing_Goals_Objectives.length > 0) {
      // Construct prompt to get updated objectives for existing goals
      const existingGoalsPrompt = `
        \n\nHuman: Based on the following details:
        - Disorders: ${disorder}
        - Symptoms: ${symptoms.join(", ")}
        - Treatment Approach: ${treatment_approach}

        You have the following goals with existing objectives:
        ${existing_Goals_Objectives
          .map(
            (goal) => `
          - Goal: ${goal.goal}
          Objectives: ${goal.objectives.join(", ")}
        `
          )
          .join("\n")}

        Please provide any additional or updated objectives for these goals. Do not modify the goals, just update or add objectives to the same goals. Ensure that the new objectives do not duplicate any of the existing objectives provided above.
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

      console.log(
        "Constructed prompt for existing goals:",
        existingGoalsPrompt
      );

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
          prompt: existingGoalsPrompt,
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
    }

    // Construct the prompt to generate new goals
    const newGoalsPrompt = `
    \n\nHuman: Based on the following details:
    - Disorders: ${disorder}
    - Symptoms: ${symptoms.join(", ")}
    - Treatment Approach: ${treatment_approach}

    ${
      existing_Goals_Objectives && existing_Goals_Objectives.length > 0
        ? `You have the following existing goals with their respective objectives:
      ${existing_Goals_Objectives
        .map(
          (goal) => `
        - Goal: ${goal.goal}
        Objectives: ${goal.objectives.join(", ")}
      `
        )
        .join("\n")}`
        : ""
    }

    Please provide 3 new therapy goals for this treatment. For each goal, include 2-3 specific objectives. Ensure that the new objectives do not duplicate any of the existing objectives provided above. Only include new objectives and goals in your response.
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

    console.log("Constructed prompt for new goals:", newGoalsPrompt);

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
        prompt: newGoalsPrompt,
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
    console.log(result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
