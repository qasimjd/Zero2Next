import { writeClient } from "@/sanity/lib/writeClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    await writeClient.patch(id).inc({ views: 1 }).commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
  }
}
