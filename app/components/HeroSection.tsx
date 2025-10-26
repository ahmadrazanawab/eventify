"use client";
import React from "react";
import Image from "next/image";
import hero from "@/app/assist/hero5.jpg";

const HeroSection = () => {
    return (
        <div className="mt-20 pt-2">
            {/* Hero Image with Overlay */}
            <div className="relative  w-full h-[70vh] sm:h-[60vh] xs:h-[50vh]">
                <Image
                    src={hero}
                    fill
                    priority
                    alt="College Events Hero"
                    className="object-cover brightness-75"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center px-4">
                        Empower Your Campus Events with Ease
                    </h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col w-full items-center mb-10 px-4 sm:px-8 text-center">
                <h4 className="text-[#0071BC] text-2xl sm:text-3xl md:text-4xl font-semibold my-6">
                    P. A. Inamdar University Event Management System
                </h4>

                <p className="text-base sm:text-lg font-sans max-w-4xl leading-relaxed">
                P. A. Inamdar University is a vibrant hub of academic, social, and cultural activities. 
                With numerous events, workshops, and programs held across the campus, an efficient 
                event management system helps streamline coordination and create memorable experiences 
                for students and faculty alike.
                </p>

            <p className="text-base sm:text-lg font-sans max-w-4xl leading-relaxed mt-3">
            The P. A. Inamdar University Event Management System allows easy scheduling, registration, 
            and tracking of all campus events in one centralized platform — making event planning 
            simpler, faster, and more organized.
            </p>

            <p className="text-base sm:text-lg font-sans max-w-4xl leading-relaxed mt-3">
            With this system, the university can avoid double bookings, improve communication between 
            departments, and ensure every event runs smoothly and efficiently.
            </p>

            </div>
        </div>
    );
};

export default HeroSection;

