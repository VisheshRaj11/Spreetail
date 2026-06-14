import { Expense, Split, Settlement, User } from '@prisma/client';

export interface UserBalance {
  userId: string;
  name: string;
  netBalance: number; // Positive means they are owed money, negative means they owe money
  totalPaid: number;
  totalOwed: number;
  breakdown: {
    expenseId: string;
    description: string;
    amountPaidByMe: number;
    amountOwedByMe: number;
  }[];
}

export interface Debt {
  fromUserId: string;
  toUserId: string;
  fromName: string;
  toName: string;
  amount: number;
}

export function calculateBalances(
  users: User[],
  expenses: (Expense & { splits: Split[] })[],
  settlements: Settlement[]
): { balances: UserBalance[]; simplifiedDebts: Debt[] } {
  
  const userMap = new Map<string, UserBalance>();

  for (const user of users) {
    userMap.set(user.id, {
      userId: user.id,
      name: user.name,
      netBalance: 0,
      totalPaid: 0,
      totalOwed: 0,
      breakdown: []
    });
  }

  // Process Expenses
  for (const expense of expenses) {
    // The person who paid gets credit
    const payer = userMap.get(expense.paidById);
    if (payer) {
      payer.totalPaid += expense.amount;
      payer.netBalance += expense.amount;
    }

    // Every person in the split owes their portion
    for (const split of expense.splits) {
      const debtor = userMap.get(split.userId);
      if (debtor) {
        debtor.totalOwed += split.amountOwed;
        debtor.netBalance -= split.amountOwed;

        debtor.breakdown.push({
          expenseId: expense.id,
          description: expense.description,
          amountPaidByMe: expense.paidById === split.userId ? expense.amount : 0,
          amountOwedByMe: split.amountOwed
        });
      }
    }
  }

  // Process Settlements
  for (const settlement of settlements) {
    const payer = userMap.get(settlement.paidById); // person sending money (decreases their debt, so their net balance goes up)
    const receiver = userMap.get(settlement.paidToId); // person receiving money (decreases what they are owed, so their net balance goes down)

    if (payer) {
      payer.netBalance += settlement.amount;
      payer.breakdown.push({
        expenseId: settlement.id,
        description: 'Settlement Paid',
        amountPaidByMe: settlement.amount,
        amountOwedByMe: 0
      });
    }
    if (receiver) {
      receiver.netBalance -= settlement.amount;
      receiver.breakdown.push({
        expenseId: settlement.id,
        description: 'Settlement Received',
        amountPaidByMe: 0,
        amountOwedByMe: settlement.amount
      });
    }
  }

  const balances = Array.from(userMap.values());

  // Simplify Debts Algorithm (Greedy matching)
  const debtors = balances.filter(b => b.netBalance < -0.01).map(b => ({ ...b })); // Owe money
  const creditors = balances.filter(b => b.netBalance > 0.01).map(b => ({ ...b })); // Are owed money

  debtors.sort((a, b) => a.netBalance - b.netBalance); // most in debt first
  creditors.sort((a, b) => b.netBalance - a.netBalance); // owed the most first

  const simplifiedDebts: Debt[] = [];

  let i = 0; // debtors index
  let j = 0; // creditors index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const debt = Math.min(-debtor.netBalance, creditor.netBalance);
    
    // Round to 2 decimals to prevent floating point issues
    const roundedDebt = Math.round(debt * 100) / 100;

    if (roundedDebt > 0) {
      simplifiedDebts.push({
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        fromName: debtor.name,
        toName: creditor.name,
        amount: roundedDebt
      });
    }

    debtor.netBalance += debt;
    creditor.netBalance -= debt;

    if (Math.abs(debtor.netBalance) < 0.01) i++;
    if (Math.abs(creditor.netBalance) < 0.01) j++;
  }

  return { balances, simplifiedDebts };
}
