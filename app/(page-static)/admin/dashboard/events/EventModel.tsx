"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import { CreateEventFormInputs } from "@/app/type/event";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Building2, FileText, IndianRupee, Tag } from "lucide-react";

interface CreateEventFormProps {
    onSuccess: () => void;
    onCancel?: () => void;
    // event: CreateEventFormInputs[];
    // setEvent: React.Dispatch<React.SetStateAction<CreateEventFormInputs[]>>;
}

interface CreateEventResponse {
    success: boolean;
    message?: string;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onSuccess, onCancel }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateEventFormInputs>();

    const paymentRequired = watch("paymentRequired", false);

    const onSubmit = async (data: CreateEventFormInputs) => {
        try {
            if (data.paymentRequired && (!data.fee || data.fee <= 0)) {
                alert("Please provide a valid fee for paid events.");
                return;
            }
            const res = await axios.post<CreateEventResponse>("/api/create-event", data, {
                withCredentials: true, // send JWT cookie
            });

            if (res.data.success) {
                alert("Event created successfully!");
                reset();
                onSuccess();
                window.location.href = "/admin/dashboard/events";
            } else {
                alert(res.data.message || "Failed to create event");
            }
        } catch (error) {
            const err = error as AxiosError<CreateEventResponse>;
            console.error(err);
            alert(err.response?.data?.message || "Failed to create event");
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <Card>
                <CardHeader className="border-b">
                    <CardTitle className="text-2xl">Create Event</CardTitle>
                    <CardDescription>Publish a new event with details, schedule, venue and optional fee.</CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title" className="flex items-center gap-2"><Tag className="h-4 w-4"/> Event Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Hackathon 2025"
                                    {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="category" className="flex items-center gap-2"><Tag className="h-4 w-4"/> Category</Label>
                                <Input
                                    id="category"
                                    placeholder="Technical, Cultural, Sports"
                                    {...register("category", { required: "Category is required" })}
                                />
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="date" className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    {...register("date", { required: "Date is required" })}
                                />
                                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="time" className="flex items-center gap-2"><Clock className="h-4 w-4"/> Time</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    {...register("time", { required: "Time is required" })}
                                />
                                {errors.time && (
                                    <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="location" className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Location</Label>
                                <Input
                                    id="location"
                                    placeholder="City / Campus / Location"
                                    {...register("location", { required: "Location is required" })}
                                />
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="venue" className="flex items-center gap-2"><Building2 className="h-4 w-4"/> Venue</Label>
                                <Input
                                    id="venue"
                                    placeholder="Auditorium / Hall name"
                                    {...register("venue", { required: "Venue is required" })}
                                />
                                {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue.message}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description" className="flex items-center gap-2"><FileText className="h-4 w-4"/> Description</Label>
                            <textarea
                                id="description"
                                placeholder="Tell participants what this event is about..."
                                {...register("description", { required: "Description is required" })}
                                className="border p-3 rounded-lg w-full min-h-28 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="maxParticipants">Max participants</Label>
                                <Input
                                    id="maxParticipants"
                                    type="number"
                                    min={0}
                                    placeholder="e.g., 200"
                                    {...register("maxParticipants", { valueAsNumber: true })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    placeholder="https://..."
                                    {...register("image")}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                defaultValue="published"
                                {...register("status")}
                                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="rounded-lg border p-4 bg-white/50">
                            <div className="flex items-center gap-2">
                                <input id="paymentRequired" type="checkbox" {...register("paymentRequired")} className="h-4 w-4" />
                                <Label htmlFor="paymentRequired">Payment required?</Label>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Enable this if participants must pay a fee to register.</p>

                            <div className="mt-3 max-w-xs">
                                <Label htmlFor="fee" className="flex items-center gap-2"><IndianRupee className="h-4 w-4"/> Fee</Label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <Input
                                        id="fee"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-7"
                                        {...register("fee", { valueAsNumber: true })}
                                        disabled={!paymentRequired}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Leave as 0 for free events.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? "Creating..." : "Create Event"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    reset();
                                    onCancel?.();
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="border-t"></CardFooter>
            </Card>
        </div>
    );
};

export default CreateEventForm;
