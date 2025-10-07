"use client";

import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem } from "@/components/ui/navbar-menu";
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
    const [userRole, setUserRole] = useState<string | null>(null); // ✅ added role state

    // check token + role on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("/api/check-jwt");
                setIsAuth(res.data.authenticated);
                setUserRole(res.data.user?.role || null); // ✅ get role from JWT
            } catch (error) {
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
        <nav className={cn("fixed top-0 inset-x-0 z-50 bg-white shadow-md", className)}>
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:py-2 py-8">
                <div className="text-xl font-bold text-blue-600">College Events</div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link href="/">Home</Link>

                    <Menu setActive={setActive}>
                        <MenuItem setActive={setActive} active={active} item="Events">
                            <div className="flex flex-col space-y-2 text-sm p-4">
                                <Link href="/events/workshops">Workshops</Link>
                                <Link href="/events/competitions">Competitions</Link>
                                <Link href="/events/seminars">Seminars</Link>
                            </div>
                        </MenuItem>
                    </Menu>

                    {/* <Link href="/event-register">Registration</Link> */}

                    {/* ✅ show dashboard based on role */}
                    {userRole === "admin" && <Link href="/admin/dashboard">Admin Dashboard</Link>}
                    {userRole === "student" && <Link href="/student/dashboard">Student Dashboard</Link>}

                    <Link href="/about">About Us</Link>

                    {isAuth ? (
                        <Button
                            onClick={logout}
                            className="border border-gray-600 text-white hover:bg-black hover:text-white"
                        >
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button className="border border-gray-600 text-black hover:bg-black hover:text-white">
                                <Link href="/login" className="text-white">Sign In</Link>
                            </Button>
                            <Button className="border border-gray-600 text-black hover:bg-black hover:text-white">
                                <Link href="/signup" className="text-white">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>

                <button onClick={toggleMobileMenu} className="md:hidden text-2xl">
                    {isMobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
                </button>
            </div>

            {isMobileOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="flex flex-col text-lg font-semibold space-y-6 px-4 py-4 items-center">
                        <Link href="/">Home</Link>
                        <Link href="/about">About Us</Link>

                        {/* ✅ same role condition for mobile */}
                        {userRole === "admin" && <Link href="/admin/dashboard">Admin Dashboard</Link>}
                        {userRole === "student" && <Link href="/student/dashboard">Student Dashboard</Link>}

                        {isAuth ? (
                            <Button onClick={logout} className="w-full">Logout</Button>
                        ) : (
                            <>
                                <Button>
                                    <Link href="/login" className="text-white">Sign In</Link>
                                </Button>
                                <Button className="text-white">
                                    <Link href="/signup" className="text-white">Sign Up</Link>
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