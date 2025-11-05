import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { CreateEventModel } from "../../Models/create-event-schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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

// ✅ Get single event
export async function GET(request, context) {
  const params = await context.params;
  const { id } = params;
  try {
    await connectDB();

    const event = await CreateEventModel.findById(id);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ Update event
export async function PUT(request, context) {
  const params = await context.params;
  const { id } = params;
  try {
    await connectDB();
    const user = await authenticate();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updatedEvent = await CreateEventModel.findByIdAndUpdate(id, body, { new: true });

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEvent }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ Delete event
export async function DELETE(request, context) {
  const params = await context.params;
  const { id } = params;
  try {
    await connectDB();
    const user = await authenticate();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const deletedEvent = await CreateEventModel.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
