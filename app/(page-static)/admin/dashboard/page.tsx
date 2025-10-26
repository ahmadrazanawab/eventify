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
    return (
        <section className="min-h-screen mt-24 w-full flex flex-col bg-white">
            {/* ✅ Use existing Navbar */}
            {/* <NavbarWrapper /> */}

            <div className="flex flex-1">
                {/* Sidebar */}
                {/* <AdminSidebar /> */}

                {/* Main Dashboard Area */}
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome, Admin!</h1>
                    <p className="text-gray-600 leading-relaxed">
                        Manage university events, users, and reports efficiently using your admin tools.
                    </p>

                    {/* Dashboard Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                            <h3 className="text-lg font-semibold text-blue-800">Total Events</h3>
                            <p className="text-3xl font-bold text-blue-700 mt-2">12</p>
                        </div>

                        <div className="p-5 bg-green-50 rounded-xl border border-green-100">
                            <h3 className="text-lg font-semibold text-green-800">Upcoming Events</h3>
                            <p className="text-3xl font-bold text-green-700 mt-2">4</p>
                        </div>

                        <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                            <h3 className="text-lg font-semibold text-purple-800">Registered Students</h3>
                            <p className="text-3xl font-bold text-purple-700 mt-2">280</p>
                        </div>
                    </div>
                </main>
            </div>
        </section>
    );
}
