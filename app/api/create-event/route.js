import { NextResponse } from "next/server";
import { connectDB } from "../lib/db";
import { CreateEventModel } from "../Models/create-event-schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// ✅ JWT authentication helper
const authenticate = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
};

// ✅ POST (Create event)
export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticate();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const newEvent = await CreateEventModel.create({
      ...body,
      createdBy: user.id,
    });

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ GET (Fetch all events)
export async function GET() {
  try {
    await connectDB();

    const events = await CreateEventModel.find().sort({ _id: -1 });
    if (!events || events.length === 0) {
      return NextResponse.json({ success: false, message: "No events found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
