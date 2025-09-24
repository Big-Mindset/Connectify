import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/sign-up", "/sign-in","/EmailVerification"];
const PROTECTED_ROUTES = ["/", "/settings"];
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

  let token = await getToken({
  req: request,
  secret: process.env.NEXTAUTH_SECRET,
  cookieName: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
});


  if (token?.user) {

    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
    }
    

    if (PROTECTED_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }


    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }


  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }


  return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
