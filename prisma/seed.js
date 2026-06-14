const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: 'Aisha', email: 'aisha@example.com' },
    { name: 'Rohan', email: 'rohan@example.com' },
    { name: 'Priya', email: 'priya@example.com' },
    { name: 'Meera', email: 'meera@example.com' },
    { name: 'Dev', email: 'dev@example.com' },
    { name: 'Sam', email: 'sam@example.com' },
  ];

  console.log('Seeding users...');
  const createdUsers = [];
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
    createdUsers.push(user);
  }

  console.log('Seeding group "Flatmates"...');
  let group = await prisma.group.findFirst({ where: { name: 'Flatmates' } });
  if (!group) {
    group = await prisma.group.create({
      data: { name: 'Flatmates' }
    });
  }

  console.log('Adding members to group...');
  for (const user of createdUsers) {
    const existingMember = await prisma.groupMember.findFirst({
      where: { userId: user.id, groupId: group.id }
    });
    
    if (!existingMember) {
      // Define specific rules for Meera (left in March) and Sam (joined in April)
      let joinedAt = new Date('2026-01-01');
      let leftAt = null;
      
      if (user.name === 'Meera') {
        leftAt = new Date('2026-03-31T23:59:59Z');
      }
      if (user.name === 'Sam') {
        joinedAt = new Date('2026-04-15T00:00:00Z');
      }

      await prisma.groupMember.create({
        data: {
          userId: user.id,
          groupId: group.id,
          joinedAt: joinedAt,
          leftAt: leftAt
        }
      });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
