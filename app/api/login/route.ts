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

        // 🔹 Check if user exists
        const user = await SignUpModel.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // 🔹 Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid password" },
                { status: 401 }
            );
        }

        // 🔹 Create token with all student info
        const token = jwt.sign(
            {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,        // ✅ make sure your schema has this field
                department: user.department,
                year: user.year,
                role: user.role,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        // 🔹 Create secure cookie
        const cookie = serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // 🔹 Response with cookie and data
        const res = NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                department: user.department,
                year: user.year,
                role: user.role,
            },
        });

        res.headers.set("Set-Cookie", cookie);
        return res;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}




// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import SignUpModel from "../Models/signup-schema";
// import { connectDB } from "../lib/db";
// import { serialize } from "cookie";

// export async function POST(req: Request) {
//     try {
//         await connectDB();
//         const { email, password } = await req.json();

//         const user = await SignUpModel.findOne({ email });
//         if (!user) {
//             return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
//         }

//         // const token = jwt.sign(
//         //     { id: user._id, email: user.email, role: user.role },
//         //     process.env.JWT_SECRET!,
//         //     { expiresIn: "7d" }
//         // );

//         const token = jwt.sign(
//             {
//                 id: student._id,
//                 name: student.name,
//                 email: student.email,
//                 phone: student.phone,
//                 department: student.department,
//                 year: student.year,
//                 role: student.role,
//             },
//             process.env.JWT_SECRET!,
//             { expiresIn: "7d" }
//         );

//         const cookie = serialize("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             path: "/",
//             maxAge: 60 * 60 * 24 * 1, // 1 days
//         });

//         const res = NextResponse.json({
//             success: true,
//             message: "Login successful",
//             user: { name: user.name, role: user.role },
//         });

//         res.headers.set("Set-Cookie", cookie);
//         return res;
//     } catch (error) {
//         console.error("Login error:", error);
//         return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
//     }
// }
