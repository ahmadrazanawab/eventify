import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/api/lib/db";
import { StudentRegistrationModel } from "@/app/api/Models/student-event-schema";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { ok: false, res: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== "admin") {
      return { ok: false, res: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
    }
    return { ok: true, user };
  } catch {
    return { ok: false, res: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const auth = await requireAdmin();
    if (!auth.ok) return auth.res;

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const update = {};
    if (typeof body.paymentMethod === 'string' && ["none","online","cash"].includes(body.paymentMethod)) {
      update.paymentMethod = body.paymentMethod;
    }
    if (typeof body.paymentStatus === 'string' && ["none","pending","paid"].includes(body.paymentStatus)) {
      update.paymentStatus = body.paymentStatus;
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, message: "No valid fields to update" }, { status: 400 });
    }

    const updated = await StudentRegistrationModel.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return NextResponse.json({ success: false, message: "Registration not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
