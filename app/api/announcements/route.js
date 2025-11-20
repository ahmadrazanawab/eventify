import { NextResponse } from "next/server";
import { connectDB } from "../lib/db";
import { AnnouncementModel } from "../Models/announcement-schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    const now = new Date();
    const { searchParams } = new URL(req.url);
    const audience = searchParams.get("audience");
    const limit = parseInt(searchParams.get("limit") || "10");

    const baseAudience = audience ? [audience] : ["All", "Students", "Admins"]; 

    const items = await AnnouncementModel.find({
      audience: { $in: baseAudience },
      $or: [
        { publishAt: { $exists: false } },
        { publishAt: null },
        { publishAt: { $lte: now } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { ok: false };
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.role !== "admin") return { ok: false };
    return { ok: true, user: decoded };
  } catch {
    return { ok: false };
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const doc = await AnnouncementModel.create({
      title: body.title,
      message: body.message,
      audience: body.audience || "All",
      priority: body.priority || "Medium",
      publishAt: body.publishAt ? new Date(body.publishAt) : undefined,
    });

    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
