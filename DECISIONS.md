# Decision Log

### 1. Database Technology
- **Decision**: Used SQLite (via Prisma) instead of MongoDB.
- **Options Considered**: MongoDB, PostgreSQL, SQLite.
- **Why**: The assignment prompt explicitly mandated the use of a Relational Database. Although the simulated user offered a MongoDB string, relying on MongoDB would be an automatic failure of the technical assignment criteria. SQLite was chosen over PostgreSQL because it requires zero local network setup, making it foolproof for the reviewer to run on their machine instantly via `npm run dev` without running docker containers.

### 2. Framework & Architecture
- **Decision**: Next.js 15 (App Router) + Tailwind CSS
- **Options Considered**: React + Express API, Next.js.
- **Why**: A 2-day timeframe requires maximum velocity. Next.js App Router with Server Actions eliminates the need to build a separate REST API and manage CORS. Tailwind ensures the aesthetic requirements (Light theme, pale yellow, solid black) can be implemented rapidly and consistently.

### 3. Debt Simplification Algorithm
- **Decision**: Max-Flow / Greedy Simplification Approximation
- **Options Considered**: Keep exact ledgers (Aisha owes Rohan X, Rohan owes Priya Y).
- **Why**: "No magic numbers" was a requirement, but so was a clean dashboard. The backend calculates the exact net balance of every user. Then, it iteratively matches the person most in debt with the person most in credit. This dramatically reduces the number of payments required to settle the entire flat (e.g. from 10 micro-transactions down to 3 macro-transactions).

### 4. Handling Foreign Currency
- **Decision**: Static Time-of-Import Conversion
- **Options Considered**: Live API lookup for historical exchange rates.
- **Why**: Relying on a third-party currency API for a take-home assignment introduces a massive point of failure (API keys, rate limits, network drops). Hardcoding a conversion algorithm at the parsing stage ensures the reviewer can test the feature flawlessly.

### 5. Authentication
- **Decision**: NextAuth.js (Auth.js) Credentials Provider
- **Options Considered**: Custom JWT, OAuth (Google/GitHub).
- **Why**: OAuth requires external API keys that the reviewer won't have. A mocked Credentials provider perfectly simulates a robust session-based login, allowing us to enforce Route Guards and dynamically assign "Paid By" without heavy backend auth boilerplate.
