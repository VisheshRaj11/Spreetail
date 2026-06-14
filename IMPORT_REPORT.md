# Import Report

**Total Records Parsed:** 15  
**Successfully Imported:** 13  
**Skipped Records:** 2  
**Anomalies Detected:** 5  

### Anomaly Log

| Row | Issue | Description | Action Taken |
| :--- | :--- | :--- | :--- |
| 4 | Negative Amount | Amount is -400 (Refund for cancelled tickets). | Skipped. Row omitted from ledger to preserve data integrity. |
| 7 | Foreign Currency | Currency is USD instead of INR. | Converted amount 150 USD to 12525 INR using fixed exchange rate. |
| 9 | Settlement Disguised as Expense | Description is "Rohan paid Aisha". | Re-routed from Expense table to Settlement table. |
| 11 | Invalid Date Format | Date column shows "#######". | Replaced unparseable date with the current timestamp. |
| 14 | Percentage Mismatch | "Pizza Friday" percentages add up to 120% (60, 40, 20). | Calculated relative shares (60/120, 40/120, 20/120). |
