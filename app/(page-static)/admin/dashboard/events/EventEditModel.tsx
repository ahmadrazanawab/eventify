
"use client";
import React, { useEffect } from "react";
import { CreateEventFormInputs } from "@/app/type/event";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Building2, FileText, IndianRupee, Tag } from "lucide-react";

interface EditEventFormProps {
    isModalOpen: boolean;
    event: CreateEventFormInputs;
    onClosed: () => void;
    onSave: (updatedEvent: CreateEventFormInputs) => void;
}

const EventEditModel: React.FC<EditEventFormProps> = ({ isModalOpen, event, onClosed, onSave }) => {
    const { register, handleSubmit, reset, watch } = useForm<CreateEventFormInputs>({
        defaultValues: event
    });

    const paymentRequired = watch("paymentRequired", !!event.paymentRequired);

    // Reset form when event changes
    useEffect(() => {
        reset(event);
    }, [event, reset]);

    const handleFormSubmit = (data: CreateEventFormInputs) => {
        if (data.paymentRequired && (!data.fee || data.fee <= 0)) {
            alert("Please provide a valid fee for paid events.");
            return;
        }
        onSave({ ...event, ...data }); // merge with original _id
        onClosed();
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm z-50">
            <div className="w-full max-w-xl h-full overflow-y-auto relative px-4 sm:px-0">
                <button
                    onClick={onClosed}
                    className="absolute top-3 right-3 text-2xl font-bold text-gray-700 hover:text-gray-900"
                    aria-label="Close"
                >
                    &times;
                </button>
                <Card className="my-6">
                    <CardHeader className="border-b">
                        <CardTitle className="text-2xl">Edit Event</CardTitle>
                        <CardDescription>Update event details, schedule, venue and optional fee.</CardDescription>
                    </CardHeader>
                    <CardContent className="py-6">
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="title" className="flex items-center gap-2"><Tag className="h-4 w-4"/> Event Title</Label>
                                    <Input id="title" placeholder="e.g. Hackathon 2025" {...register("title", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="category" className="flex items-center gap-2"><Tag className="h-4 w-4"/> Category</Label>
                                    <Input id="category" placeholder="Technical, Cultural, Sports" {...register("category", { required: true })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="date" className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Date</Label>
                                    <Input id="date" type="date" {...register("date", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="time" className="flex items-center gap-2"><Clock className="h-4 w-4"/> Time</Label>
                                    <Input id="time" type="time" {...register("time", { required: true })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="location" className="flex items-center gap-2"><MapPin className="h-4 w-4"/> Location</Label>
                                    <Input id="location" placeholder="City / Campus / Location" {...register("location", { required: true })} />
                                </div>
                                <div>
                                    <Label htmlFor="venue" className="flex items-center gap-2"><Building2 className="h-4 w-4"/> Venue</Label>
                                    <Input id="venue" placeholder="Auditorium / Hall name" {...register("venue", { required: true })} />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description" className="flex items-center gap-2"><FileText className="h-4 w-4"/> Description</Label>
                                <textarea
                                    id="description"
                                    placeholder="Describe the event..."
                                    {...register("description", { required: true })}
                                    className="border p-3 rounded-lg w-full min-h-28 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
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
                                <Button type="button" variant="outline" className="w-full" onClick={onClosed}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="w-full">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="border-t"></CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default EventEditModel;



// "use client";
// import React from "react";
// import { CreateEventFormInputs } from "@/app/type/event";
// import { useForm } from "react-hook-form";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// interface EditEventFormProps {
//     isModalOpen: boolean;
//     event: CreateEventFormInputs; // single event object
//     onClosed: () => void;         // function to close modal
//     onSave: () => void;           // function to save changes
// }

// const EventEditModel: React.FC<EditEventFormProps> = ({ isModalOpen, event, onClosed, onSave }) => {

//     const { register, reset, handleSubmit, formState: { errors } } = useForm({ defaultValues: event });
//     const handleSave = (data: CreateEventFormInputs) => {
//         onSave({ ...event, ...data });
//         reset();
//         onClosed();
//     }
//     if (!isModalOpen) return null;
// };
// return (
//     <div className="fixed inset-0 flex justify-center items-center bg-gray-200 backdrop-blur-md bg-opacity-50 z-50">
//         <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
//             <button
//                 onClick={onClosed}
//                 className="absolute top-2 right-2 text-lg font-bold"
//             >
//                 &times;
//             </button>
//             <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
//             <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
//                 <div>
//                     <Label htmlFor="title">Event Title</Label>
//                     <Input
//                         id="title"
//                         placeholder="Enter event title"
//                         {...register("title", { required: "Title is required" })}
//                     />
//                 </div>

//                 <div>
//                     <Label htmlFor="category">Category</Label>
//                     <Input
//                         id="category"
//                         placeholder="e.g. Technical, Cultural, Sports"
//                         {...register("category", { required: "Category is required" })}
//                     />

//                 </div>

//                 <div>
//                     <Label htmlFor="date">Date</Label>
//                     <Input
//                         id="date"
//                         type="date"
//                         {...register("date", { required: "Date is required" })}
//                     />

//                 </div>

//                 <div>
//                     <Label htmlFor="venue">Venue</Label>
//                     <Input
//                         id="venue"
//                         placeholder="Enter venue"
//                         {...register("venue", { required: "Venue is required" })}
//                     />

//                 </div>

//                 <div>
//                     <Label htmlFor="description">Description</Label>
//                     <textarea
//                         id="description"
//                         placeholder="Enter event description"
//                         {...register("description", { required: "Description is required" })}
//                         className="border p-2 rounded w-full"
//                     />

//                 </div>
//                 <button
//                     type="button"
//                     onClick={onClosed}
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                     cancle
//                 </button>
//                 <button
//                     type="submit"
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                     Save
//                 </button>

//             </form>

//         </div>
//     </div>
// );
// };

// export default EventEditModel;
