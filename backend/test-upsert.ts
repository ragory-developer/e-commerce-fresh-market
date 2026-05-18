import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const productId = "cmn3i58110001ftu4qh7lcody";
  const incomingIds = ["cmn3i58110002ftu45xivty23"];
  
  const variants = [{
    id: "cmn3i58110002ftu45xivty23",
    price: 999 /* test price */
  }];

  const data: any = {
    price: 100,
    variants: {
      upsert: variants.map((v: any, idx: number) => ({
        where: { id: v.id || 'new_placeholder_' + idx },
        update: {
          price: v.price,
        },
        create: {
          price: v.price,
        }
      }))
    }
  };

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data,
      include: { variants: true }
    });
    console.log("SUCCESS:", JSON.stringify(product.variants, null, 2));
  } catch (e) {
    console.error("ERROR:", e);
  }
}

main().finally(() => prisma.$disconnect());
