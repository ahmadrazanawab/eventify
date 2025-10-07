// app/admin/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function AdminDashboardPage() {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) redirect("/login"); // Not logged in

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

        // ✅ if not admin, redirect
        if (decoded.role !== "admin") {
            redirect("/student/dashboard");
        }
    } catch {
        redirect("/login");
    }

    return <section className="min-h-screen w-full flex flex-col justify-center items-center">
        <h4 className="text-4xl font-semibold text-center">Welcome to Admin Dashboard</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ut facilis sit.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, ipsum tenetur.</p>
    </section>;
}
