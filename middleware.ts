import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next(); // Create the response object

  // Initialize Supabase client for the middleware
  const supabase = createMiddlewareClient({ req, res });

  // Get the session data from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get the current pathname from the request
  const { pathname } = req.nextUrl;

  console.log("Middleware executed:", pathname);
  console.log("Session data in middleware:", session);

  // If there is no session and the user is trying to access a protected route, redirect to login
  if (!session && pathname !== "/login" && pathname !== "/signup") {
    const loginUrl = new URL("/login", req.url);
    console.log("Redirecting to login...");
    return NextResponse.redirect(loginUrl);
  }

  console.log("Access granted:", pathname);
  // Allow access to login and signup pages without authentication
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
