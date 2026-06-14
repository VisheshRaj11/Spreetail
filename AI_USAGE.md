# AI Usage Log

## AI Tools Used
- **Google DeepMind Antigravity AI (Gemini 3.1 Pro)** acting as an engineering co-pilot.
- Cursor/VSCode integrated environments.

## Key Prompts Used
1. *"I have to build the application of expense tracker app with the help of nextjs and tailwind... that looks responsive and minimalistic light theme with white and pale yellow and black buttons."*
2. *"Add auth to it using nextAuth and ensure the background has radial black dots for a modern aesthetic."*
3. *"Whenever the user tries to access the import csv route, if they are not logged in, redirect them to the login page."*

## AI Mistakes & Corrections

While the AI was incredibly fast at scaffolding boilerplate, it required strict architectural oversight and correction to meet the assignment's technical standards.

### Case 1: Database Technology Conflict
- **What went wrong:** During the initial setup, the AI suggested proceeding with a MongoDB NoSQL structure because it recognized rapid-prototyping patterns.
- **How I caught it:** I reviewed the core assignment constraints which explicitly mandated the use of a "Relational DB only".
- **The Correction:** I rejected the AI's NoSQL approach and instructed it to pivot entirely to an SQLite implementation via Prisma. This ensured strict compliance with the technical requirements while maintaining a zero-config setup for local evaluation.

### Case 2: NextAuth API Proxy Deprecation
- **What went wrong:** When implementing the route protection middleware, the AI generated deprecated Next.js 12 syntax (`export { default } from "next-auth/middleware"`).
- **How I caught it:** I noticed the Next.js 15 Turbopack compiler throwing a severe warning: `The "middleware" file convention is deprecated... must export a function`.
- **The Correction:** I identified that the AI was hallucinating outdated App Router conventions. I instructed it to rewrite `middleware.ts` from scratch, explicitly using `getToken()` and exporting a native `NextResponse` async function to ensure the API was modern and stable.

### Case 3: React Hydration & Component Typing
- **What went wrong:** The AI attempted to use a Radix UI `asChild` prop on a generic custom `<Button>` component inside `page.tsx` during the dashboard scaffolding.
- **How I caught it:** I ran a manual production build validation and the type-checker failed with: `Type error: Property 'asChild' does not exist on type 'IntrinsicAttributes & ButtonProps'`.
- **The Correction:** I analyzed the component tree, realized the custom Button lacked the `@radix-ui/react-slot` typing required for polymorphism, and directed the AI to refactor the JSX to wrap the buttons in standard Next.js routing patterns instead of passing unsupported props.
