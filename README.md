# Valentine Match Reveal 💘

A simple and elegant web application for revealing Valentine's Day matches. Built with Next.js, MongoDB, and deployed on Vercel.

## Features

### User Features
- 🔐 Enter unique Valentine ID to discover match
- 💖 Beautiful reveal page with matched person's name
- 🎨 Pink Valentine-themed design
- 📱 Fully responsive mobile-friendly interface

### Admin Features
- ➕ Add individual match pairs
- 📊 View all matches in a table
- 🔍 Search matches by ID or name
- 🗑️ Delete match pairs
- 📁 Import matches via CSV file

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Next.js API Routes (Serverless Functions)
- **Database**: MongoDB Atlas (Free Tier)
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+ installed
- pnpm package manager
- MongoDB Atlas account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mais_valentine_match
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup MongoDB**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free M0 tier is sufficient)
   - Get your connection string
   - Whitelist your IP address (or use 0.0.0.0/0 for all IPs)

4. **Configure environment variables**
   
   Update `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/valentine_match?retryWrites=true&w=majority
   ADMIN_USERNAME=superadmin123
   ADMIN_PASSWORD=findmyvaldotme21
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Usage

### For Users

1. Visit the homepage
2. Enter your 4-digit student code (e.g., 0001)
3. Click "Reveal My Match"
4. See your match's name!

### For Admins

1. Visit `/admin` page
2. **Login:**
   - Username: `superadmin123`
   - Password: `findmyvaldotme21`
   - (Change these in `.env` for production)

3. **Add single match:**
   - Enter Valentine ID (4 digits, e.g., 0001)
   - Enter Matched ID (4 digits, e.g., 0101)
   - Enter Matched Name (e.g., John Doe)
   - Click "Add Pair"

4. **Import CSV:**
   - Prepare a CSV file with format:
     ```csv
     valentineId,matchedId,matchedName
     0001,0101,John Doe
     0002,0102,Jane Smith
     ```
   - Click "Import CSV"
   - Select your file

### CSV Format Example

```csv
0001,0101,Rodrina Gorz
0002,0102,Alex Johnson
0003,0103,Sarah Williams
VAL001,MAT001,Rodrina Gorz
VAL002,MAT002,Alex Johnson
VAL003,MAT003,Sarah Williams
```

## Deployment on Vercel

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `ADMIN_USERNAME`: Admin login username
     - `ADMIN_PASSWORD`: Admin login password
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

## API Routes

### User Endpoints

- `GET /api/matches/[valentineId]` - Get match by Valentine ID
  ```json
  Response: {
    "matchedName": "John Doe",
    "matchedId": "MAT001"
  }
  ```

### Admin Endpoints

- `GET /api/matches` - Get all matches (with optional search)
- `POST /api/matches` - Create new match pair
- `DELETE /api/matches/delete/[id]` - Delete match
- `POST /api/matches/import` - Import CSV

## Capacity & Performance

- **Expected Users**: 400
- **Concurrent Requests**: 10-20 simultaneous reads
- **MongoDB Free Tier**: 100 concurrent connections (more than sufficient)
- **Vercel Free Tier**: 100,000 requests/month (plenty for event)
- **Cold Start**: ~1-3 seconds (acceptable for Valentine reveal)

---

Made with 💝 for Valentine's Day 2026

