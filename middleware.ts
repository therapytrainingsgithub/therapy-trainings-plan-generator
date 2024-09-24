import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session exists, redirect to the base URL and then to /login
  if (!session) {
    const baseUrl = new URL("/", req.url); // Get base URL
    baseUrl.pathname = "/login"; // Append /login to the base URL
    return NextResponse.redirect(baseUrl); // Redirect to the base URL + /login
  }

  return res; // If session exists, continue
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
