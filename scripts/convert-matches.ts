// Helper script to convert text-based match data to the required format
// Run this in Node.js to generate the matches array

interface Match {
  userId: string;
  username: string;
  matchedUserId: string;
  matchedUsername: string;
  challengeId: number;
}

// STEP 1: Paste your raw match data here
// Format examples:
// "0001 Alice Smith → 0002 Bob Jones"
// "0001,Alice Smith,0002,Bob Jones"
// "Alice Smith (0001) matched with Bob Jones (0002)"
const rawMatchData = `
0001 Emma Johnson → 0002 Liam Smith
0103 Sophia Martinez → 0104 Noah Williams
0205 Olivia Brown → 0206 Ethan Davis
`;

// STEP 2: Parse the data (adjust parsing logic based on your format)
function parseMatches(rawData: string): Match[] {
  const matches: Match[] = [];
  const lines = rawData.trim().split('\n').filter(line => line.trim());
  
  lines.forEach((line) => {
    // Example parser for "ID Name → ID Name" format
    // Adjust regex based on your actual format
    const match = line.match(/(\d{4})\s+(.+?)\s+→\s+(\d{4})\s+(.+)/);
    
    if (match) {
      const [, userId1, username1, userId2, username2] = match;
      
      // Random challenge ID for this pair (0-9)
      const challengeId = Math.floor(Math.random() * 10);
      
      // Add both directions of the match
      matches.push({
        userId: userId1.trim(),
        username: username1.trim(),
        matchedUserId: userId2.trim(),
        matchedUsername: username2.trim(),
        challengeId
      });
      
      matches.push({
        userId: userId2.trim(),
        username: username2.trim(),
        matchedUserId: userId1.trim(),
        matchedUsername: username1.trim(),
        challengeId // Same challenge for both partners!
      });
    }
  });
  
  return matches;
}

// Alternative parser for CSV format: "ID,Name,ID,Name"
function parseCSVMatches(rawData: string): Match[] {
  const matches: Match[] = [];
  const lines = rawData.trim().split('\n').filter(line => line.trim());
  
  lines.forEach((line) => {
    const parts = line.split(',').map(p => p.trim());
    
    if (parts.length >= 4) {
      const [userId1, username1, userId2, username2] = parts;
      const challengeId = Math.floor(Math.random() * 10);
      
      matches.push({
        userId: userId1,
        username: username1,
        matchedUserId: userId2,
        matchedUsername: username2,
        challengeId
      });
      
      matches.push({
        userId: userId2,
        username: username2,
        matchedUserId: userId1,
        matchedUsername: username1,
        challengeId
      });
    }
  });
  
  return matches;
}

// STEP 3: Generate and output
const matches = parseMatches(rawMatchData);
console.log('Generated matches:');
console.log(JSON.stringify(matches, null, 2));
console.log(`\nTotal: ${matches.length} entries (${matches.length / 2} pairs)`);

// STEP 4: Copy the output and paste into data/matches.ts
// Replace the `export const matches: Match[] = [...]` section

/* 
USAGE:
1. Install ts-node if needed: npm install -D ts-node
2. Paste your match data in rawMatchData above
3. Adjust the parser function if needed for your format
4. Run: npx ts-node scripts/convert-matches.ts
5. Copy the JSON output
6. Replace the matches array in data/matches.ts
7. Commit and push to GitHub
*/
