import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Match from "@/models/Match";

// GET all matches (for admin)
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
          { valentineId: { $regex: searchTerm, $options: "i" } },
          { matchedId: { $regex: searchTerm, $options: "i" } },
          { matchedName: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    const matches = await Match.find(query).sort({ createdAt: -1 });
    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error in GET /api/matches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new match (for admin)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { valentineId, matchedId, matchedName } = body;

    if (!valentineId || !matchedId || !matchedName) {
      return NextResponse.json(
        {
          error: "All fields are required: valentineId, matchedId, matchedName",
        },
        { status: 400 }
      );
    }

    // Validate 4-digit format
    if (!/^\d{4}$/.test(valentineId.trim()) || !/^\d{4}$/.test(matchedId.trim())) {
      return NextResponse.json(
        { error: "Valentine ID and Matched ID must be exactly 4 digits" },
        { status: 400 }
      );
    }

    // Check if Valentine ID already exists
    const existingMatch = await Match.findOne({
      valentineId: valentineId.trim(),
    });

    if (existingMatch) {
      return NextResponse.json(
        { error: "Valentine ID already has a match" },
        { status: 400 }
      );
    }

    const newMatch = new Match({
      valentineId: valentineId.trim(),
      matchedId: matchedId.trim(),
      matchedName: matchedName.trim(),
    });

    await newMatch.save();
    return NextResponse.json(newMatch, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/matches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
