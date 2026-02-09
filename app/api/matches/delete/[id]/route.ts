import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Match from "@/models/Match";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const match = await Match.findByIdAndDelete(id);

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/matches/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
