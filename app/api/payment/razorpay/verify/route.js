import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/api/lib/db";
import { CreateEventModel } from "@/app/api/Models/create-event-schema";
import { StudentRegistrationModel } from "@/app/api/Models/student-event-schema";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "student") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId, name, email, phone, department, year } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !eventId) {
      return NextResponse.json({ success: false, message: "Missing payment verification fields" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ success: false, message: "Razorpay key not configured" }, { status: 500 });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
    }

    const eventDoc = await CreateEventModel.findById(eventId);
    if (!eventDoc) return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    if (!eventDoc.paymentRequired || !eventDoc.fee || eventDoc.fee <= 0) {
      return NextResponse.json({ success: false, message: "Event is not configured for payment" }, { status: 400 });
    }

    const existingRegistration = await StudentRegistrationModel.findOne({ student: user.id, event: eventId });
    if (existingRegistration) {
      // If a registration exists (possibly pending), mark it as paid and update fee/details
      existingRegistration.paymentStatus = "paid";
      existingRegistration.eventFees = eventDoc.fee;
      if (name) existingRegistration.name = name;
      if (email) existingRegistration.email = email;
      if (phone) existingRegistration.phone = phone;
      if (department) existingRegistration.department = department;
      if (year) existingRegistration.year = year;
      await existingRegistration.save();
      return NextResponse.json({ success: true, data: existingRegistration });
    }

    const registration = await StudentRegistrationModel.create({
      student: user.id,
      event: eventId,
      name,
      email,
      phone,
      department,
      year,
      eventFees: eventDoc.fee,
      paymentStatus: "paid",
    });

    return NextResponse.json({ success: true, data: registration });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
