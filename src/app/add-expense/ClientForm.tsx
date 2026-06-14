'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { addExpense } from '@/app/actions';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { Loader2, FileText, Banknote, Users, Activity } from 'lucide-react';

export default function ClientForm({ users }: { users: any[] }) {
  const { data: session } = useSession();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [paidById, setPaidById] = useState(users[0]?.id || '');
  const [splitType, setSplitType] = useState('equal');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (session?.user?.name) {
      const u = users.find(u => u.name === session.user?.name);
      if (u) setPaidById(u.id);
    }
  }, [session, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !paidById) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const parsedAmount = parseFloat(amount);
      
      const splits = users.map(u => ({
        userId: u.id,
        amountOwed: parsedAmount / users.length
      }));

      await addExpense({
        description,
        amount: parsedAmount,
        currency,
        paidById,
        splitType: 'equal',
        splits
      });

      toast.success('Expense added successfully!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border shadow-xl rounded-3xl p-8 md:p-12 relative overflow-hidden">
      {/* Decorative blurred blob inside the card */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>

      <form onSubmit={handleSubmit} className="space-y-8 z-10 relative">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
            <FileText className="h-4 w-4 text-yellow-600" />
            <span>Description</span>
          </label>
          <input 
            type="text"
            className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-yellow-500 transition-all text-lg"
            placeholder="e.g. Dinner at Thalassa" 
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-6">
          <div className="flex-1 space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
              <Banknote className="h-4 w-4 text-yellow-600" />
              <span>Amount</span>
            </label>
            <input 
              type="number"
              step="0.01"
              className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-yellow-500 transition-all text-lg font-mono"
              placeholder="0.00" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="w-full md:w-1/3 space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
              <Activity className="h-4 w-4 text-yellow-600" />
              <span>Currency</span>
            </label>
            <div className="relative">
              <select 
                value={currency} 
                onChange={e => setCurrency(e.target.value)}
                className="w-full h-12 pl-4 pr-10 appearance-none rounded-xl border border-border bg-background focus:ring-2 focus:ring-yellow-500 transition-all text-lg"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
              <Users className="h-4 w-4 text-yellow-600" />
              <span>Paid By</span>
            </label>
            <div className="relative">
              <select 
                value={paidById} 
                onChange={e => setPaidById(e.target.value)}
                className="w-full h-12 pl-4 pr-10 appearance-none rounded-xl border border-border bg-background focus:ring-2 focus:ring-yellow-500 transition-all text-lg"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
              <Activity className="h-4 w-4 text-yellow-600" />
              <span>Split Type</span>
            </label>
            <div className="relative opacity-70">
              <select 
                value={splitType} 
                onChange={e => setSplitType(e.target.value)}
                className="w-full h-12 pl-4 pr-10 appearance-none rounded-xl border border-border bg-background focus:ring-2 focus:ring-yellow-500 transition-all text-lg cursor-not-allowed"
                disabled
              >
                <option value="equal">Equal (Everyone)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4 border-t border-border">
          <Button type="button" variant="outline" size="lg" className="rounded-xl" onClick={() => window.location.href = '/dashboard'}>
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={loading} className="rounded-xl shadow-md transition-transform hover:-translate-y-0.5 space-x-2">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Expense</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
