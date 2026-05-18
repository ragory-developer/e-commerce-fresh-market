import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const cnt = await prisma.product.count({
    where: { 
      specialPrice: { not: null },
      AND: [
        { OR: [ { specialPriceEnd: null }, { specialPriceEnd: { gte: new Date() } } ] }
      ]
    }
  });
  console.log("Total products with active promotions: " + cnt);
}
main().catch(console.error).finally(() => prisma.$disconnect());
