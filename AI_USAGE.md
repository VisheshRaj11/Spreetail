# AI Usage & Prompt Log

**Tool Used:** Google DeepMind Antigravity AI (Gemini 3.1 Pro)

**General Workflow:**
1. Requested AI to parse requirements and build a technical plan based on contradictory assignment constraints (Mongo vs Relational). AI flagged the issue, then proceeded with Relational (SQLite) when given free rein.
2. AI transcribed the screenshot to `expenses_export.csv` to fulfill the import testing requirement.
3. AI scaffolded Next.js, Prisma, and Tailwind. Built the `csv-import.ts` logic to parse anomalies and apply specific rules.

**Concrete Cases of AI producing something wrong & corrections:**
1. **Case:** AI initially attempted to write terminal commands sequentially using `&&` which broke in the Windows PowerShell environment.
   - **Fix:** System returned an error. AI modified the command execution to use `;` which is valid in PowerShell.
2. **Case:** AI attempted to install the latest Prisma (v7.8.0), but used deprecated `url = env("DATABASE_URL")` syntax inside `schema.prisma`.
   - **Fix:** AI read the Prisma schema error log, realized Prisma 7 had breaking changes, and downgraded to `prisma@6` to keep compatibility with Next.js fast-scaffolding without risking untested API configurations.
3. **Case:** AI tried to execute a `write_to_file` to `src/app/page.tsx` but the file already existed from Next.js scaffolding.
   - **Fix:** The tool returned an error enforcing overwrite explicitly. AI re-issued the command with `Overwrite: true`.
