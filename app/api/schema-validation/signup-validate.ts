import { z } from "zod";

const SignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10, "Phone is required"),
    role: z.enum(["student", "admin"]),

    // Optional fields (conditionally required later)
    department: z.string().optional(),
    year: z.union([z.string(), z.number()]).optional(),
    designation: z.string().optional(),
    secretCode: z.string().optional(),
});

// ✅ Conditionally require based on role
const SignUpSchemaWithRole = SignUpSchema.refine(
    (data) => {
        if (data.role === "student") {
            return !!data.department && !!data.year;
        }
        if (data.role === "admin") {
            return !!data.designation && !!data.secretCode;
        }
        return true;
    },
    {
        message: "Missing required fields based on role",
        path: ["role"],
    }
);

export default SignUpSchemaWithRole;
