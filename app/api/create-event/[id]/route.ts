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

// POST (Create event)
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
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
        const err = error as Error;
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// GET (Fetch all or single event)
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // ✅ Updated type
): Promise<NextResponse<ApiResponse>> {
    try {
        await connectDB();
        const { id } = await context.params; // ✅ await the params

        // Example: get a single event
        const event = await CreateEventModel.findById(id);
        if (!event) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: event }, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// PUT (Update event)
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // ✅ Updated type
): Promise<NextResponse<ApiResponse>> {
    try {
        await connectDB();
        const user = await authenticate();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await req.json();

        const updatedEvent = await CreateEventModel.findByIdAndUpdate(id, body, { new: true });
        if (!updatedEvent) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedEvent }, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// DELETE (Delete event)
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // ✅ Updated type
): Promise<NextResponse<ApiResponse>> {
    try {
        await connectDB();
        const user = await authenticate();
        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        const deletedEvent = await CreateEventModel.findByIdAndDelete(id);

        if (!deletedEvent) {
            return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Event deleted successfully" }, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}






// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "../../lib/db";
// import { CreateEventModel } from "../../Models/create-event-schema";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { cookies } from "next/headers";

// // Define decoded JWT type
// interface DecodedUser extends JwtPayload {
//   id: string;
//   role: "admin" | "student";
// }

// // Define standard API response type
// interface ApiResponse<T = unknown> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   error?: string;
// }

// // JWT helper
// const authenticate = async (): Promise<DecodedUser | null> => {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     if (!token) return null;

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
//     return decoded;
//   } catch {
//     return null;
//   }
// };

// // POST (Create event)
// export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
//   try {
//     await connectDB();
//     const user = await authenticate();
//     if (!user || user.role !== "admin") {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const newEvent = await CreateEventModel.create({
//       ...body,
//       createdBy: user.id,
//     });

//     return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
//   } catch (error) {
//     const err = error as Error;
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }

// // GET (Fetch all events or single event)
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse<ApiResponse>> {
//   try {
//     await connectDB();
//     const { id } = params;

//     // Example: if you want to get single event, uncomment below line
//     // const event = await CreateEventModel.findById(id);

//     const events = await CreateEventModel.find().sort({ _id: -1 });
//     if (!events || events.length === 0) {
//       return NextResponse.json({ success: false, message: "No events found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: events }, { status: 200 });
//   } catch (error) {
//     const err = error as Error;
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }

// // PUT (Update event)
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse<ApiResponse>> {
//   try {
//     await connectDB();
//     const user = await authenticate();
//     if (!user || user.role !== "admin") {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { id } = params;
//     const updatedEvent = await CreateEventModel.findByIdAndUpdate(id, body, { new: true });

//     if (!updatedEvent) {
//       return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updatedEvent }, { status: 200 });
//   } catch (error) {
//     const err = error as Error;
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }

// // DELETE (Delete event)
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ): Promise<NextResponse<ApiResponse>> {
//   try {
//     await connectDB();
//     const user = await authenticate();
//     if (!user || user.role !== "admin") {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     const { id } =await params;
//     const deletedEvent = await CreateEventModel.findByIdAndDelete(id);

//     if (!deletedEvent) {
//       return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, message: "Event deleted successfully" }, { status: 200 });
//   } catch (error) {
//     const err = error as Error;
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }
