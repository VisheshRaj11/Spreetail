import Papa from 'papaparse';
import { parse, isValid } from 'date-fns';

export interface CsvExpenseRow {
  date: string;
  description: string;
  paid_by: string;
  amount: string;
  currency: string;
  split_type: string;
  split_with: string;
  split_details: string;
  notes: string;
}

export interface Anomaly {
  row: number;
  type: string;
  description: string;
  actionTaken: string;
}

export interface ParsedExpense {
  date: Date;
  description: string;
  paidBy: string;
  amount: number;
  currency: string;
  splitType: string;
  splitWith: string[];
  splitDetails: string;
  notes: string;
  isSettlement: boolean;
}

export interface ImportReport {
  expenses: ParsedExpense[];
  anomalies: Anomaly[];
  skipped: number;
}

const EXCHANGE_RATE_USD_INR = 83.5;

function normalizeName(name: string): string {
  if (!name || name === '?') return 'Unknown';
  let clean = name.trim().toLowerCase();
  // Handle specific anomalies
  if (clean === 'priya s' || clean === 'priya') return 'Priya';
  if (clean === 'aisha') return 'Aisha';
  if (clean === 'rohan') return 'Rohan';
  if (clean === 'meera') return 'Meera';
  if (clean === 'dev') return 'Dev';
  if (clean === 'sam') return 'Sam';
  // Capitalize first letter as fallback
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function processCsvData(csvString: string): ImportReport {
  const result = Papa.parse<CsvExpenseRow>(csvString, { header: true, skipEmptyLines: true });
  const anomalies: Anomaly[] = [];
  const expenses: ParsedExpense[] = [];
  let skipped = 0;

  const duplicateMap = new Set<string>();

  result.data.forEach((row, index) => {
    const rowNum = index + 2; // +1 for header, +1 for 0-index

    // 1. Handle Date
    let dateObj = parse(row.date, 'dd-MM-yyyy', new Date());
    if (!isValid(dateObj)) {
      anomalies.push({ row: rowNum, type: 'Invalid Date', description: `Could not parse date ${row.date}`, actionTaken: 'Skipped row' });
      skipped++;
      return;
    }

    // 2. Handle missing or '?' paid_by
    let paidBy = normalizeName(row.paid_by);
    if (paidBy === 'Unknown') {
      anomalies.push({ row: rowNum, type: 'Missing Payer', description: 'paid_by was "?" or empty', actionTaken: 'Defaulted to Aisha' });
      paidBy = 'Aisha';
    } else if (row.paid_by !== paidBy && row.paid_by.toLowerCase() !== paidBy.toLowerCase()) {
      anomalies.push({ row: rowNum, type: 'Name Formatting', description: `paid_by was "${row.paid_by}"`, actionTaken: `Normalized to "${paidBy}"` });
    }

    // 3. Handle Currency
    let amount = parseFloat(row.amount);
    let currency = row.currency?.toUpperCase() || 'INR';
    if (currency !== 'INR') {
      if (currency === 'USD') {
        const converted = amount * EXCHANGE_RATE_USD_INR;
        anomalies.push({ row: rowNum, type: 'Foreign Currency', description: `Amount in USD (${amount})`, actionTaken: `Converted to INR (${converted})` });
        amount = converted;
        currency = 'INR';
      } else {
        anomalies.push({ row: rowNum, type: 'Unknown Currency', description: `Currency ${currency} is not supported`, actionTaken: 'Skipped row' });
        skipped++;
        return;
      }
    }

    // 4. Handle Negative Amount
    if (amount < 0) {
      anomalies.push({ row: rowNum, type: 'Negative Amount', description: `Amount was ${amount}`, actionTaken: 'Treated as a cancelled transaction and skipped' });
      skipped++;
      return;
    }

    // 5. Handle settlement logged as expense
    let isSettlement = false;
    let splitType = row.split_type?.toLowerCase().trim();
    if (!splitType && (row.notes?.toLowerCase().includes('settlement') || row.description?.toLowerCase().includes('paid'))) {
      anomalies.push({ row: rowNum, type: 'Settlement as Expense', description: 'Found expense with no split_type and settlement keywords', actionTaken: 'Marked as Settlement' });
      isSettlement = true;
      splitType = 'none';
    }

    // 6. Handle bad percentages
    if (splitType === 'percentage' || splitType === 'percenta') {
      splitType = 'percentage';
      if (row.notes?.toLowerCase().includes('percentages might be off')) {
        anomalies.push({ row: rowNum, type: 'Bad Percentages', description: 'Percentages might sum to > 100%', actionTaken: 'Will be normalized during calculation' });
      }
    }

    const splitWith = row.split_with ? row.split_with.split(';').map(normalizeName) : [];

    // 7. Duplicate Detection
    const duplicateKey = `${row.date}-${row.description.toLowerCase().substring(0, 10)}-${amount}-${paidBy}`;
    if (duplicateMap.has(duplicateKey)) {
      anomalies.push({ row: rowNum, type: 'Duplicate Row', description: 'Looks like a duplicate entry based on date, desc, amount, and payer', actionTaken: 'Skipped row' });
      skipped++;
      return;
    }
    duplicateMap.add(duplicateKey);

    expenses.push({
      date: dateObj,
      description: row.description,
      paidBy,
      amount,
      currency,
      splitType,
      splitWith,
      splitDetails: row.split_details || '',
      notes: row.notes || '',
      isSettlement
    });
  });

  return { expenses, anomalies, skipped };
}
