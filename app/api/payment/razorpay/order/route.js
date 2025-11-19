import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/api/lib/db";
import { CreateEventModel } from "@/app/api/Models/create-event-schema";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "student") return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 });
    }

    const eventDoc = await CreateEventModel.findById(eventId);
    if (!eventDoc) return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    if (!eventDoc.paymentRequired || !eventDoc.fee || eventDoc.fee <= 0) {
      return NextResponse.json({ success: false, message: "Event is not configured for payment" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ success: false, message: "Razorpay keys not configured" }, { status: 500 });
    }

    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const amountPaise = Math.round(Number(eventDoc.fee) * 100);

    const order = await instance.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${eventDoc._id}_${user.id}_${Date.now()}`,
      notes: { eventId: String(eventDoc._id), studentId: String(user.id), title: eventDoc.title },
    });

    return NextResponse.json({ success: true, order, key: keyId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
