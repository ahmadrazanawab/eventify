"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loder } from "@/app/components/Loder";

type Event = {
    _id: string;
    title: string;
    date: string;
    category: string;
    venue: string;
    description: string;
};

type Student = {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    year: string;
};

type RegistrationFormInputs = {
    eventFees?: number;
};

interface CreateEventResponse {
    success: boolean;
    message?: string;
}

export default function StudentEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [student, setStudent] = useState<Student | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset } = useForm<RegistrationFormInputs>();

    // Fetch events
    const getEvents = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/create-event", { withCredentials: true });
            console.log("Events:", res.data?.data);
            setEvents(res.data.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch events error:", err);
            setLoading(false);
        }
    };

    // Fetch student
    const getStudent = async () => {
        try {
            const res = await axios.get("/api/student/me", { withCredentials: true });
            console.log("Student:", res.data.student);
            if (res.data.success) setStudent(res.data.student);
        } catch (err) {
            console.error("Fetch student error:", err);
        }
    };

    useEffect(() => {
        getEvents();
        getStudent();
    }, []);

    const openModal = (event: Event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const onSubmit = async (data: RegistrationFormInputs) => {
        if (!selectedEvent || !student) return;

        try {
            const res = await axios.post(
                "/api/student-register-event",
                {
                    ...data,
                    name: student.name,
                    email: student.email,
                    phone: student.phone,
                    department: student.department,
                    year: student.year,
                    event: selectedEvent._id,
                },
                { withCredentials: true }
            );

            if (res.data.success) {
                alert("Successfully registered!");
                reset();
                closeModal();
            } else {
                alert(res.data.message || "Registration failed");
            }
        } catch (error) {
            const err = error as AxiosError<CreateEventResponse>;
            console.error("Registration error:", err);
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <section className="w-full min-h-screen mt-24 p-4">
            <h1 className="text-3xl font-bold mb-6">Available Events</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? <div className="flex w-[100vw] justify-center mt-20"><Loder /></div> : events.map((event) => (
                    <div key={event._id} className="border p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{event.title}</h2>
                        <p className="text-gray-600">{event.date} | {event.category}</p>
                        <p className="text-gray-600">{event.venue}</p>
                        <p className="text-gray-700 mt-2">{event.description}</p>
                        <Button className="mt-4 w-full" onClick={() => openModal(event)}>
                            Register
                        </Button>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedEvent && student && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                        <button className="absolute top-2 right-2 text-lg font-bold" onClick={closeModal}>
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">
                            Register for: {selectedEvent.title}
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input value={student.name} readOnly />
                            <Input value={student.email} readOnly />
                            <Input value={student.phone} readOnly />
                            <Input value={student.department} readOnly />
                            <Input value={student.year} readOnly />
                            <Input type="number" placeholder="Event Fees (optional)" {...register("eventFees")} />
                            <Button type="submit" className="w-full">Submit Registration</Button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}




