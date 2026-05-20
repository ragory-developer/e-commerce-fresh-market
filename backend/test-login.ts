import { AuthService } from './src/modules/auth/service';
import prisma from './src/config/database';

async function test() {
  const auth = new AuthService();
  try {
    const res = await auth.login('shanto@freshcart.com', '1234');
    console.log('Login success:', res);
  } catch (e) {
    console.error('Login error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
