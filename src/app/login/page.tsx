'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Loader2, Wallet, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState('Aisha');
  const [loading, setLoading] = useState(false);

  const users = ['Aisha', 'Rohan', 'Priya', 'Meera', 'Dev', 'Sam'];

  const handleLogin = async () => {
    setLoading(true);
    await signIn('credentials', {
      username: selectedUser,
      callbackUrl: '/dashboard'
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 bg-gradient-to-br from-yellow-100 to-yellow-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="z-10 max-w-lg">
          <Wallet className="h-16 w-16 text-yellow-600 mb-8" />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Manage shared expenses with ease.
          </h1>
          <p className="text-xl text-gray-600">
            Select your profile to access your personalized dashboard, track your balances, and settle up securely.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative bg-transparent">
        <div className="w-full max-w-md space-y-8 bg-card/50 backdrop-blur-xl p-10 rounded-3xl border border-border shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Please sign in to your account</p>
          </div>

          <div className="space-y-6 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Select Profile</span>
              </label>
              <div className="relative">
                <select 
                  value={selectedUser} 
                  onChange={e => setSelectedUser(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 text-lg appearance-none rounded-xl border border-border bg-background focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all shadow-sm"
                >
                  {users.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-lg rounded-xl shadow-md transition-transform hover:-translate-y-0.5 space-x-2" 
              onClick={handleLogin} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In Securely</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
