import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function StudentDashboardPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/login");

    

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string; id: string };
        if (decoded.role !== "student") {
            redirect("/admin/dashboard");
        }

        // ✅ fetch student-specific data here if needed

    } catch {
        redirect("/login");
    }

    return (
        <section className="min-h-screen mt-24 w-full flex flex-col bg-white">
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, Student!</h1>
                <p className="text-gray-600 leading-relaxed">
                    Check available college events and register to participate.
                </p>

                {/* Add summary cards here */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-blue-800">Total Events</h3>
                        <p className="text-3xl font-bold text-blue-700 mt-2">{/* totalEvents */}</p>
                    </div>

                    <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                        <h3 className="text-lg font-semibold text-green-800">Registered Events</h3>
                        <p className="text-3xl font-bold text-green-700 mt-2">{/* registeredEvents */}</p>
                    </div>
                </div>

            </main>
        </section>
    );
}


