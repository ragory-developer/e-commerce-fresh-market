const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.walletTransaction.count();
  const autoDeductions = await prisma.walletTransaction.findMany({
    where: { note: { contains: 'auto-deduction' } },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('Total Count:', count);
  console.log('Auto Deductions:', JSON.stringify(autoDeductions, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
