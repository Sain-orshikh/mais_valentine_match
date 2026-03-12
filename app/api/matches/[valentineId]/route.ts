import { NextRequest, NextResponse } from "next/server";
import { findMatchByUserId } from "@/data/matches";

const CHALLENGES = [
  {
    title: "Partner Reveal Selfie",
    description: "Take a selfie together as soon as your partner is revealed and post it on your Instagram story with the tag #ValenSmile."
  },
  {
    title: "Compliment Exchange",
    description: "Give each other three genuine compliments. Record one of them on your story to spread positivity!"
  },
  {
    title: "Teacher Photo Challenge",
    description: "Take a photo together with a teacher or school staff member. Show some appreciation!"
  },
  {
    title: "Matching Pose",
    description: "Recreate a funny or dramatic pose together (movie pose, heart pose, superhero pose) and post it on your story."
  },
  {
    title: "Kindness Mission",
    description: "As a pair, do one small act of kindness for someone at school (help carry books, give candy, etc.) and take a photo after."
  },
  {
    title: "School Landmark Tour",
    description: "Take a photo together at three different spots around school (library, hallway, school logo, field, etc.)."
  },
  {
    title: "Interview Challenge",
    description: "Ask a random student a fun question like \"What makes you smile?\" and record a short video for your story."
  },
  {
    title: "Matching Energy Video",
    description: "Record a 5-second video together doing the same action (jumping, dancing, high-five, handshake). Let your energy shine!"
  },
  {
    title: "Creative Duo Photo",
    description: "Take the most creative photo you can as a team. Get imaginative—the best one could win a prize!"
  },
  {
    title: "Final Heart Photo",
    description: "End your challenge with a heart pose photo together and post it with the caption \"ValenSmile Complete ❤️\"."
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ valentineId: string }> }
) {
  try {
    const { valentineId: rawId } = await params;
    const userId = rawId.trim();

    const match = findMatchByUserId(userId);

    if (!match) {
      return NextResponse.json(
        { error: "No user found with this ID" },
        { status: 404 }
      );
    }

    if (!match.matchedUserId) {
      return NextResponse.json(
        { error: "You don't have a match yet" },
        { status: 404 }
      );
    }

    const challenge = match.challengeId !== null && match.challengeId !== undefined 
      ? CHALLENGES[match.challengeId] 
      : null;

    return NextResponse.json({
      matchedName: match.matchedUsername,
      matchedId: match.matchedUserId,
      challenge: challenge,
    });
  } catch (error) {
    console.error("Error in GET /api/matches/[valentineId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
