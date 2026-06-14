import React from 'react';
import { getDashboardData } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const data = await getDashboardData();
  const { balances, simplifiedDebts } = data;

  return (
    <div className="container mx-auto p-8 max-w-5xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flatmates Expenses Dashboard</h1>
        <div className="space-x-4">
          <a href="/import">
            <Button variant="outline">Import CSV</Button>
          </a>
          <a href="/add-expense">
            <Button>Add Expense</Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Balances Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Who owes whom? (Simplified Debts)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {simplifiedDebts.length === 0 ? (
              <p className="text-muted-foreground">Everyone is settled up!</p>
            ) : (
              <div className="space-y-3">
                {simplifiedDebts.map((debt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border border-accent">
                    <span className="font-medium">{debt.fromName}</span>
                    <span className="text-sm text-muted-foreground mx-2">owes</span>
                    <span className="font-medium">{debt.toName}</span>
                    <span className="font-bold ml-auto font-mono">₹{debt.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Individual Breakdowns */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {balances.map(b => (
              <div key={b.userId} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-semibold">{b.name}</h4>
                  <p className="text-xs text-muted-foreground">Paid: ₹{b.totalPaid.toFixed(2)} | Owed: ₹{b.totalOwed.toFixed(2)}</p>
                </div>
                <div className={`font-bold font-mono ${b.netBalance > 0 ? 'text-green-600' : b.netBalance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {b.netBalance > 0 ? '+' : ''}{b.netBalance.toFixed(2)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Breakdown for Rohan (and others) */}
      <h2 className="text-2xl font-bold mt-12 mb-4">Detailed Breakdowns</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {balances.map(b => (
          <Card key={`detail-${b.userId}`}>
            <CardHeader>
              <CardTitle className="text-lg">{b.name}'s Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {b.breakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity.</p>
                ) : (
                  b.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                      <span className="truncate pr-2" title={item.description}>{item.description}</span>
                      <div className="flex space-x-2 text-right shrink-0">
                        {item.amountPaidByMe > 0 && <span className="text-green-600">+₹{item.amountPaidByMe.toFixed(2)}</span>}
                        {item.amountOwedByMe > 0 && <span className="text-red-600">-₹{item.amountOwedByMe.toFixed(2)}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
