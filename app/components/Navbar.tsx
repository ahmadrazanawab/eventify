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

    //  check token on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get("/api/check-jwt"); // create /api/me to verify token
                setIsAuth(res.data.authenticated);
            } catch (error) {
                setIsAuth(false);
            }
        };
        checkAuth();
    }, []);

    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

    // ✅ logout function
    const logout = async () => {
        try {
            const res = await axios.post("/api/logout");
            if (res.data.success) {
                window.location.href = "/login"; // redirect after logout
            }
        } catch (error) {
            console.log("Logout error:", error);
        }
    };


    return (
        <nav className={cn("fixed top-0 inset-x-0 z-50 bg-white shadow-md", className)}>
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
                {/* Logo */}
                <div className="text-xl font-bold text-blue-600">College Events</div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    <HoveredLink href="/">Home</HoveredLink>

                    <Menu setActive={setActive}>
                        <MenuItem setActive={setActive} active={active} item="Events">
                            <div className="flex flex-col space-y-2 text-sm p-4">
                                <HoveredLink href="/events/workshops">Workshops</HoveredLink>
                                <HoveredLink href="/events/competitions">Competitions</HoveredLink>
                                <HoveredLink href="/events/seminars">Seminars</HoveredLink>
                            </div>
                        </MenuItem>
                    </Menu>

                    <HoveredLink href="/event-register">Registration</HoveredLink>
                    <HoveredLink href="/dashboard">Dashboard</HoveredLink>
                    <HoveredLink href="/about">About Us</HoveredLink>

                    {/* ✅ Conditionally render auth buttons */}
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

                {/* Mobile Menu Button */}
                <button onClick={toggleMobileMenu} className="md:hidden text-2xl">
                    {isMobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="flex flex-col space-y-2 px-4 py-4">
                        <HoveredLink href="/">Home</HoveredLink>
                        <HoveredLink href="/about">About Us</HoveredLink>
                        {isAuth ? (
                            <Button onClick={logout}>Logout</Button>
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




// "use client";

// import React, { useState } from "react";
// import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
// import { cn } from "@/lib/utils";
// import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import axios from "axios";

// export function NavbarWrapper() {
//     return (
//         <div className="relative w-full flex flex-col items-center justify-center">
//             <NavbarInner />
//         </div>
//     );
// }

// function NavbarInner({ className }: { className?: string }) {
//     const [active, setActive] = useState<string | null>(null);
//     const [isMobileOpen, setIsMobileOpen] = useState(false);
//     const [isAuth, setIsAuth] = useState(false);

//     const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
//     const logout = async () => {
//         try {
//             const res = await axios.post("/api/logout");
//             if (res.data.success) {
//                 window.location.href = "/login";
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     return (
//         <nav className={cn("fixed top-0 inset-x-0 z-50 bg-white dark:bg-gray-900 shadow-md", className)}>
//             <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-1">
//                 {/* Logo */}
//                 <div className="text-xl font-bold text-blue-600">College Events</div>

//                 {/* Desktop Menu */}
//                 <div className="hidden md:flex space-x-6 items-center">
//                     <HoveredLink href="/">Home</HoveredLink>

//                     <Menu setActive={setActive}>
//                         <MenuItem setActive={setActive} active={active} item="Events">
//                             <div className="flex flex-col space-y-2 text-sm p-4">
//                                 <HoveredLink href="/events/workshops">Workshops</HoveredLink>
//                                 <HoveredLink href="/events/competitions">Competitions</HoveredLink>
//                                 <HoveredLink href="/events/seminars">Seminars</HoveredLink>
//                             </div>
//                         </MenuItem>

//                         <MenuItem setActive={setActive} active={active} item="Clubs">
//                             <div className="flex flex-col space-y-2 text-sm p-4">
//                                 <HoveredLink href="/clubs/technical">Technical Club</HoveredLink>
//                                 <HoveredLink href="/clubs/cultural">Cultural Club</HoveredLink>
//                                 <HoveredLink href="/clubs/sports">Sports Club</HoveredLink>
//                             </div>
//                         </MenuItem>
//                     </Menu>

//                     <HoveredLink href="/event-register">Registration</HoveredLink>
//                     <HoveredLink href="/create-event">Create Event</HoveredLink>
//                     <HoveredLink href="/dashboard">Dashboard</HoveredLink>
//                     <HoveredLink href="/about">About Us</HoveredLink>
//                     {isAuth ? <Button>Logout</Button>
//                         : (<><Button>
//                             <Link href="/login">Signin</Link>
//                         </Button>
//                             <Button>
//                                 <Link href="/signup">SignUp</Link>
//                             </Button></>)}
//                 </div>

//                 {/* Mobile Menu Button */}
//                 <button
//                     onClick={toggleMobileMenu}
//                     className="md:hidden text-2xl focus:outline-none"
//                 >
//                     {isMobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
//                 </button>
//             </div>

//             {/* Mobile Menu */}
//             {isMobileOpen && (
//                 <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
//                     <div className="flex flex-col space-y-2 px-4 py-4">
//                         <HoveredLink href="/">Home</HoveredLink>

//                         {/* Events Submenu */}
//                         <div className="flex flex-col space-y-1">
//                             <span className="font-semibold text-gray-700 dark:text-gray-200">Events</span>
//                             <HoveredLink href="/events/workshops" className="ml-4">Workshops</HoveredLink>
//                             <HoveredLink href="/events/competitions" className="ml-4">Competitions</HoveredLink>
//                             <HoveredLink href="/events/seminars" className="ml-4">Seminars</HoveredLink>
//                         </div>

//                         {/* Clubs Submenu */}
//                         <div className="flex flex-col space-y-1 mt-2">
//                             <span className="font-semibold text-gray-700 dark:text-gray-200">Clubs</span>
//                             <HoveredLink href="/clubs/technical" className="ml-4">Technical Club</HoveredLink>
//                             <HoveredLink href="/clubs/cultural" className="ml-4">Cultural Club</HoveredLink>
//                             <HoveredLink href="/clubs/sports" className="ml-4">Sports Club</HoveredLink>
//                         </div>

//                         <HoveredLink href="/signup">Registration</HoveredLink>
//                         <HoveredLink href="/dashboard">Dashboard</HoveredLink>
//                         <HoveredLink href="/about">About Us</HoveredLink>
//                         <Button>Logout</Button>
//                     </div>
//                 </div>
//             )}
//         </nav>
//     );
// }
