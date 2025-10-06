import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
    const cookie = serialize("token", "", {
        httpOnly: true,
        path: "/",
        expires: new Date(0),
    });

    const res = NextResponse.json({ success: true, message: "Logged out successfully" });
    res.headers.set("Set-Cookie", cookie);
    return res;
}
