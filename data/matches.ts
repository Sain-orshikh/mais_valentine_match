export interface Match {
  userId: string;
  username: string;
  class: string;
  matchedUserId: string;
  matchedUsername: string;
  matchedClass: string;
  challengeId: number;
}

// Static match data - Updated 2026-03-12T16:55:44.415Z
export const matches: Match[] = [
  {
    userId: "0001",
    username: "Amarbat.S",
    class: "26a",
    matchedUserId: "0002",
    matchedUsername: "Ninjin.B",
    matchedClass: "27d",
    challengeId: 0
  },
  {
    userId: "0002",
    username: "Ninjin.B",
    class: "27d",
    matchedUserId: "0001",
    matchedUsername: "Amarbat.S",
    matchedClass: "26a",
    challengeId: 0
  },
  {
    userId: "0103",
    username: "Boldkhang.T",
    class: "27b",
    matchedUserId: "0104",
    matchedUsername: "Anu.D",
    matchedClass: "26a",
    challengeId: 3
  },
  {
    userId: "0104",
    username: "Anu.D",
    class: "26a",
    matchedUserId: "0103",
    matchedUsername: "Boldkhang.T",
    matchedClass: "27b",
    challengeId: 3
  },
  {
    userId: "0205",
    username: "Temuulen.K",
    class: "26b",
    matchedUserId: "0206",
    matchedUsername: "Sarnai.G",
    matchedClass: "27a",
    challengeId: 6
  },
  {
    userId: "0206",
    username: "Sarnai.G",
    class: "27a",
    matchedUserId: "0205",
    matchedUsername: "Temuulen.K",
    matchedClass: "26b",
    challengeId: 6
  },
  {
    userId: "0307",
    username: "Enkhjin.B",
    class: "26c",
    matchedUserId: "0308",
    matchedUsername: "Narangerel.S",
    matchedClass: "27c",
    challengeId: 2
  },
  {
    userId: "0308",
    username: "Narangerel.S",
    class: "27c",
    matchedUserId: "0307",
    matchedUsername: "Enkhjin.B",
    matchedClass: "26c",
    challengeId: 2
  },
  {
    userId: "0409",
    username: "Batbayar.T",
    class: "26d",
    matchedUserId: "0410",
    matchedUsername: "Oyunaa.D",
    matchedClass: "27d",
    challengeId: 4
  },
  {
    userId: "0410",
    username: "Oyunaa.D",
    class: "27d",
    matchedUserId: "0409",
    matchedUsername: "Batbayar.T",
    matchedClass: "26d",
    challengeId: 4
  },
  {
    userId: "0511",
    username: "Gantulga.M",
    class: "26a",
    matchedUserId: "0512",
    matchedUsername: "Altantsetseg.B",
    matchedClass: "27b",
    challengeId: 8
  },
  {
    userId: "0512",
    username: "Altantsetseg.B",
    class: "27b",
    matchedUserId: "0511",
    matchedUsername: "Gantulga.M",
    matchedClass: "26a",
    challengeId: 8
  },
  {
    userId: "0613",
    username: "Munkhbat.E",
    class: "26b",
    matchedUserId: "0614",
    matchedUsername: "Saruul.L",
    matchedClass: "27a",
    challengeId: 1
  },
  {
    userId: "0614",
    username: "Saruul.L",
    class: "27a",
    matchedUserId: "0613",
    matchedUsername: "Munkhbat.E",
    matchedClass: "26b",
    challengeId: 1
  },
  {
    userId: "0715",
    username: "Erdenebat.G",
    class: "26c",
    matchedUserId: "0716",
    matchedUsername: "Tsolmon.O",
    matchedClass: "27c",
    challengeId: 5
  },
  {
    userId: "0716",
    username: "Tsolmon.O",
    class: "27c",
    matchedUserId: "0715",
    matchedUsername: "Erdenebat.G",
    matchedClass: "26c",
    challengeId: 5
  },
  {
    userId: "0817",
    username: "Bat-Erdene.N",
    class: "26d",
    matchedUserId: "0818",
    matchedUsername: "Tuvshinzaya.K",
    matchedClass: "27d",
    challengeId: 3
  },
  {
    userId: "0818",
    username: "Tuvshinzaya.K",
    class: "27d",
    matchedUserId: "0817",
    matchedUsername: "Bat-Erdene.N",
    matchedClass: "26d",
    challengeId: 3
  },
  {
    userId: "0919",
    username: "Enkh-Amgalan.S",
    class: "26a",
    matchedUserId: "0920",
    matchedUsername: "Gerelchimeg.T",
    matchedClass: "27b",
    challengeId: 7
  },
  {
    userId: "0920",
    username: "Gerelchimeg.T",
    class: "27b",
    matchedUserId: "0919",
    matchedUsername: "Enkh-Amgalan.S",
    matchedClass: "26a",
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
