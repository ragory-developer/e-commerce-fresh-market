import { PrismaClient } from '@prisma/client';
import { createDefaultHomeDocument } from './src/modules/builder/schema';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding packs...');

  const baseDoc = createDefaultHomeDocument();
  
  // Create Unlocked Packs
  const unlockedPacks = [
    { key: 'eid-2026', name: 'Eid Campaign 2026', variant: 'eid' },
    { key: 'puja-2026', name: 'Puja Special 2026', variant: 'puja' },
    { key: 'summer-sale', name: 'Summer Mega Sale', variant: 'default' },
  ];

  for (const pack of unlockedPacks) {
    const doc = JSON.parse(JSON.stringify(baseDoc));
    doc.sections[0].props.themeVariant = pack.variant;
    doc.sections[0].props.title = `${pack.name} Special`;
    
    await prisma.builderTemplatePack.upsert({
      where: { key: pack.key },
      update: {},
      create: {
        key: pack.key,
        name: pack.name,
        status: 'unlocked',
        templates: {
          create: {
            name: `${pack.name} - Layout 1`,
            pageType: 'home',
            document: doc as any,
          }
        }
      }
    });
  }

  // Create Locked Packs
  const lockedPacks = [
    { key: 'ramadan-2027', name: 'Ramadan 2027', variant: 'eid' },
    { key: 'black-friday', name: 'Black Friday 2026', variant: 'default' },
    { key: 'new-year-2027', name: 'New Year 2027', variant: 'default' },
  ];

  for (const pack of lockedPacks) {
    const doc = JSON.parse(JSON.stringify(baseDoc));
    doc.sections[0].props.themeVariant = pack.variant;
    doc.sections[0].props.title = `${pack.name} Super Deals`;

    await prisma.builderTemplatePack.upsert({
      where: { key: pack.key },
      update: {},
      create: {
        key: pack.key,
        name: pack.name,
        status: 'locked',
        templates: {
          create: {
            name: `${pack.name} - Layout 1`,
            pageType: 'home',
            document: doc as any,
          }
        }
      }
    });
  }

  console.log('Successfully seeded 3 unlocked and 3 locked packs!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
