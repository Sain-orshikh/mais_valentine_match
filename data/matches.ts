export interface Match {
  userId: string;
  username: string;
  matchedUserId: string;
  matchedUsername: string;
  challengeId: number;
}

// Static match data - 10 sample matches for testing
// Update this file and push to GitHub to redeploy with new data
export const matches: Match[] = [
  {
    userId: "0001",
    username: "Emma Johnson",
    matchedUserId: "0002",
    matchedUsername: "Liam Smith",
    challengeId: 0
  },
  {
    userId: "0002",
    username: "Liam Smith",
    matchedUserId: "0001",
    matchedUsername: "Emma Johnson",
    challengeId: 0
  },
  {
    userId: "0103",
    username: "Sophia Martinez",
    matchedUserId: "0104",
    matchedUsername: "Noah Williams",
    challengeId: 3
  },
  {
    userId: "0104",
    username: "Noah Williams",
    matchedUserId: "0103",
    matchedUsername: "Sophia Martinez",
    challengeId: 3
  },
  {
    userId: "0205",
    username: "Olivia Brown",
    matchedUserId: "0206",
    matchedUsername: "Ethan Davis",
    challengeId: 6
  },
  {
    userId: "0206",
    username: "Ethan Davis",
    matchedUserId: "0205",
    matchedUsername: "Olivia Brown",
    challengeId: 6
  },
  {
    userId: "0307",
    username: "Ava Garcia",
    matchedUserId: "0308",
    matchedUsername: "Mason Rodriguez",
    challengeId: 2
  },
  {
    userId: "0308",
    username: "Mason Rodriguez",
    matchedUserId: "0307",
    matchedUsername: "Ava Garcia",
    challengeId: 2
  },
  {
    userId: "0409",
    username: "Isabella Wilson",
    matchedUserId: "0410",
    matchedUsername: "James Anderson",
    challengeId: 4
  },
  {
    userId: "0410",
    username: "James Anderson",
    matchedUserId: "0409",
    matchedUsername: "Isabella Wilson",
    challengeId: 4
  },
  {
    userId: "0511",
    username: "Mia Thomas",
    matchedUserId: "0512",
    matchedUsername: "Benjamin Taylor",
    challengeId: 8
  },
  {
    userId: "0512",
    username: "Benjamin Taylor",
    matchedUserId: "0511",
    matchedUsername: "Mia Thomas",
    challengeId: 8
  },
  {
    userId: "0613",
    username: "Charlotte Moore",
    matchedUserId: "0614",
    matchedUsername: "Lucas Jackson",
    challengeId: 1
  },
  {
    userId: "0614",
    username: "Lucas Jackson",
    matchedUserId: "0613",
    matchedUsername: "Charlotte Moore",
    challengeId: 1
  },
  {
    userId: "0715",
    username: "Amelia Martin",
    matchedUserId: "0716",
    matchedUsername: "Henry Lee",
    challengeId: 5
  },
  {
    userId: "0716",
    username: "Henry Lee",
    matchedUserId: "0715",
    matchedUsername: "Amelia Martin",
    challengeId: 5
  },
  {
    userId: "0817",
    username: "Harper White",
    matchedUserId: "0818",
    matchedUsername: "Alexander Harris",
    challengeId: 3
  },
  {
    userId: "0818",
    username: "Alexander Harris",
    matchedUserId: "0817",
    matchedUsername: "Harper White",
    challengeId: 3
  },
  {
    userId: "0919",
    username: "Evelyn Clark",
    matchedUserId: "0920",
    matchedUsername: "Sebastian Lewis",
    challengeId: 7
  },
  {
    userId: "0920",
    username: "Sebastian Lewis",
    matchedUserId: "0919",
    matchedUsername: "Evelyn Clark",
    challengeId: 7
  }
];

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
