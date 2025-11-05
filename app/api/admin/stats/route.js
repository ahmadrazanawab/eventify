import { connectDB } from "@/app/api/lib/db";
import Event from "@/app/api/Models/Event";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Event.aggregate([
      { $project: { registrations: { $size: "$registrations" } } },
      { $group: { _id: null, total: { $sum: "$registrations" } } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalEvents,
        totalRegistrations: totalRegistrations[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching admin stats" },
      { status: 500 }
    );
  }
}
