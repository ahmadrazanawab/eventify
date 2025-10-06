import { NextResponse } from "next/server";
import SignUpModel from "../Models/signup-schema";
import SignUpSchemaWithRole from "../schema-validation/signup-validate";
import { connectDB } from "../lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        // 1 Connect to MongoDB
        await connectDB();

        // 2 Parse and validate body
        const body = await req.json();
        const parsedField = SignUpSchemaWithRole.safeParse(body);

        if (!parsedField.success) {
            return NextResponse.json(
                { success: false, error: parsedField.error.format() },
                { status: 400 }
            );
        }

        const { name, email, phone, designation, department, year, secretCode, password } =
            parsedField.data;

        // 3 Check if email already exists
        const existingUser = await SignUpModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Email already registered" },
                { status: 400 }
            );
        }

        // 4 Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // 5 Set role automatically
        const role = secretCode === process.env.ADMIN_SECRET ? "admin" : "student";

        // 6 Save user in MongoDB
        const newUser = new SignUpModel({
            name,
            email,
            phone,
            designation,
            department,
            year,
            secretCode,
            password: hashPassword,
            role,
        });

        await newUser.save();

        // 7 Success response
        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                data: newUser,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Internal Server Error...", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
