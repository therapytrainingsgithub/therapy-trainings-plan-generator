"use server";

import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Proceed with the signup
  const { error: signupError, data: signupData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "/login",
    },
  });

  if (signupError) {
    return { error: signupError.message };
  }

  if (!signupData || !signupData.user) {
    return { error: "An error occurred during signup. No user data returned." };
  }
  try {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: signupData.user.id,
      email: email,
    });

    if (profileError) {
      return { error: "An error occurred while creating the user profile" };
    }
  } catch (err) {
    return {
      error: "An unexpected error occurred while creating the user profile",
    };
  }

  return { data: signupData };
}
