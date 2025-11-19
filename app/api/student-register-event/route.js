import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../lib/db";
import { StudentRegistrationModel } from "../Models/student-event-schema";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CreateEventModel } from "../Models/create-event-schema";

export const runtime = "nodejs";



export async function POST(req) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if (!process.env.JWT_SECRET) {
            return NextResponse.json({ success: false, message: "Server misconfiguration: JWT_SECRET missing" }, { status: 500 });
        }
        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }
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

        // Load event to enforce payment requirement and fee
        const eventDoc = await CreateEventModel.findById(eventId);
        if (!eventDoc) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
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

        // Enforce payment fields based on event settings
        let eventFees = 0;
        let paymentStatus = "none";
        if (eventDoc.paymentRequired) {
            if (!eventDoc.fee || eventDoc.fee <= 0) {
                return NextResponse.json(
                    { success: false, message: "Event fee is not configured properly" },
                    { status: 400 }
                );
            }
            eventFees = eventDoc.fee;
            // Accept only 'paid' or 'pending' from client; default to pending
            paymentStatus = body.paymentStatus === "paid" ? "paid" : "pending";
        }

        const registration = await StudentRegistrationModel.create({
            student: user.id,
            ...body,
            eventFees,
            paymentStatus,
        });

        return NextResponse.json({ success: true, data: registration }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
}




export async function GET() {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.JWT_SECRET) {
            return NextResponse.json({ success: false, message: "Server misconfiguration: JWT_SECRET missing" }, { status: 500 });
        }
        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
        }

        let registrations;
        if (user.role === "student") {
            registrations = await StudentRegistrationModel.find({ student: user.id }).populate("event");
        } else if (user.role === "admin") {
            registrations = await StudentRegistrationModel.find().populate("event").populate("student");
        } else {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ success: true, data: registrations }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
    }
}

