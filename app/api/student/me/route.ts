import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import SignUpModel from "../../Models/signup-schema";
import { connectDB } from "../../lib/db";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const token = (await cookies()).get("token")?.value;
        if (!token)
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const user = await SignUpModel.findById(decoded.id).select("-password");
        if (!user)
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        return NextResponse.json({ success: true, student: user });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
