"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCalendar, FiUsers, FiFileText, FiSpeaker, FiBarChart2, FiSettings, FiStar, FiMenu, FiX } from "react-icons/fi";

export const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // Check if the current view is mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        // Set initial value
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Close sidebar when a link is clicked on mobile
    const handleLinkClick = () => {
        if (isMobile) {
            setIsOpen(false);
        }
    };

    // Helper function to check if the link is active
    const isActive = (href: string) => pathname === href;

    // Navigation items
    const navItems = [
        { href: "/admin/dashboard", icon: <FiHome size={20} />, label: "Overview" },
        { href: "/admin/dashboard/events", icon: <FiCalendar size={20} />, label: "Event Management" },
        { href: "/admin/dashboard/users", icon: <FiUsers size={20} />, label: "User Management" },
        { href: "/admin/dashboard/registrations", icon: <FiFileText size={20} />, label: "Registrations" },
        { href: "/admin/dashboard/announcements", icon: <FiSpeaker size={20} />, label: "Announcements" },
        { href: "/admin/dashboard/reports", icon: <FiBarChart2 size={20} />, label: "Reports" },
        { href: "/admin/dashboard/settings", icon: <FiSettings size={20} />, label: "Settings" },
        { href: "/admin/dashboard/feedback", icon: <FiStar size={20} />, label: "Feedback" },
    ];

    return (
        <>
            {/* Mobile menu button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white lg:hidden"
                aria-label="Toggle menu"
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && isMobile && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed lg:relative
                    w-64 h-screen
                    transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                    transition-transform duration-300 ease-in-out
                    mt-16 lg:mt-20
                    top-0 left-0
                    bg-gray-100 border-r border-gray-300 p-5
                    z-40 overflow-y-auto
                `}
            >
                <h2 className="text-xl font-bold mb-5 text-gray-800">Admin Panel</h2>
                <ul className="space-y-3 text-gray-700">
                    {navItems.map((item) => (
                        <li 
                            key={item.href}
                            className={`flex items-center gap-2 p-2 text-md font-semibold font-serif rounded ${
                                isActive(item.href) ? "bg-gray-200" : "hover:bg-gray-100"
                            }`}
                            onClick={handleLinkClick}
                        >
                            {item.icon}
                            <Link href={item.href} className="w-full">
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
};


