// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next(); // Create the response object

//   // Initialize Supabase client for the middleware
//   const supabase = createMiddlewareClient({ req, res });

//   // Get the session data from Supabase
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   // Get the current pathname from the request
//   const { pathname } = req.nextUrl;

//   // If there is no session and the user is trying to access a protected route, redirect to login
//   if (!session && pathname !== "/login" && pathname !== "/signup") {
//     const loginUrl = new URL("/login", req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Allow access to login and signup pages without authentication
//   return res;
// }

// // Define the routes that should be matched for middleware
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"], // Apply to all routes except API, static files, and favicon
// };

import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/", "/settings", "/new-session"],
};
