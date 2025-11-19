"use client";

import React, { useState, useEffect } from "react";
import { Menu, MenuItem } from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

export function NavbarWrapper() {
    return (
        <div className="relative w-full flex flex-col items-center justify-center">
            <NavbarInner />
        </div>
    );
}

function NavbarInner({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    // check token + role on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("/api/check-jwt");
                setIsAuth(res.data.authenticated);
                setUserRole(res.data.user?.role || null); // ✅ get role from JWT
            } catch {
                // Handle error silently
                setIsAuth(false);
                setUserRole(null);
            }
        };
        checkAuth();
    }, []);

    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

    const logout = async () => {
        try {
            const res = await axios.post("/api/logout");
            if (res.data.success) {
                window.location.href = "/login";
            }
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    return (
        <nav className={cn("fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200", className)}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                <div className="text-xl font-semibold text-gray-900">College Events</div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">Home</Link>


                    {/* <Link href="/event-register">Registration</Link> */}

                    {/* ✅ show dashboard based on role */}
                    {userRole === "admin" && <Link href="/admin/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">Admin Dashboard</Link>}
                    {userRole === "student" && <Link href="/student/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">Student Dashboard</Link>}

                    <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">About Us</Link>

                    {isAuth ? (
                        <Button
                            onClick={logout}
                            className="border border-gray-300 text-gray-300 hover:bg-gray-900 hover:text-white"
                        >
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button className="border border-gray-300 text-gray-300 hover:bg-gray-900 hover:text-white">
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button className="border border-gray-300 text-gray-300 hover:bg-gray-900 hover:text-white">
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>

                <button onClick={toggleMobileMenu} className="md:hidden text-2xl text-gray-700 hover:text-gray-900">
                    {isMobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
                </button>
            </div>

            {isMobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
                    <div className="flex flex-col text-base font-medium space-y-4 px-4 py-4">
                        <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
                        <Link href="/about" className="text-gray-700 hover:text-gray-900">About Us</Link>

                        {/* ✅ same role condition for mobile */}
                        {userRole === "admin" && <Link href="/admin/dashboard" className="text-gray-700 hover:text-gray-900">Admin Dashboard</Link>}
                        {userRole === "student" && <Link href="/student/dashboard" className="text-gray-700 hover:text-gray-900">Student Dashboard</Link>}

                        {isAuth ? (
                            <Button onClick={logout} className="w-full border border-gray-300 text-gray-300 hover:bg-gray-900 hover:text-white">Logout</Button>
                        ) : (
                            <>
                                <Button className="border border-gray-300 text-gray-300 hover:bg-gray-900 hover:text-white">
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button className="border border-gray-300 text-gray-300 hover:bg-gray-900 hover:text-white">
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export { NavbarInner };