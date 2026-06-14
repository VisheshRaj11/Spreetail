'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './Button';
import { Wallet, LogOut, LayoutDashboard, Plus, Upload } from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <Wallet className="h-6 w-6" />
          <span>Spreetail Expenses</span>
        </a>

        {session ? (
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-1">
              <a href="/dashboard">
                <Button variant="ghost" className="space-x-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </a>
              <a href="/add-expense">
                <Button variant="ghost" className="space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Expense</span>
                </Button>
              </a>
              <a href="/import">
                <Button variant="ghost" className="space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Import</span>
                </Button>
              </a>
            </div>

            <div className="flex items-center space-x-4 border-l border-border pl-6">
              <span className="text-sm font-medium">{session.user?.name}</span>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })} className="space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        ) : (
          <a href="/login">
            <Button>Login</Button>
          </a>
        )}
      </div>
    </nav>
  );
}
