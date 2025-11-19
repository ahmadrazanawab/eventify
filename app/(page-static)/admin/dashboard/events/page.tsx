"use client";

import React, { useEffect, useState } from "react";
import CreateEventForm from "./EventModel";
import EventEditModel from "./EventEditModel"
import axios from "axios";

// Utility function to format date
const formatDate = (dateString: string | Date): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
        ? 'Invalid Date'
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
};
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
    // create event model useState
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Edit Event Model useState
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    const [event, setEvent] = useState<CreateEventFormInputs[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<CreateEventFormInputs | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSuccess = () => {
        closeModal();
        // TODO: Refresh event list here if needed
    };

    const getEvent = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/create-event");
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

    // Replace handleSave with this
    const handleSave = async (updatedEvent: CreateEventFormInputs) => {
        try {
            const res = await axios.put(`/api/create-event/${updatedEvent._id}`, updatedEvent);
            if (res.data.success) {
                // update local state
                setEvent((prev) =>
                    prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
                );
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleDelete = async (id: string) => {
        try {
            const res = await axios.delete(`/api/create-event/${id}`);
            // console.log(res.data.success);
            if (res.data.success === true) {
                alert("Event has been deleted successfully!");
                setEvent((prev) => prev.filter((e) => e._id !== id));
            }
        } catch (error) {
            console.log("Internal server error...", error);
        }
    }

    return (
        <section className="w-full min-h-screen mt-24 px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Event Management</h1>

            <button onClick={openModal} className="mb-4 inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm transition-colors">
                + Create New Event
            </button>

            {/* Create Event Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm z-50">
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


            <div className="w-full h-[70vh] rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="h-full overflow-y-auto overflow-x-auto">
                    <table className="w-full table-auto text-sm">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        <Loder />
                                    </td>
                                </tr>
                            ) : (
                                event.map((event, idx) => (
                                    <tr key={idx} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50`}>
                                        <td className="px-4 py-3 text-gray-700">{event.title}</td>
                                        <td className="px-4 py-3 text-gray-700">{formatDate(event.date)}</td>
                                        <td className="px-4 py-3 text-gray-700">{event.category}</td>
                                        <td className="px-4 py-3 text-gray-700">{event.venue}</td>
                                        <td className="px-4 py-3 text-gray-700">{event.description}</td>
                                        <td className="px-4 py-3 space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event._id)}
                                                className="px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/*Edit Event Modal */}
            {isEditModalOpen && selectedEvent && (
                <EventEditModel
                    isModalOpen={isEditModalOpen}
                    event={selectedEvent}          // ✅ pass the actual event object
                    onClosed={() => setIsEditModalOpen(false)}
                    onSave={handleSave}
                />
            )}

        </section>
    );
}
