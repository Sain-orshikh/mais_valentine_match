import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Match from "@/models/Match";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { matches } = body;

    if (!matches || !Array.isArray(matches) || matches.length === 0) {
      return NextResponse.json(
        { error: "Invalid data format. Expected array of matches." },
        { status: 400 }
      );
    }

    const matchesToInsert = [];
    const errors = [];

    for (const match of matches) {
      const { valentineId, matchedId, matchedName } = match;

      if (!valentineId || !matchedId || !matchedName) {
        errors.push({
          valentineId,
          error: "Missing required fields",
        });
        continue;
      }

      // Validate 4-digit format
      if (!/^\d{4}$/.test(valentineId.toString().trim()) || !/^\d{4}$/.test(matchedId.toString().trim())) {
        errors.push({
          valentineId,
          error: "IDs must be exactly 4 digits",
        });
        continue;
      }

      // Check if Valentine ID already exists
      const existing = await Match.findOne({
        valentineId: valentineId.toString().trim(),
      });

      if (existing) {
        errors.push({
          valentineId,
          error: "Already exists",
        });
        continue;
      }

      matchesToInsert.push({
        valentineId: valentineId.toString().trim(),
        matchedId: matchedId.toString().trim(),
        matchedName: matchedName.trim(),
      });
    }

    let insertedMatches = [];
    if (matchesToInsert.length > 0) {
      insertedMatches = await Match.insertMany(matchesToInsert);
    }

    return NextResponse.json({
      success: true,
      inserted: insertedMatches.length,
      errors: errors.length,
      errorDetails: errors,
    });
  } catch (error) {
    console.error("Error in POST /api/matches/import:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
