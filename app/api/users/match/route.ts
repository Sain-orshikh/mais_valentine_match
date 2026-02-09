import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId1, userId2 } = body;

    if (!userId1 || !userId2) {
      return NextResponse.json(
        { error: "Both user IDs are required" },
        { status: 400 }
      );
    }

    if (userId1 === userId2) {
      return NextResponse.json(
        { error: "Cannot match a user with themselves" },
        { status: 400 }
      );
    }

    // Find both users
    const user1 = await User.findOne({ userId: userId1.trim() });
    const user2 = await User.findOne({ userId: userId2.trim() });

    if (!user1 || !user2) {
      return NextResponse.json(
        { error: "One or both users not found" },
        { status: 404 }
      );
    }

    // Check if either user is already matched
    if (user1.matchedUserId || user2.matchedUserId) {
      return NextResponse.json(
        { error: "One or both users are already matched" },
        { status: 400 }
      );
    }

    // Create the match
    user1.matchedUserId = user2.userId;
    user2.matchedUserId = user1.userId;

    await user1.save();
    await user2.save();

    return NextResponse.json({
      message: "Match created successfully",
      match: {
        user1: { userId: user1.userId, username: user1.username },
        user2: { userId: user2.userId, username: user2.username },
      },
    });
  } catch (error) {
    console.error("Error in POST /api/users/match:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a match
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ userId: userId.trim() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.matchedUserId) {
      return NextResponse.json(
        { error: "User is not matched" },
        { status: 400 }
      );
    }

    // Find the matched user and clear both matches
    const matchedUser = await User.findOne({ userId: user.matchedUserId });

    user.matchedUserId = null;
    await user.save();

    if (matchedUser) {
      matchedUser.matchedUserId = null;
      await matchedUser.save();
    }

    return NextResponse.json({ message: "Match removed successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/users/match:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
