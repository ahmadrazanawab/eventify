
"use client";
import React, { useEffect } from "react";
import { CreateEventFormInputs } from "@/app/type/event";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EditEventFormProps {
    isModalOpen: boolean;
    event: CreateEventFormInputs;
    onClosed: () => void;
    onSave: (updatedEvent: CreateEventFormInputs) => void;
}

const EventEditModel: React.FC<EditEventFormProps> = ({ isModalOpen, event, onClosed, onSave }) => {
    const { register, handleSubmit, reset } = useForm<CreateEventFormInputs>({
        defaultValues: event
    });

    // Reset form when event changes
    useEffect(() => {
        reset(event);
    }, [event, reset]);

    const handleFormSubmit = (data: CreateEventFormInputs) => {
        onSave({ ...event, ...data }); // merge with original _id
        onClosed();
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-200 backdrop-blur-md bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                <button
                    onClick={onClosed}
                    className="absolute top-2 right-2 text-lg font-bold"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Event Title</Label>
                        <Input {...register("title", { required: true })} id="title" />
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input {...register("category", { required: true })} id="category" />
                    </div>
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input {...register("date", { required: true })} type="date" id="date" />
                    </div>
                    <div>
                        <Label htmlFor="venue">Venue</Label>
                        <Input {...register("venue", { required: true })} id="venue" />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea {...register("description", { required: true })} id="description" className="border p-2 rounded w-full" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClosed} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save
                        </button>
                    </div>
                </form>
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
