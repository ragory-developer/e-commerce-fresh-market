const { PrismaClient } = require('@prisma/client');
const { getActivePrice } = require('./dist/utils/helpers');

const prisma = new PrismaClient();

async function run() {
  const products = await prisma.product.findMany({
    where: { specialPrice: { not: null } },
    take: 1
  });
  if (products.length === 0) {
    console.log("No discounted products found");
    return;
  }
  const p = products[0];
  console.log({
    id: p.id,
    name: p.name,
    price: p.price,
    specialPrice: p.specialPrice,
    start: p.specialPriceStart,
    end: p.specialPriceEnd,
    active: getActivePrice(p)
  });
}
run().catch(console.error).finally(() => prisma.$disconnect());
