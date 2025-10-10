// app/admin/dashboard/layout.tsx
import React from "react";
import { StudentSidebar } from "@/app/components/StudentSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;

    if (!token) redirect("/login");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
        if (decoded.role !== "student") redirect("/admin/dashboard");
    } catch {
        redirect("/login");
    }

    return (
        <div className="flex">
            <StudentSidebar />
            <main className="flex-1 p-8 ml-64 bg-white">{children}</main>
        </div>
    );
}