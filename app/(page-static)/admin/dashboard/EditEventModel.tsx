"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { CreateEventFormInputs } from "@/app/type/event";

// Simple textarea component
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

interface EventDocument extends CreateEventFormInputs {
  _id: string;
  participants?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface EditEventFormProps {
  event: EventDocument;
  onSuccess: () => void;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

const EditEventForm: React.FC<EditEventFormProps> = ({ event, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormInputs>({
    defaultValues: {
      title: event.title,
      category: event.category,
      date: event.date,
      venue: event.venue,
      description: event.description,
    },
  });

  const [date, setDate] = React.useState<Date | undefined>(
    event.date ? new Date(event.date) : undefined
  );

  useEffect(() => {
    if (event) {
      setValue("title", event.title);
      setValue("category", event.category);
      setValue("date", event.date);
      setValue("venue", event.venue);
      setValue("description", event.description);
      if (event.date) {
        setDate(new Date(event.date));
      }
    }
  }, [event, setValue]);

  const onSubmit = async (data: CreateEventFormInputs) => {
    if (date) {
      data.date = date.toISOString();
    }
    
    try {
      const res = await axios.put<ApiResponse>(
        `/api/create-event/${event._id}`,
        data,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Event updated successfully!");
        onSuccess();
      } else {
        throw new Error(res.data.message || "Failed to update event");
      }
    } catch (error) {
      const err = error as AxiosError<ApiResponse>;
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update event");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          placeholder="Enter event title"
          {...register("title", { required: "Title is required" })}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register("category", { required: "Category is required" })}
            className={`w-full p-2 border rounded-md ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a category</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="conference">Conference</option>
            <option value="hackathon">Hackathon</option>
            <option value="meetup">Meetup</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="text-sm text-red-500 mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="venue">Venue</Label>
        <Input
          id="venue"
          placeholder="Enter venue"
          {...register("venue", { required: "Venue is required" })}
          className={errors.venue ? "border-red-500" : ""}
        />
        {errors.venue && (
          <p className="text-sm text-red-500 mt-1">{errors.venue.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter event description"
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 20,
              message: "Description must be at least 20 characters",
            },
          })}
          rows={4}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditEventForm;
