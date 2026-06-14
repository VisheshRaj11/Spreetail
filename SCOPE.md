# Scope & Anomalies Log

## Database Schema
The database uses a relational model (SQLite) composed of 5 core tables:
1. **User**: Stores flatmates (Aisha, Rohan, Priya, Meera, Dev, Sam)
2. **Group**: Groups users together (e.g. "Flatmates").
3. **GroupMember**: Tracks membership with `joinedAt` and `leftAt` timestamps to ensure time-bound expense splitting. (Solves Sam's concern).
4. **Expense**: Records individual expenses with `amount`, `currency`, `date`, and `paidById`.
5. **Split**: Resolves how an expense is divided. Defines `splitType` (equal, unequal, percentage, share) and the exact `amountOwed` by a user.
6. **Settlement**: Represents payments made to settle debts.

## Anomaly Log

| Anomaly Detected | Action Taken | Rationale |
| :--- | :--- | :--- |
| Duplicate Rows | Exact/near matches dropped | E.g. "Dinner at Mar" vs "dinner - marin" dropped to keep ledger accurate. |
| Inconsistent spelling | Normalized string | E.g. "Priya S" -> "Priya", "priya" -> "Priya" using standard casing. |
| Missing Payer `?` | Defaulted to Aisha | The app requires an initiator; assumed default until manually fixed. |
| Negative amounts | Skipped entirely | E.g. "-30 USD" treated as a cancelled transaction. Refund policies are complex, better ignored than double-charged. |
| Incorrect currency (USD) | Converted to INR | Used fixed exchange rate (83.5). Resolves Priya's concern regarding USD trips. |
| Settlements as Expenses | Processed as Settlements | Empty split types or "this is a settlement" keyword matched -> generated Settlement record instead of Expense. |
| Incorrect Percentages | Sum normalization | "Pizza Friday" sums to 110%; mathematically normalized against total to total 100%. |
| Move-in/Move-out dates | Ignored legacy expenses | Handled gracefully via `joinedAt` and `leftAt` table variables for Sam and Meera. |
