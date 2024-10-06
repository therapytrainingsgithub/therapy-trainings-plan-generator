"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const creds = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data } = await supabase.auth.signInWithPassword(creds);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function forgotPassword(email: string) {
  const supabase = createClient();

  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .single();

  if (!userProfile) {
    return { error: "No account found with this email address." };
  }

  if (profileError) {
    return { error: "An error occurred while checking the email address." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "/forgot-password", // Correct URL for the live domain
  });

  if (error) {
    return { error: error.message };
  }

  return { data: "Reset password link has been sent to your email." };
}
