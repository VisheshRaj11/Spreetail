# Shared Expenses App

A full-stack web application built to manage shared expenses between flatmates, handle complex edge cases (move-in/move-out dates, foreign currency, irregular split ratios), and import historical data gracefully.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** SQLite (Relational DB) via Prisma ORM
- **Styling:** Tailwind CSS (White, Pale Yellow, Black theme)
- **Parsing:** Papaparse for CSV

## Setup Instructions
1. Ensure Node.js (v20+) is installed.
2. Clone the repository and navigate into `expense-app` directory.
3. Run `npm install` to install dependencies.
4. Run `npx prisma db push` to initialize the SQLite database schema.
5. Run `node prisma/seed.js` to seed the database with the initial flatmates.
6. Run `npm run dev` to start the Next.js development server.
7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Usage
This application was built primarily using Google DeepMind's Antigravity AI. See `AI_USAGE.md` for detailed interactions, corrections, and prompt strategies.
