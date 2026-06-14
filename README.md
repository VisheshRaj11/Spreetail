# Shared Expenses App

A full-stack web application designed for flatmates to track shared expenses, settle debts securely, and ingest historical spreadsheet data automatically.

## AI Used
This application was rapidly developed with the assistance of **Google DeepMind Antigravity AI (Gemini 3.1 Pro)** acting as an autonomous engineering co-pilot.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Installation
Clone the repository (or navigate to the project folder) and install the dependencies:
```bash
npm install
```

### 2. Database Initialization
This project uses SQLite for ease of use (fulfilling the relational DB requirement without requiring Docker or manual Postgres setup).
Generate the Prisma client and push the schema to create `dev.db`:
```bash
npx prisma generate
npx prisma db push
```

### 3. Seeding the Database
To populate the necessary users (Aisha, Rohan, Priya, Meera, Dev, Sam) and default group:
```bash
npx prisma db seed
```

### 4. Running the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

### 5. Testing the Importer
Log into the application (using the "Aisha" profile, for example). Click on "Import CSV" and upload the `expenses_export.csv` file. The app will generate a real-time Import Report detailing exactly what it parsed and what anomalies it corrected.
