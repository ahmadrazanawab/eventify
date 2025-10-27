// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "../../lib/db";
// import { CreateEventModel } from "../../Models/create-event-schema";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { cookies } from "next/headers";

// interface DecodedUser extends JwtPayload {
//     id: string;
//     role: "admin" | "student";
// }

// interface ApiResponse<T = unknown> {
//     success: boolean;
//     message?: string;
//     data?: T;
//     error?: string;
// }

// const authenticate = async (): Promise<DecodedUser | null> => {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get("token")?.value;
//         if (!token) return null;
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
//         return decoded;
//     } catch {
//         return null;
//     }
// };

// // ✅ Get single event by ID
// export async function GET(
//     req: NextRequest,
//     { params }: { params: { id: string } }
// ): Promise<NextResponse<ApiResponse>> {
//     try {
//         await connectDB();
//         const { id } = params;

//         const event = await CreateEventModel.findById(id);
//         if (!event) {
//             return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
//         }

//         return NextResponse.json({ success: true, data: event }, { status: 200 });
//     } catch (error) {
//         const err = error as Error;
//         return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//     }
// }

// // ✅ Update event by ID
// export async function PUT(
//     req: NextRequest,
//     { params }: { params: { id: string } }
// ): Promise<NextResponse<ApiResponse>> {
//     try {
//         await connectDB();
//         const user = await authenticate();
//         if (!user || user.role !== "admin") {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const body = await req.json();
//         const { id } = params;
//         const updatedEvent = await CreateEventModel.findByIdAndUpdate(id, body, { new: true });

//         if (!updatedEvent) {
//             return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
//         }

//         return NextResponse.json({ success: true, data: updatedEvent }, { status: 200 });
//     } catch (error) {
//         const err = error as Error;
//         return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//     }
// }

// // ✅ Delete event by ID
// export async function DELETE(
//     req: NextRequest,
//     { params }: { params: { id: string } }
// ): Promise<NextResponse<ApiResponse>> {
//     try {
//         await connectDB();
//         const user = await authenticate();
//         if (!user || user.role !== "admin") {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const { id } = params;
//         const deletedEvent = await CreateEventModel.findByIdAndDelete(id);

//         if (!deletedEvent) {
//             return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
//         }

//         return NextResponse.json({ success: true, message: "Event deleted successfully" }, { status: 200 });
//     } catch (error) {
//         const err = error as Error;
//         return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//     }
// }



import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { CreateEventModel } from "../../Models/create-event-schema";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedUser extends JwtPayload {
  id: string;
  role: "admin" | "student";
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

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

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();
    const { id } = params;

    const event = await CreateEventModel.findById(id);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// ✅ Update event
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();
    const user = await authenticate();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = params;
    const updatedEvent = await CreateEventModel.findByIdAndUpdate(id, body, { new: true });

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEvent }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

// ✅ Delete event
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();
    const user = await authenticate();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const deletedEvent = await CreateEventModel.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

