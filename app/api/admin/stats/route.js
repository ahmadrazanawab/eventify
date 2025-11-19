import { connectDB } from "@/app/api/lib/db";
import { NextResponse } from "next/server";
import Event from "@/app/api/Models/Event";
import SignUpModel from "@/app/api/Models/signup-schema";
import { StudentRegistrationModel } from "@/app/api/Models/student-event-schema";

export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    const now = new Date();
    const [
      totalEvents,
      totalRegistrationsRaw,
      totalStudentsRaw,
      upcomingAgg,
    ] = await Promise.all([
      Event.countDocuments(),
      StudentRegistrationModel.countDocuments().catch(() => 0),
      SignUpModel.countDocuments({ role: 'student' }).catch(() => 0),
      Event.aggregate([
        {
          $project: {
            dateAsDate: {
              $cond: [
                { $isDate: "$date" },
                "$date",
                {
                  $dateFromString: {
                    dateString: "$date",
                    onError: null,
                    onNull: null,
                  },
                },
              ],
            },
          },
        },
        { $match: { dateAsDate: { $gte: now } } },
        { $count: "count" },
      ]).catch(() => []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalEvents,
        totalRegistrations: Number(totalRegistrationsRaw) || 0,
        totalStudents: Number(totalStudentsRaw) || 0,
        upcomingEvents: Array.isArray(upcomingAgg) && upcomingAgg[0]?.count ? upcomingAgg[0].count : 0,
      },
    });
    
  } catch (error) {
    console.error("Error in admin stats API:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Internal server error" 
      },
      { status: 500 }
    );
  }
}
