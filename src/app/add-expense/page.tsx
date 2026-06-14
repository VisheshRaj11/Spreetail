import { PrismaClient } from '@prisma/client';
import ClientForm from './ClientForm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function AddExpensePage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const users = await prisma.user.findMany();
  
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Add New Expense</h1>
      <ClientForm users={users} />
    </div>
  );
}
