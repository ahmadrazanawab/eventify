"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCalendar, FiUsers, FiFileText, FiSpeaker, FiBarChart2, FiSettings, FiStar } from "react-icons/fi";

export const AdminSidebar = () => {
    const pathname = usePathname();

    // Helper function to check if the link is active
    const isActive = (href: string) => pathname === href;

    return (
        <aside className="fixed top-0 left-0 mt-20 h-screen w-64 bg-white border-r border-gray-200/80">
            <div className="h-full flex flex-col">
                <div className="px-4 py-4 border-b border-gray-200/70">
                    <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                    <p className="text-xs text-gray-500">Manage events and users</p>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1 text-sm">
                        <li>
                            <Link
                                href="/admin/dashboard"
                                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors border ${isActive("/admin/dashboard") ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50 border-transparent"}`}
                            >
                                <FiHome size={18} />
                                <span>Overview</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/dashboard/events"
                                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors border ${isActive("/admin/dashboard/events") ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50 border-transparent"}`}
                            >
                                <FiCalendar size={18} />
                                <span>Event Management</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/dashboard/users"
                                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors border ${isActive("/admin/dashboard/users") ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50 border-transparent"}`}
                            >
                                <FiUsers size={18} />
                                <span>User Management</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/dashboard/registrations"
                                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors border ${isActive("/admin/dashboard/registrations") ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50 border-transparent"}`}
                            >
                                <FiFileText size={18} />
                                <span>Registrations</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/dashboard/announcements"
                                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors border ${isActive("/admin/dashboard/announcements") ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50 border-transparent"}`}
                            >
                                <FiSpeaker size={18} />
                                <span>Announcements</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/dashboard/reports"
                                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors border ${isActive("/admin/dashboard/reports") ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50 border-transparent"}`}
                            >
                                <FiBarChart2 size={18} />
                                <span>Reports</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/dashboard/settings"
                                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors border ${isActive("/admin/dashboard/settings") ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50 border-transparent"}`}
                            >
                                <FiSettings size={18} />
                                <span>Settings</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/dashboard/feedback"
                                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors border ${isActive("/admin/dashboard/feedback") ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50 border-transparent"}`}
                            >
                                <FiStar size={18} />
                                <span>Feedback</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};


