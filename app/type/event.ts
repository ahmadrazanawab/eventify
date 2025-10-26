export interface CreateEventFormInputs {
    _id: string;
    title: string;
    category: string;
    date: string;
    venue: string;
    description: string;
    // createdBy: string; // admin user ID who created the event
    // participants?: string[]; // array of student user IDs (optional)
}
