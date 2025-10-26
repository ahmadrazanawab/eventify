<<<<<<< HEAD
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";


export default async function AdminDashboardPage() {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) redirect("/login"); // Not logged in

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

        // ✅ Redirect non-admin users
        if (decoded.role !== "admin") {
            redirect("/student/dashboard");
        }
    } catch {
        redirect("/login");
    }
// this is access privious code
=======
import DashboardStats from "./dashboard-stats";
// d491ffae14658d42f28af634aabb744393926c52
export default function AdminDashboardPage() {
>>>>>>> ef4de99ea469edeb9f9faae45056dc4dd4510d8b
    return (
        <div className="space-y-6 mt-20">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome, Admin</h1>
                <p className="text-sm text-muted-foreground">
                    Manage and monitor your events, users, and system settings from one place.
                </p>
            </div>
            <DashboardStats />
        </div>
    );
}
