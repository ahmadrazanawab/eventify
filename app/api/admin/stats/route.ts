import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { CreateEventModel } from "../../Models/create-event-schema";
import User from "../../Models/signup-schema";
import { isAfter } from "date-fns";

// Connect to the database
connectDB();

export async function GET() {
    try {
        // Get total events count
        const totalEvents = await CreateEventModel.countDocuments();
        
        // Get upcoming events (events with startDate in the future)
        const now = new Date();
        const upcomingEvents = await CreateEventModel.countDocuments({
            startDate: { $gte: now }
        });
        
        // Get total registered students (users with role 'student')
        const registeredStudents = await User.countDocuments({ role: 'student' });
        
        return NextResponse.json({
            success: true,
            data: {
                totalEvents,
                upcomingEvents,
                registeredStudents
            }
        });
        
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching dashboard statistics" },
            { status: 500 }
        );
    }
}
