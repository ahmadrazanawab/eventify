"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import { CreateEventFormInputs } from "@/app/type/event";

interface CreateEventFormProps {
    onSuccess: () => void;
    // event: CreateEventFormInputs[];
    // setEvent: React.Dispatch<React.SetStateAction<CreateEventFormInputs[]>>;
}

interface CreateEventResponse {
    success: boolean;
    message?: string;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateEventFormInputs>();

    const onSubmit = async (data: CreateEventFormInputs) => {
        try {
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
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                        id="title"
                        placeholder="Enter event title"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        placeholder="e.g. Technical, Cultural, Sports"
                        {...register("category", { required: "Category is required" })}
                    />
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>

                <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        {...register("date", { required: "Date is required" })}
                    />
                    {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                </div>

                <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                        id="venue"
                        placeholder="Enter venue"
                        {...register("venue", { required: "Venue is required" })}
                    />
                    {errors.venue && <p className="text-red-500 text-sm">{errors.venue.message}</p>}
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        placeholder="Enter event description"
                        {...register("description", { required: "Description is required" })}
                        className="border p-2 rounded w-full"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
                <Button type="button" className="w-full" onClick={() => reset()}>
                    Cancel
                </Button>
            </form>
        </div>
    );
};

export default CreateEventForm;
