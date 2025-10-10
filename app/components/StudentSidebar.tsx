"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";

import { FiHome, FiCalendar, FiUsers, FiFileText, FiSpeaker, FiBarChart2, FiSettings, FiStar } from "react-icons/fi";

export const StudentSidebar = () => {
    const pathname = usePathname();
    

    // Helper function to check if the link is active
    const isActive = (href: string) => pathname === href;

    

    return (
        <aside className="w-64 h-screen fixed mt-20 top-0 left-0 bg-gray-100 border-r border-gray-300 p-5">
            <h2 className="text-xl font-bold mb-5 text-gray-800">Student Panel</h2>
            <ul className="space-y-3 text-gray-700">
                <li className={`flex items-center gap-2 p-2 text-md font-semibold font-serif rounded ${isActive("/admin/dashboard") ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                    <FiHome size={20} />
                    <Link href="/student/dashboard">Overview</Link>
                </li>
                <li className={`flex items-center gap-2 p-2 text-md font-semibold font-serif rounded ${isActive("/admin/dashboard/events") ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                    <FiCalendar size={20} />
                    <Link href="/student/dashboard/student-register-event">Register Event</Link>
                </li>
                <li className={`flex items-center gap-2 p-2 text-md font-semibold font-serif rounded ${isActive("/admin/dashboard/users") ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                    <FiUsers size={20} />
                    <Link href="/student/dashboard/users">User Management</Link>
                </li>
                <li className={`flex items-center gap-2 p-2 text-md font-semibold font-serif rounded ${isActive("/admin/dashboard/registrations") ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                    <FiFileText size={20} />
                    <Link href="/student/dashboard/registrations">Registrations</Link>
                </li>
                <li className={`flex items-center gap-2 p-2 text-md font-semibold font-serif rounded ${isActive("/admin/dashboard/announcements") ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                    <FiSpeaker size={20} />
                    <Link href="/student/dashboard/announcements">Announcements</Link>
                </li>
                <li className={`flex items-center gap-2 p-2 text-md font-semibold font-serif rounded ${isActive("/admin/dashboard/reports") ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                    <FiBarChart2 size={20} />
                    <Link href="/student/dashboard/reports">Reports</Link>
                </li>
                <li className={`flex items-center gap-2 p-2 text-md font-semibold font-serif rounded ${isActive("/admin/dashboard/settings") ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                    <FiSettings size={20} />
                    <Link href="/student/dashboard/settings">Settings</Link>
                </li>
                <li className={`flex items-center gap-2 p-2 text-md font-semibold font-serif rounded ${isActive("/admin/dashboard/feedback") ? "bg-gray-200" : "hover:bg-gray-100"}`}>
                    <FiStar size={20} />
                    <Link href="/student/dashboard/feedback">Feedback</Link>
                </li>
            </ul>
        </aside>
    );
};


