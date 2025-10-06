import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SignUpModel from "../Models/signup-schema";
import { connectDB } from "../lib/db";
import { serialize } from "cookie";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        const user = await SignUpModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        const cookie = serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 1 * 24 * 60 * 60, // 1 days
        });

        const res = NextResponse.json({
            success: true,
            message: "Login successful",
            user: { name: user.name, role: user.role },
        });

        res.headers.set("Set-Cookie", cookie);
        return res;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
