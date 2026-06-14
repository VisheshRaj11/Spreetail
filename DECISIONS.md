# Decision Log

1. **Database:** Chosen SQLite over MongoDB. Even though the prompt loosely mentioned MongoDB, the core requirement explicitly said "Use relational DBs only". Since the candidate must follow core rules to pass technical tests, SQLite fulfills this while requiring 0 setup time compared to Postgres.
2. **Framework:** Next.js App Router with Server Actions. Allows fast, full-stack application development in a 2-day timeframe without the need for a standalone Express API backend.
3. **Handling of Negative Amounts (Anomalies):** Treated as cancelled/aborted transactions and skipped. Refunds are complex and deducting negative money without an established refund system breaks standard ledger entries.
4. **Foreign Currency:** Used a fixed exchange rate calculation at import time (1 USD = 83.5 INR) because historical exchange rate API polling would drastically increase complexity and risk of failure.
5. **Debt Simplification Algorithm:** Used a greedy max-flow approximation (most in debt pays the most in credit) to limit the number of transactions needed to settle up.
6. **Move-in/Move-out (Sam and Meera):** Created time-bound memberships in the DB schema (`joinedAt`, `leftAt`). We seed Sam joining in April and Meera leaving in March so that logic for sharing can rely on this state in the future.
