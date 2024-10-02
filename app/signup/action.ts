import { supabase } from "@/lib/supabase";

export async function signup(email: string, password: string) {
  try {
    const { data: signupData, error: signupError } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
      }
    );

    if (signupError) {
      throw new Error(signupError.message);
    }

    const userId = signupData?.user?.id;
    if (!userId) {
      throw new Error("User ID not found after signup.");
    }

    const { data: goalsData, error: goalsError } = await supabase
      .from("goals")
      .insert([
        {
          user_Id: userId,
          clinical_Hours: 4000,
          supervision_Hours: 100,
        },
      ])
      .select();

    if (goalsError) {
      throw new Error(`Error inserting goals: ${goalsError.message}`);
    }

    return { signupData, goalsData };
  } catch (error: any) {
    console.error("Error during signup and goal creation:", error);
    throw error;
  }
}
