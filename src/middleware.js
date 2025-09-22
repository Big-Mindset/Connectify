import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/sign-up", "/sign-in","/EmailVerification"];
const PROTECTED_ROUTES = ["/", "/settings","/Account"];
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
  console.log("Cookies in middleware:", request.cookies.getAll());
  let token;
  try{

     token = await getToken({
      req: request,
      secret: "hello",
    });
    console.log("no error");
  console.log("the secret key is "+process.env.NEXTAUTH_SECRET);
    
  }catch(error){
    console.log("there is an errror");
    
    console.log(error);
    
  }
  console.log("the token is "+token);
  


  if (token?.user) {
if (token.user.isCompleted && pathname === "/Account"){
  return NextResponse.redirect(new URL("/", request.url));

}
if (!token.user.isCompleted && pathname !== "/Account"){
  return NextResponse.redirect(new URL("/Account", request.url));

}
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
