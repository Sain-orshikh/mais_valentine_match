import { NextRequest, NextResponse } from "next/server";
import { GitHubClient } from "@/lib/github";

interface Match {
  userId: string;
  username: string;
  class: string;
  matchedUserId: string;
  matchedUsername: string;
  matchedClass: string;
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
      if (!match.userId || !match.username || !match.class || !match.matchedUserId || !match.matchedUsername || !match.matchedClass) {
        return NextResponse.json(
          { error: "Invalid match format" },
          { status: 400 }
        );
      }
      if (typeof match.challengeId !== 'number' || match.challengeId < 0 || match.challengeId > 8) {
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
  const totalPairs = matches.length / 2;
  const totalEntries = matches.length;
  const timestamp = new Date().toISOString();
  
  return `// Auto-generated from pasted Excel data
// Generated: ${timestamp}
// Total pairs: ${totalPairs}
// Total entries (bidirectional): ${totalEntries}

export interface Match {
  userId: string;
  username: string;
  class: string;
  matchedUserId: string;
  matchedUsername: string;
  matchedClass: string;
  challengeId: number;
}

export const matches: Match[] = ${JSON.stringify(matches, null, 2)};

export function findMatchByUserId(userId: string): Match | null {
  return matches.find((match) => match.userId === userId) || null;
}
`;
}
