export interface Attendee {
    _id: string;
    name: string;
    email: string;
}

export interface CreateEventFormInputs {
    _id: string;
    title: string;
    category: string;
    description: string;
    date: string | Date;
    time: string;
    location: string;
    venue: string;
    maxParticipants?: number;
    attendees?: Attendee[];
    image?: string;
    status?: 'draft' | 'published' | 'cancelled';
    paymentRequired?: boolean;
    fee?: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    createdBy?: string; // admin user ID who created the event
}
