
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { CreateEventModel } from "../../Models/create-event-schema";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

// Define decoded JWT type
interface DecodedUser extends JwtPayload {
  id: string;
  role: "admin" | "student";
}

// Define standard API response type
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// JWT helper
const authenticate = async (): Promise<DecodedUser | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    return decoded;
  } catch {
    return null;
  }
};

// Handle GET /api/create-event/all and /api/create-event/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();
    const { id } = await params;

    // Handle /api/create-event/all
    if (id === 'all') {
      const events = await CreateEventModel.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ 
        success: true, 
        data: events 
      });
    }

    // Handle /api/create-event/[id]
    const event = await CreateEventModel.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: event 
    }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}

// Handle POST /api/create-event
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();
    const user = await authenticate();
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const body = await req.json();
    const newEvent = await CreateEventModel.create({
      ...body,
      createdBy: user.id,
    });

    return NextResponse.json({ 
      success: true, 
      data: newEvent,
      message: "Event created successfully" 
    }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create event: " + err.message 
    }, { status: 500 });
  }
}

<<<<<<< HEAD
// GET (Fetch all events or single event)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();

    const events = await CreateEventModel.find().sort({ _id: -1 });
    if (!events || events.length === 0) {
      return NextResponse.json({ success: false, message: "No events found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT (Update event)
=======
// PUT /api/create-event/[id] - Update event
>>>>>>> ef4de99ea469edeb9f9faae45056dc4dd4510d8b
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();
    const user = await authenticate();
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const body = await req.json();
    const { id } = await params;
<<<<<<< HEAD
    const updatedEvent = await CreateEventModel.findByIdAndUpdate(id, body, { new: true });

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
=======
    
    // Check if event exists
    const existingEvent = await CreateEventModel.findById(id);
    if (!existingEvent) {
      return NextResponse.json({ 
        success: false, 
        message: "Event not found" 
      }, { status: 404 });
>>>>>>> ef4de99ea469edeb9f9faae45056dc4dd4510d8b
    }

    const updatedEvent = await CreateEventModel.findByIdAndUpdate(
      id, 
      { 
        ...body, 
        updatedAt: new Date() 
      }, 
      { new: true }
    );

    return NextResponse.json({ 
      success: true, 
      data: updatedEvent,
      message: "Event updated successfully" 
    }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ 
      success: false, 
      error: "Failed to update event: " + err.message 
    }, { status: 500 });
  }
}

// DELETE /api/create-event/[id] - Delete event
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();
    const user = await authenticate();
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const { id } = await params;
    
    // Check if event exists
    const event = await CreateEventModel.findById(id);
    if (!event) {
      return NextResponse.json({ 
        success: false, 
        message: "Event not found" 
      }, { status: 404 });
    }

    await CreateEventModel.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: "Event deleted successfully" 
    }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ 
      success: false, 
      error: "Failed to delete event: " + err.message 
    }, { status: 500 });
  }
}
