import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ valentineId: string }> }
) {
  try {
    await connectDB();

    const { valentineId: rawId } = await params;
    const userId = rawId.trim();

    const user = await User.findOne({ userId });

    if (!user) {
      return NextResponse.json(
        { error: "No user found with this ID" },
        { status: 404 }
      );
    }

    if (!user.matchedUserId) {
      return NextResponse.json(
        { error: "You don't have a match yet" },
        { status: 404 }
      );
    }

    // Find the matched user
    const matchedUser = await User.findOne({ userId: user.matchedUserId });

    if (!matchedUser) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      matchedName: matchedUser.username,
      matchedId: matchedUser.userId,
    });
  } catch (error) {
    console.error("Error in GET /api/matches/[valentineId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
