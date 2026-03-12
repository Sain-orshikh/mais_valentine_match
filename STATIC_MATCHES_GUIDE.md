# Static Matches System

## Overview
The Valentine match data is now stored statically in `data/matches.ts`. This provides:
- ✅ Zero database costs
- ✅ Instant load times (CDN-cached)
- ✅ Handles unlimited concurrent users
- ✅ No rate limiting needed

## How to Update Matches

### Option 1: Direct File Edit (Recommended for initial setup)
1. Edit `data/matches.ts` directly
2. Commit and push to GitHub
3. Vercel automatically redeploys

### Option 2: Via API (For programmatic updates)
Send a POST request to `/api/matches/update`:

```bash
curl -X POST https://your-domain.vercel.app/api/matches/update \
  -H "Content-Type: application/json" \
  -d '{
    "adminPassword": "your-admin-password",
    "matches": [
      {
        "userId": "0001",
        "username": "Alice Smith",
        "matchedUserId": "0002",
        "matchedUsername": "Bob Jones",
        "challengeId": 0
      },
      {
        "userId": "0002",
        "username": "Bob Jones",
        "matchedUserId": "0001",
        "matchedUsername": "Alice Smith",
        "challengeId": 0
      }
    ]
  }'
```

## Environment Variables (for API updates)

Add these to `.env.local` if you want to use the API update method:

```env
# Admin password for updating matches
ADMIN_PASSWORD=your-secure-password

# GitHub API credentials (for updating static file)
GITHUB_TOKEN=ghp_your_personal_access_token
GITHUB_OWNER=your-github-username
GITHUB_REPO=repository-name
GITHUB_BRANCH=main
```

### Creating a GitHub Personal Access Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Give it `repo` scope (full control of private repositories)
4. Copy the token and add to `.env.local`

## Match Data Format

Each match object must have:
```typescript
{
  userId: string;        // 4-digit student ID
  username: string;      // Student name
  matchedUserId: string; // Partner's 4-digit ID
  matchedUsername: string; // Partner's name
  challengeId: number;   // 0-9 (challenge index)
}
```

**Important**: Both users in a pair must have matching `challengeId` values!

## Converting Your Text Data

If you have matches in a text format like:
```
0001 Alice Smith → 0002 Bob Jones
0003 Carol White → 0004 Dave Brown
```

You can convert it to the required format. Each pair needs TWO entries (one for each person):

```typescript
[
  {
    userId: "0001",
    username: "Alice Smith",
    matchedUserId: "0002",
    matchedUsername: "Bob Jones",
    challengeId: 0  // Randomly assign 0-9
  },
  {
    userId: "0002",
    username: "Bob Jones",
    matchedUserId: "0001",
    matchedUsername: "Alice Smith",
    challengeId: 0  // Same as partner!
  },
  // ... more pairs
]
```

## Current Sample Data

The file contains 10 sample matches (20 entries total, 10 pairs) for testing.
Replace these with your real student data before launch.

## Benefits of Static Approach

1. **Performance**: CDN-cached, instant responses
2. **Cost**: 100% free forever
3. **Reliability**: No database connection issues
4. **Scalability**: Handles thousands of concurrent users
5. **Simple**: Just edit a file and push to GitHub

## Vercel Auto-Deploy

When you push to GitHub:
1. Vercel detects the change
2. Rebuilds the site with new data
3. Deploys automatically (~1-2 minutes)
4. All users see updated matches

No manual intervention needed!
