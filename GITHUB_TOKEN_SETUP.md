# GitHub Token Setup for Admin Panel

## Why You Need This
Non-technical admins can add/edit/delete matches through the `/admin` UI without touching code. Changes automatically deploy to Vercel.

## How to Get GitHub Token (5 minutes)

### Step 1: Create Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `Valentine Match Admin`
4. Set expiration: `No expiration` (or 1 year)
5. Check the box for: **`repo`** (Full control of private repositories)
   - This gives access to push changes to your repository
6. Scroll down, click **"Generate token"**
7. **Copy the token immediately** (starts with `ghp_...`)

### Step 2: Add to .env
1. Open `.env` file in your project
2. Paste the token:
```env
GITHUB_TOKEN=ghp_your_actual_token_here
```
3. Verify other values:
```env
GITHUB_OWNER=Sain-orshikh
GITHUB_REPO=mais_valentine_match
GITHUB_BRANCH=main
```

### Step 3: Add to Vercel (Production)
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these:
   - `GITHUB_TOKEN` = your token
   - `GITHUB_OWNER` = Sain-orshikh
   - `GITHUB_REPO` = mais_valentine_match
   - `GITHUB_BRANCH` = main
5. **Redeploy** the project for changes to take effect

## How Admin Panel Works (After Setup)

### For Non-Technical Users:
1. Go to `yoursite.com/admin`
2. Enter password: `findmyvaldotme21`
3. Click "Add New Match Pair"
4. Fill in:
   - Student 1 ID & Name
   - Student 2 ID & Name
   - Choose a challenge (0-9)
5. Click **"Add Match Pair & Deploy"**
6. Enter admin password when prompted
7. Wait ~1-2 minutes for Vercel to redeploy
8. ✅ New matches are live!

### What Happens Behind the Scenes:
1. Admin adds match through UI
2. System pushes change to GitHub repository
3. Vercel detects change
4. Automatically rebuilds and deploys
5. All users see updated matches

## Security Notes

⚠️ **Keep the token secret!** It has full access to your repository.

✅ **Token can be revoked** anytime at: https://github.com/settings/tokens

✅ **Only authorized admins** should have the admin password

## Troubleshooting

**Error: "Failed to update GitHub"**
- Check token is correct
- Verify repo name matches exactly
- Ensure token has `repo` scope

**Changes not showing up**
- Wait 2-3 minutes for Vercel deploy
- Check Vercel dashboard for deployment status
- Refresh page (Ctrl+F5)

**"Unauthorized" error**
- Check admin password in `.env` matches
- Verify environment variables are set in Vercel

## Alternative: Direct File Edit (For Developers)

If GitHub token setup fails, developers can still:
1. Edit `data/matches.ts` directly
2. `git push`
3. Vercel auto-deploys

But this requires code access - not suitable for non-technical admins.
