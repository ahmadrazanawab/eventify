import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../lib/db";
import { StudentRegistrationModel } from "../Models/student-event-schema";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedUser extends JwtPayload {
  id: string;
  role: "student" | "admin";
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const user = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
        if (user.role !== "student") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        // Example in your POST API for student registration

        // Parse request body
        const body = await req.json();
        const { event: eventId } = body;
        const studentId = user.id;

        if (!eventId) {
            return NextResponse.json(
                { success: false, message: "Event ID is required" },
                { status: 400 }
            );
        }

        // Check if already registered
        const existingRegistration = await StudentRegistrationModel.findOne({
            student: studentId,
            event: eventId,
        });

        if (existingRegistration) {
            return NextResponse.json(
                { success: false, message: "You have already registered for this event" },
                { status: 400 }
            );
        }


        // const body = await req.json();
        const registration = await StudentRegistrationModel.create({
            student: user.id,
            ...body,
        });

        return NextResponse.json({ success: true, data: registration }, { status: 201 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}


interface UserPayload extends JwtPayload {
    id: string;
    role: "admin" | "student";
}

export async function GET() {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

        let registrations;
        if (user.role === "student") {
            registrations = await StudentRegistrationModel.find({ student: user.id }).populate("event");
        } else if (user.role === "admin") {
            registrations = await StudentRegistrationModel.find().populate("event").populate("student");
        } else {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ success: true, data: registrations }, { status: 200 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}

