// app/student/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function StudentDashboardPage() {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) redirect("/login");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

        // ✅ if not student, redirect
        if (decoded.role !== "student") {
            redirect("/admin/dashboard");
        }
    } catch {
        redirect("/login");
    }

    return <div className="min-h-screen flex flex-col justify-center items-center">
        <h4 className="text-4xl font-semibold text-center">Welcome to Student Dashboard</h4>
         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ut facilis sit.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, ipsum tenetur.</p>
    </div>;
}
