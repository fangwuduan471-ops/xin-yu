import { auth } from "@/auth";

export default auth((request) => {
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/admin");
  if (isProtected && !request.auth) {
    return Response.redirect(new URL("/login", request.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
