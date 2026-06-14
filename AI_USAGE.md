# AI Usage Log

## AI Tools Used
- **Google DeepMind Antigravity AI (Gemini 3.1 Pro)** acting as an autonomous engineering co-pilot.
- Cursor/VSCode integrated environments.

## Key Prompts Used
1. *"I have to build the application of expense tracker app with the help of nextjs and tailwind and for db use mongo... that looks responsive and minimalistic light theme with white and pale yellow and black buttons."*
2. *"Add the auth to it and add expense is not working. So use nextAuth and I want the bg should be radial BLACK dots as we have done with earlier projects."*
3. *"Whenever the user is try to access the import csv route, if its not login then it will redirect to login page and add bg radial to login and I want font as poppins."*

## AI Mistakes & Corrections

### Case 1: Database Technology Conflict
- **What went wrong:** The AI initially recognized the prompt asking for MongoDB, but the core assignment rules stated "Use relational DBs only". The AI hesitated and built an implementation plan asking the user which route to take.
- **How it was caught:** The user replied "do whatever you want and dont ask for any permission". 
- **The Correction:** The AI autonomously made the architectural decision to strictly adhere to the technical assignment rule over the casual chat prompt, overriding MongoDB and implementing SQLite via Prisma.

### Case 2: NextAuth API Proxy Deprecation
- **What went wrong:** When implementing NextAuth route protection, the AI utilized the `export { default } from "next-auth/middleware"` syntax in `src/middleware.ts`. 
- **How it was caught:** The Next.js 15 Turbopack compiler immediately threw a terminal error: `The "middleware" file convention is deprecated... must export a function`.
- **The Correction:** The AI analyzed the development server logs, recognized the Next.js App Router constraint, and rewrote `middleware.ts` to explicitly use `getToken()` and export a native `NextResponse` async function.

### Case 3: React Hydration & Component Typing
- **What went wrong:** The AI attempted to use Radix UI's `asChild` prop on a custom `<Button>` component inside `src/app/page.tsx` during the initial dashboard scaffolding.
- **How it was caught:** The Next.js production build failed with `Type error: Property 'asChild' does not exist on type 'IntrinsicAttributes & ButtonProps'`.
- **The Correction:** The AI read the failed build output, realized the custom Button lacked the `@radix-ui/react-slot` typing, and dynamically refactored the JSX to wrap the Button natively in standard anchor tags instead of passing the `asChild` prop.
