"use client";
import React, { useEffect, useState } from "react";
import CreateEventForm from "./EventModel";
import axios from "axios";
import { CreateEventFormInputs } from "@/app/type/event";
import { Loder } from "@/app/components/Loder";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import EditEventForm from "./EditEventModel";

type Event = CreateEventFormInputs & {
    _id: string;
    createdAt: string;
    updatedAt: string;
    participants?: any[]; // or define a proper Participant type if available
};

export default function AdminEventsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);
    const openEditModal = (event: Event) => {
        setSelectedEvent(event);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setSelectedEvent(null);
        setIsEditModalOpen(false);
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/create-event/all");
            if (res.data.success) {
                setEvents(Array.isArray(res.data.data) ? res.data.data : []);
            } else {
                throw new Error(res.data.message || "Failed to fetch events");
            }
        } catch (error: any) {
            console.error("Error fetching events:", error);
            toast.error(error.response?.data?.message || "Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSuccess = () => {
        closeCreateModal();
        closeEditModal();
        fetchEvents();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const res = await axios.delete(`/api/create-event/${id}`);
            if (res.data.success) {
                toast.success("Event deleted successfully");
                fetchEvents();
            } else {
                throw new Error(res.data.message || "Failed to delete event");
            }
        } catch (error: any) {
            console.error("Error deleting event:", error);
            toast.error(error.response?.data?.message || "Failed to delete event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 mt-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Events Management</h1>
                <Button onClick={openCreateModal}>
                    Create New Event
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <Loder />
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                        No events found. Create your first event!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Venue
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Participants
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {events.map((event) => (
                                    <tr key={event._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                            <div className="text-xs text-gray-500">
                                                Created: {format(new Date(event.createdAt), 'MMM d, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {format(new Date(event.date), 'MMM d, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {event.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {event.venue}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {event.participants?.length || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditModal(event)}
                                                    className="text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(event._id)}
                                                    className="text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Create New Event</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={closeCreateModal}
                                className="h-8 w-8 p-0"
                            >
                                ✕
                            </Button>
                        </div>
                        <CreateEventForm onSuccess={handleSuccess} />
                    </div>
                </div>
            )}

            {/* Edit Event Modal */}
            {isEditModalOpen && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Event</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={closeEditModal}
                                className="h-8 w-8 p-0"
                            >
                                ✕
                            </Button>
                        </div>
                        <EditEventForm event={selectedEvent} onSuccess={handleSuccess} />
                    </div>
                </div>
            )}
        </div>
    );
}
