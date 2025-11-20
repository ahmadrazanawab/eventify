"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FiHome, FiCalendar, FiList, FiUser, FiHelpCircle, FiMessageSquare } from "react-icons/fi";

export const StudentSidebar = () => {
    const pathname = usePathname();
    

    // Helper function to check if the link is active
    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    

    return (
        <aside className="w-64 h-screen fixed mt-20 top-0 left-0 bg-white/85 backdrop-blur border-r border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Student Panel</h2>
                <p className="text-xs text-gray-500">Quick navigation</p>
            </div>
            <nav className="p-4">
                <ul className="space-y-2 text-sm">
                    <li>
                        <Link
                            href="/student/dashboard"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
                                isActive("/student/dashboard")
                                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <FiHome size={18} />
                            <span className="font-medium">Overview</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/student/dashboard/student-register-event"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
                                isActive("/student/dashboard/student-register-event")
                                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <FiCalendar size={18} />
                            <span className="font-medium">Register Event</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/student/dashboard/registrations"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
                                isActive("/student/dashboard/registrations")
                                    ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <FiList size={18} />
                            <span className="font-medium">My Registrations</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/student/dashboard/profile"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
                                isActive("/student/dashboard/profile")
                                    ? "bg-purple-50 text-purple-700 ring-1 ring-purple-200"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <FiUser size={18} />
                            <span className="font-medium">My Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/student/dashboard/feedback"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
                                isActive("/student/dashboard/feedback")
                                    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <FiMessageSquare size={18} />
                            <span className="font-medium">Feedback</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/student/dashboard/help"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
                                isActive("/student/dashboard/help")
                                    ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <FiHelpCircle size={18} />
                            <span className="font-medium">Help / Support</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};
