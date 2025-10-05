"use client";

import { useState } from "react";
import { EventForm } from "./EventForm";
import { Card } from "@/components/ui/card";

// Simulate logged-in user
const currentUser = {
    email: "admin@college.com",
    role: "admin",
};

export default function CreateEventPage() {
    const [events, setEvents] = useState([
        { id: 1, name: "Coding Workshop", date: "2025-10-10" },
        { id: 2, name: "AI Seminar", date: "2025-10-15" },
    ]);

    const handleCreateEvent = (event: any) => {
        setEvents([...events, event]);
    };

    // Hide dashboard if not admin
    if (currentUser.role !== "admin") {
        return <p className="text-red-500 mt-10 text-center">Access denied</p>;
    }

    return (
        <section className=" p-6 max-w-4xl mx-auto mt-20 flex flex-col gap-6">
            <EventForm onCreate={handleCreateEvent} />

            {/* Display existing events */}
            <div className="flex flex-col gap-3 mt-4">
                <h2 className="text-xl font-bold">Existing Events</h2>
                {events.length === 0 && <p>No events created yet.</p>}
                {events.map((event) => (
                    <Card
                        key={event.id}
                        className="rounded-md p-4 flex justify-between items-center"
                    >
                        <span>{event.name}</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </Card>
                ))}
            </div>
        </section>
    );
}
