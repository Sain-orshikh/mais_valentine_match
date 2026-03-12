import { NextResponse } from "next/server";
import { matches } from "@/data/matches";

export async function GET() {
  try {
    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error in GET /api/admin/matches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
