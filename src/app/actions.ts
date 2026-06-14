'use server';

import { PrismaClient } from '@prisma/client';
import { calculateBalances } from '@/lib/balances';
import { processCsvData } from '@/lib/csv-import';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function getDashboardData() {
  const users = await prisma.user.findMany();
  const expenses = await prisma.expense.findMany({
    include: { splits: true }
  });
  const settlements = await prisma.settlement.findMany();

  const { balances, simplifiedDebts } = calculateBalances(users, expenses, settlements);

  return {
    users,
    expenses,
    settlements,
    balances,
    simplifiedDebts
  };
}

export async function processImport(csvContent: string) {
  const report = processCsvData(csvContent);

  // We should actually insert these into the database if not just a dry run
  // But since the assignment asks for an Import feature, let's insert them.
  // Wait, first we need to get the Group 'Flatmates'
  let group = await prisma.group.findFirst({ where: { name: 'Flatmates' } });
  if (!group) {
    group = await prisma.group.create({ data: { name: 'Flatmates' } });
  }

  // Get users map
  const users = await prisma.user.findMany();
  const userMap = new Map(users.map(u => [u.name.toLowerCase(), u.id]));

  for (const exp of report.expenses) {
    const paidById = userMap.get(exp.paidBy.toLowerCase());
    if (!paidById) continue; // Skip if payer not found

    if (exp.isSettlement) {
      // It's a settlement
      // A settlement usually has a paidBy and paidTo. 
      // If splitWith has 1 person, that's who it was paid to
      let paidToId = null;
      if (exp.splitWith.length === 1) {
        paidToId = userMap.get(exp.splitWith[0].toLowerCase());
      }
      if (paidToId) {
        await prisma.settlement.create({
          data: {
            groupId: group.id,
            paidById,
            paidToId,
            amount: exp.amount,
            currency: exp.currency,
            date: exp.date
          }
        });
      }
    } else {
      // It's an expense
      const createdExp = await prisma.expense.create({
        data: {
          description: exp.description,
          amount: exp.amount,
          currency: exp.currency,
          date: exp.date,
          groupId: group.id,
          paidById: paidById
        }
      });

      // Now create splits
      const splitUserIds = exp.splitWith.map(name => userMap.get(name.toLowerCase())).filter(Boolean) as string[];
      
      if (splitUserIds.length === 0) continue;

      let splitAmount = 0;
      if (exp.splitType === 'equal') {
        splitAmount = exp.amount / splitUserIds.length;
        for (const userId of splitUserIds) {
          await prisma.split.create({
            data: {
              expenseId: createdExp.id,
              userId,
              splitType: 'equal',
              amountOwed: splitAmount
            }
          });
        }
      } else if (exp.splitType === 'unequal') {
        // format: Rohan 700; Priya 800
        const details = exp.splitDetails.split(';');
        for (const detail of details) {
          const [name, amt] = detail.trim().split(' ');
          const uId = userMap.get(name.toLowerCase());
          if (uId) {
            await prisma.split.create({
              data: {
                expenseId: createdExp.id,
                userId: uId,
                splitType: 'unequal',
                amountOwed: parseFloat(amt)
              }
            });
          }
        }
      } else if (exp.splitType === 'percentage') {
        // format: Aisha 30%; Rohan 50%; Priya 30%
        const details = exp.splitDetails.split(';');
        let totalPct = 0;
        const parsed = details.map(d => {
          const [name, pctStr] = d.trim().split(' ');
          const pct = parseFloat(pctStr.replace('%', ''));
          totalPct += pct;
          return { name, pct };
        });

        for (const p of parsed) {
          const uId = userMap.get(p.name.toLowerCase());
          if (uId) {
            // Normalize percentage
            const normalizedPct = p.pct / totalPct;
            await prisma.split.create({
              data: {
                expenseId: createdExp.id,
                userId: uId,
                splitType: 'percentage',
                amountOwed: exp.amount * normalizedPct
              }
            });
          }
        }
      } else if (exp.splitType === 'share') {
        // format: Aisha 1; Rohan 2; Priya 1; Dev 2
        const details = exp.splitDetails.split(';');
        let totalShares = 0;
        const parsed = details.map(d => {
          const [name, shareStr] = d.trim().split(' ');
          const share = parseFloat(shareStr);
          totalShares += share;
          return { name, share };
        });

        for (const p of parsed) {
          const uId = userMap.get(p.name.toLowerCase());
          if (uId) {
            await prisma.split.create({
              data: {
                expenseId: createdExp.id,
                userId: uId,
                splitType: 'share',
                amountOwed: (exp.amount / totalShares) * p.share
              }
            });
          }
        }
      }
    }
  }

  return report;
}

export async function addExpense(data: {
  description: string;
  amount: number;
  currency: string;
  paidById: string;
  splitType: string;
  splits: { userId: string; amountOwed: number }[];
}) {
  let group = await prisma.group.findFirst({ where: { name: 'Flatmates' } });
  if (!group) {
    group = await prisma.group.create({ data: { name: 'Flatmates' } });
  }

  const createdExp = await prisma.expense.create({
    data: {
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      date: new Date(),
      groupId: group.id,
      paidById: data.paidById
    }
  });

  for (const split of data.splits) {
    await prisma.split.create({
      data: {
        expenseId: createdExp.id,
        userId: split.userId,
        splitType: data.splitType,
        amountOwed: split.amountOwed
      }
    });
  }

  return createdExp;
}
