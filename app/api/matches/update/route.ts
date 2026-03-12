import { NextRequest, NextResponse } from "next/server";
import { GitHubClient } from "@/lib/github";

interface Match {
  userId: string;
  username: string;
  matchedUserId: string;
  matchedUsername: string;
  challengeId: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matches, adminPassword } = body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!matches || !Array.isArray(matches)) {
      return NextResponse.json(
        { error: "Invalid matches data" },
        { status: 400 }
      );
    }

    for (const match of matches) {
      if (!match.userId || !match.username || !match.matchedUserId || !match.matchedUsername) {
        return NextResponse.json(
          { error: "Invalid match format" },
          { status: 400 }
        );
      }
      if (typeof match.challengeId !== 'number' || match.challengeId < 0 || match.challengeId > 9) {
        return NextResponse.json(
          { error: "Invalid challengeId" },
          { status: 400 }
        );
      }
    }

    const fileContent = generateMatchesFile(matches);
    const github = new GitHubClient();
    const filePath = 'data/matches.ts';

    try {
      const currentFile = await github.getFile(filePath);
      await github.updateFile(
        filePath,
        fileContent,
        `Update matches - ${new Date().toISOString()}`,
        currentFile.sha
      );

      return NextResponse.json({
        success: true,
        message: "Matches updated. Vercel will redeploy automatically.",
        matchCount: matches.length
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("GitHub update error:", error);
      return NextResponse.json(
        { error: `Failed to update GitHub: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/matches/update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateMatchesFile(matches: Match[]): string {
  return `export interface Match {
  userId: string;
  username: string;
  matchedUserId: string;
  matchedUsername: string;
  challengeId: number;
}

// Static match data - Updated ${new Date().toISOString()}
export const matches: Match[] = ${JSON.stringify(matches, null, 2)};

// Helper function to find a match by userId
export function findMatchByUserId(userId: string): Match | undefined {
  return matches.find(match => match.userId === userId);
}

// Helper function to get all unique matches (each pair counted once)
export function getUniqueMatches(): Match[] {
  const seen = new Set<string>();
  return matches.filter(match => {
    const pairKey = [match.userId, match.matchedUserId].sort().join('-');
    if (seen.has(pairKey)) return false;
    seen.add(pairKey);
    return true;
  });
}
`;
}
