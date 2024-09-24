import { supabase } from "@/lib/supabase";

export async function login(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw new Error(error.message); // Throw an error for login failures
    }

    return data; // Return the login data
  } catch (error: any) {
    console.error("Error during login:", error);
    throw error; // Re-throw error to the caller
  }
}
