import { createServerClient } from "@supabase/ssr";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next();

  // Validate that Supabase environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Key is not defined");
  }

  // Create the Supabase client with cookies handling
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          const cookieOptions: Partial<ResponseCookie> = {
            path: "/",
            maxAge: 3600, // Cookie expiry in 1 hour
            httpOnly: true, // Not accessible via JS
            secure: true, // Ensures the cookie is sent over HTTPS
            sameSite: "none", // Correctly typed literal for sameSite
          };

          // Set cookie in the request
          request.cookies.set({
            name,
            value,
            ...cookieOptions, // Merge the cookie options correctly
          });

          // Set cookie in the response
          supabaseResponse.cookies.set(name, value, cookieOptions);
        });
      },
    },
  });

  // Fetch the user session from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // This middleware will no longer force redirection to login
  // It only updates the session and allows access to all routes
  return supabaseResponse;
}
