"use client"; // Ensure this page runs as a client component

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // client-side routing and search params
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams(); // Client-side params
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Get the reset token and email from the URL
      const accessToken = searchParams.get("access_token");
      const email = searchParams.get("email");

      if (!accessToken || !email) {
        toast.error("Reset token or email is missing in the URL");
        setLoading(false);
        return;
      }

      // Step 1: Verify the OTP (reset token in the URL)
      const { error: otpError } = await supabase.auth.verifyOtp({
        email: email, // User's email
        token: accessToken, // Token sent in the reset email
        type: "recovery", // Specify the type as 'recovery' for password reset
      });

      if (otpError) {
        toast.error(otpError.message);
        setLoading(false);
        return;
      }

      // Step 2: Update the user's password after OTP verification
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error(updateError.message);
        setLoading(false);
      } else {
        toast.success("Password reset successfully!");
        setLoading(false);
        router.push("/login"); // Redirect to login after successful password reset
      }
    } catch (error) {
      toast.error("An error occurred while resetting your password");
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {" "}
      {/* Wrap the component in Suspense */}
      <div className="h-[100vh] flex flex-col justify-center items-center p-4">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-4"
        >
          <div>
            <label htmlFor="new-password" className="block mb-2">
              New Password:
            </label>
            <Input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block mb-2">
              Confirm Password:
            </label>
            <Input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="bg-[#709D51] hover:bg-[#50822D] w-full"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </Suspense>
  );
}