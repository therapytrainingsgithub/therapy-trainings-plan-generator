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

    return { signupData };
  } catch (error: any) {
    console.error("Error during signup and goal creation:", error);
    throw error;
  }
}
