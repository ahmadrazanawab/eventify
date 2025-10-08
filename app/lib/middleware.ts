import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

// Define the shape of your decoded token
interface DecodedToken {
  role: "admin" | "student";
  email: string;
  iat?: number;
  exp?: number;
}

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const url = req.nextUrl.pathname;

    // Protect admin route
    if (url.startsWith("/admin")) {
        if (!token) return NextResponse.redirect(new URL("/login", req.url));
        const decoded = verifyToken(token);
        if (!decoded || (decoded as DecodedToken).role !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Protect student route
    if (url.startsWith("/student")) {
        if (!token) return NextResponse.redirect(new URL("/login", req.url));
        const decoded = verifyToken(token);
        if (!decoded || (decoded as DecodedToken).role !== "student") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/student/:path*"],
};
