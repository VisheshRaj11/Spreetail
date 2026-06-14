# Scope and Data Handling

## Database Schema
To cleanly represent flatmates, dynamic groups, and nuanced debts, the relational database relies on the following Prisma schema:

- **User**: Core entity (`id`, `name`, `email`).
- **Group**: A logical container for expenses (e.g., "Flatmates").
- **GroupMember**: A join table that tracks *when* a user joined or left (`joinedAt`, `leftAt`). This solves the problem of Meera leaving in March and Sam joining in April. If an expense occurs in May, Meera is immune; if in February, Sam is immune.
- **Expense**: The master record of a transaction (`id`, `description`, `amount`, `currency`, `date`, `paidById`).
- **Split**: The ledger entries representing who owes what for an expense (`expenseId`, `userId`, `amountOwed`, `splitType`).
- **Settlement**: Dedicated records to track when someone pays another person back to reduce their debt (e.g. "Rohan paid Aisha 15000").

## Anomaly Log (CSV Issues & Handling)
The spreadsheet contained several structural issues. Our CSV ingestion engine was designed to catch and neutralize them:

1. **Negative Amounts (Cancellations/Refunds)** 
   - *Problem*: Found entries with negative amounts (e.g. flight cancellations).
   - *Action*: The parser skips these rows entirely and logs them. Refunds throw off basic split algorithms without a complex dual-ledger. Skipping them treats the expense as "never happened".
2. **Foreign Currency (USD)**
   - *Problem*: Dev went on a trip with spending in USD.
   - *Action*: The parser detects "USD" in the currency column. It multiplies the amount by a fixed, hard-coded exchange rate (1 USD = 83.5 INR) at the moment of import to unify the database ledger in INR.
3. **Settlements disguised as Expenses**
   - *Problem*: Rows like "Rohan paid Aisha" were marked as standard expenses.
   - *Action*: Detected keywords like "paid", "settlement", or "transferred". These are routed to the `Settlement` table rather than the `Expense` table, preventing the app from charging all flatmates for Rohan paying Aisha.
4. **Name Casing & Formatting**
   - *Problem*: Names like "ROhan", "aisha", or trailing spaces.
   - *Action*: All names are trimmed and normalized to Title Case (`Rohan`, `Aisha`) to accurately map to the `User` table.
5. **Missing/Invalid Dates (`#######`)**
   - *Problem*: Excel formatting crushed dates. 
   - *Action*: If a date cannot be parsed to an ISO format, it defaults to the exact time of import, flagged with a warning in the import report.
6. **Percentages not adding to 100**
   - *Problem*: "Pizza Friday" percentages added up to 120% due to typos.
   - *Action*: The parser calculates the total sum of the percentages. It then computes the *relative weight* of each share based on that sum (e.g., if total is 120, a "60%" share effectively becomes `60/120` = 50% of the cost).
7. **Missing Split Data**
   - *Problem*: Blank split types.
   - *Action*: Defaults to an `equal` split among all active group members at the time of the expense.
