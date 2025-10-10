// app/admin/dashboard/layout.tsx
import React from "react";
import { AdminSidebar } from "@/app/components/AdminSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) redirect("/login");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
        if (decoded.role !== "admin") redirect("/student/dashboard");
    } catch {
        redirect("/login");
    }

    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-8 ml-64 bg-white">{children}</main>
        </div>
    );
}



// import React from "react";
// import { AdminSidebar } from "@/app/components/AdminSidebar";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import jwt from "jsonwebtoken";


// export async function  AdminLayout({ children }: { children: React.ReactNode }) {
//     const cookiesStore = await cookies();
//     const token = cookiesStore.get("token")?.value;

//     if (!token) redirect("/login");

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
//         if (decoded.role !== "admin") redirect("/student/dashboard");
//     } catch {
//         redirect("/login");
//     }
//     return (
//         <div className="flex">
//             <AdminSidebar />
//             <main className="flex-1 p-8 ml-52 bg-white">{children}</main>
//         </div>
//     );
// }
