"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export function EventForm({ onCreate }: { onCreate: (event: any) => void }) {
  const [newEvent, setNewEvent] = useState({ name: "", date: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({ ...newEvent, [e.target.id]: e.target.value });
  };

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.date) return alert("Fill all fields");
    onCreate({ ...newEvent, id: Date.now() });
    setNewEvent({ name: "", date: "" });
  };

  return (
    <Card className="rounded-lg shadow-md overflow-hidden">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            placeholder="Enter event name"
            value={newEvent.name}
            onChange={handleInputChange}
            className="rounded-md"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Event Date</Label>
          <Input
            id="date"
            type="date"
            value={newEvent.date}
            onChange={handleInputChange}
            className="rounded-md"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateEvent} className="w-full rounded-md">
          Create Event
        </Button>
      </CardFooter>
    </Card>
  );
}
