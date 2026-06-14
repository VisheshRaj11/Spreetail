import React from 'react';
import { Button } from '@/components/ui/Button';
import { Wallet, Users, Receipt, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-accent opacity-50 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[30rem] h-[30rem] rounded-full bg-accent opacity-30 blur-3xl -z-10" />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary mb-6">
          Shared Expenses, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700">
            Simplified.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-muted-foreground mb-10">
          The smart way for flatmates to track bills, settle debts, and keep relationships intact. No more messy spreadsheets or magic numbers.
        </p>

        <div className="flex space-x-4">
          <a href="/login">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <a href="/import">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full backdrop-blur-sm bg-background/50 border-2">
              Import CSV
            </Button>
          </a>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="flex flex-col items-center p-6 bg-background/60 backdrop-blur-md rounded-2xl border border-border shadow-sm">
            <div className="p-4 bg-accent/30 rounded-full mb-4">
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Group Dynamics</h3>
            <p className="text-muted-foreground">Handles mid-month move-ins and move-outs automatically.</p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-background/60 backdrop-blur-md rounded-2xl border border-border shadow-sm">
            <div className="p-4 bg-accent/30 rounded-full mb-4">
              <Receipt className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Ledgers</h3>
            <p className="text-muted-foreground">Every exact debt breakdown explained. No magic numbers.</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-background/60 backdrop-blur-md rounded-2xl border border-border shadow-sm">
            <div className="p-4 bg-accent/30 rounded-full mb-4">
              <Wallet className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Multi-Currency</h3>
            <p className="text-muted-foreground">Seamless conversion for international trips and varied expenses.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
