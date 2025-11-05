import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.pathname;

  // ✅ Protect admin route
  if (url.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ✅ Protect student route
  if (url.startsWith("/student")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "student") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/api/create-event/:path*"],
};
