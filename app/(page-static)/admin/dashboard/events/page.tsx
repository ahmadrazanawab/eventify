"use client";
import React, { useEffect, useState } from "react";
import CreateEventForm from "./EventModel";
import axios from "axios";
import { CreateEventFormInputs } from "@/app/type/event";
import { Loder } from "@/app/components/Loder";


// type Event = {
//     id: string;
//     title: string;
//     date: string;
//     category: string;
//     participants: number;
// };




export default function AdminEventsPage() {
    // ✅ Hooks must be inside the component
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [event, setEvent] = useState<CreateEventFormInputs[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSuccess = () => {
        closeModal();
        // TODO: Refresh event list here if needed
    };

    const getEvent = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/create-event/[id]");
            console.log(res.data);
            setEvent(res.data?.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        getEvent();
    }, []);

    return (
        <section className="w-full min-h-screen mt-24">
            <h1 className="text-3xl font-bold mb-6">Event Management</h1>

            <button onClick={openModal} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer ">
                + Create New Event
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-200 backdrop-blur-md bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-lg font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Create Event</h2>
                        <CreateEventForm onSuccess={handleSuccess} />
                    </div>
                </div>
            )}

            <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Event Name</th>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Category</th>
                        <th className="border px-4 py-2">Venue</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <div className="flex w-[80vw] mt-20 justify-center mb-5"><Loder/></div>: event.map((event, idx) => (
                        <tr key={idx}>
                            <td className="border px-4 py-2">{event.title}</td>
                            <td className="border px-4 py-2">{event.date}</td>
                            <td className="border px-4 py-2">{event.category}</td>
                            <td className="border px-4 py-2">{event.venue}</td>
                            <td className="border px-4 py-2">{event.description}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                    Edit
                                </button>
                                <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
