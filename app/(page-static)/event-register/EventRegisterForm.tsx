"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const eventsList = [
    "Workshop on AI",
    "Coding Competition",
    "Seminar on Design",
    "Cultural Event",
    "Sports Meet",
];

export function EventRegistrationCard() {
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        year: "",
    });

    // Handle checkbox selection
    const handleEventChange = (eventName: string) => {
        if (selectedEvents.includes(eventName)) {
            setSelectedEvents(selectedEvents.filter((e) => e !== eventName));
        } else {
            setSelectedEvents([...selectedEvents, eventName]);
        }
    };

    // Handle input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedEvents.length === 0) {
            alert("Please select at least one event to register.");
            return;
        }
        console.log("Student Info:", formData);
        console.log("Selected Events:", selectedEvents);
        alert("Registration submitted successfully!");
    };

    return (
        <section className="flex justify-center mt-10 px-4 pb-5">
            <Card className="w-full max-w-md rounded-lg shadow-md overflow-hidden">
                <CardHeader className="flex flex-col">
                    <CardTitle>Event Registration</CardTitle>
                    <CardDescription>
                        Fill your details and select events to participate
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Student Info */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="rounded-md"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="rounded-md"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                type="text"
                                placeholder="e.g. Computer Science"
                                value={formData.department}
                                onChange={handleInputChange}
                                required
                                className="rounded-md"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="number"
                                placeholder="e.g. 3"
                                value={formData.year}
                                onChange={handleInputChange}
                                required
                                className="rounded-md"
                            />
                        </div>

                        {/* Event Selection */}
                        <div className="flex flex-col gap-2">
                            <Label>Select Events</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {eventsList.map((event) => (
                                    <label
                                        key={event}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            value={event}
                                            checked={selectedEvents.includes(event)}
                                            onChange={() => handleEventChange(event)}
                                            className="rounded-md accent-blue-600"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {event}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full rounded-md"
                    >
                        Register
                    </Button>
                    <Button variant="outline" className="w-full rounded-md">
                        Clear Selection
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
}

