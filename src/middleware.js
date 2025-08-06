import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define route constants
const PUBLIC_ROUTES = ["/sign-up", "/sign-in"];
const PROTECTED_ROUTES = ["/", "/dashboard","/home","/Editor","/Profile"];
const AUTH_ROUTE = "/sign-up";
const DEFAULT_REDIRECT = "/";

export async function middleware(request) {
  const { pathname } = request.nextUrl;


  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }


  if (
    pathname.startsWith("/_next/") ||
    pathname.includes(".") 
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  console.log("the toke is below");
  
  console.log(token);
  
  

  if (token?.user) {

    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
    }
    

    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }


    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }


  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }


  return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};