import prisma from './src/config/database';

async function check() {
  console.log('Available prisma models:', Object.keys(prisma).filter(k => !k.startsWith('_')));
  process.exit(0);
}

check();
