import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import SignUpModel from "../../Models/signup-schema";
import { connectDB } from "../../lib/db";

export async function GET() {
    try {
        await connectDB();
        const token = (await cookies()).get("token")?.value;
        if (!token)
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await SignUpModel.findById(decoded.id).select("-password");
        if (!user)
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        return NextResponse.json({ success: true, student: user });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}


// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export async function GET(req: NextRequest) {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get("token")?.value;

//         if (!token) {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//         }

//         // Define expected decoded structure
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//             id: string;
//             name: string;
//             email: string;
//             phone: string;
//             department: string;
//             year: string;
//             role: string;
//         };

//         if (decoded.role !== "student") {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//         }

//         // ✅ Return all the fields you need
//         return NextResponse.json({
//             success: true,
//             student: {
//                 id: decoded.id,
//                 name: decoded.name,
//                 email: decoded.email,
//                 phone: decoded.phone,
//                 department: decoded.department,
//                 year: decoded.year,
//             },
//         });
//     } catch (err) {
//         console.error("Student /me route error:", err);
//         return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
//     }
// }






// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt, { JwtPayload } from "jsonwebtoken";

// // Define the expected structure of the JWT payload
// interface StudentJwtPayload extends JwtPayload {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   department: string;
//   year: string;
//   role: "student" | "admin";
// }

// interface StudentResponse {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   department: string;
//   year: string;
// }

// export async function GET(req: NextRequest) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET!
//     ) as StudentJwtPayload;

//     if (decoded.role !== "student") {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const student: StudentResponse = {
//       id: decoded.id,
//       name: decoded.name,
//       email: decoded.email,
//       phone: decoded.phone,
//       department: decoded.department,
//       year: decoded.year,
//     };

//     return NextResponse.json({ success: true, student }, { status: 200 });
//   } catch (error: unknown) {
//     const message =
//       error instanceof Error ? error.message : "Something went wrong";
//     return NextResponse.json({ success: false, message }, { status: 500 });
//   }
// }
