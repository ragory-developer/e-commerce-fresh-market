import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const setting = await prisma.setting.findMany();
  console.log("All settings:", setting);
  
  const balance = await prisma.setting.findUnique({
    where: { key: 'wallet_balance' }
  });
  console.log("Wallet Balance:", balance);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
