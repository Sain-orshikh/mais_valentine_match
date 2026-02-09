import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET all users (for admin)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    let query = {};

    if (search) {
      const searchTerm = search.trim();
      query = {
        $or: [
          { userId: { $regex: searchTerm, $options: "i" } },
          { username: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new user (for admin)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, username } = body;

    if (!userId || !username) {
      return NextResponse.json(
        { error: "User ID and username are required" },
        { status: 400 }
      );
    }

    // Validate 4-digit format
    if (!/^\d{4}$/.test(userId.trim())) {
      return NextResponse.json(
        { error: "User ID must be exactly 4 digits" },
        { status: 400 }
      );
    }

    // Check if User ID already exists
    const existingUser = await User.findOne({
      userId: userId.trim(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User ID already exists" },
        { status: 400 }
      );
    }

    const newUser = new User({
      userId: userId.trim(),
      username: username.trim(),
      matchedUserId: null,
    });

    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
