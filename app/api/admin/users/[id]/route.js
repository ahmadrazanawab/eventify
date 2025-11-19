import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/api/lib/db";
import SignUpModel from "@/app/api/Models/signup-schema";

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
    const body = await req.json();
    const update = {};

    if (body.role && ["admin", "student"].includes(body.role)) {
      update.role = body.role;
    }
    if (body.designation !== undefined) update.designation = body.designation;
    if (body.department !== undefined) update.department = body.department;
    if (body.year !== undefined) update.year = body.year;

    const updated = await SignUpModel.findByIdAndUpdate(id, update, { new: true }).select("-password");
    if (!updated) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const auth = await requireAdmin();
    if (!auth.ok) return auth.res;

    const { id } = await params;
    // Prevent self-delete for safety
    if (auth.user?.id === id) {
      return NextResponse.json({ success: false, message: "You cannot delete your own account" }, { status: 400 });
    }

    const deleted = await SignUpModel.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
