import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Clean up existing data ---
  await prisma.user.deleteMany();

  // --- Create Admin User ---
  const adminPassword = await bcrypt.hash('1234', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'rahat.ete@gmail.com',
      password: adminPassword,
      name: 'Admin User',
      phone: '01700000000',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin created: rahat.ete@gmail.com / 1234');

  // --- Create Regular User ---
  const userPassword = await bcrypt.hash('user1234', 12);
  const user = await prisma.user.create({
    data: {
      email: 'user@freshcart.com',
      password: userPassword,
      name: 'Rahim Ahmed',
      phone: '01800000000',
      address: '123 Gulshan Avenue',
      city: 'Dhaka',
      area: 'Gulshan-2',
    },
  });
  await prisma.cart.create({ data: { userId: user.id } });
  console.log('✅ User created: user@freshcart.com / user1234');

  // --- Bangladesh Divisions (States) ---
  const divisions = [
    { name: 'Rangpur Division' },
    { name: 'Mymensingh Division' },
    { name: 'Dhaka Division' },
    { name: 'Barisal Division' },
    { name: 'Khulna Division' },
    { name: 'Rajshahi Division' },
    { name: 'Chittagong Division' },
    { name: 'Sylhet Division' },
  ];

  for (const division of divisions) {
    await prisma.state.upsert({
      where: { name: division.name },
      update: {},
      create: { name: division.name, status: 'active' },
    });
  }
  console.log(`✅ ${divisions.length} Bangladesh divisions seeded`);

  // --- Cities by Division ---
  const cityData: { stateName: string; cities: string[] }[] = [
    {
      stateName: 'Barisal Division',
      cities: ['Patuakhali', 'Jhalokati', 'Bhola', 'Barisal', 'Barguna District', 'Pirojpur'],
    },
    {
      stateName: 'Chittagong Division',
      cities: [
        'Chandpur', 'Rangamati', 'Brahmanbaria', 'Lakshmipur',
        'Cumilla', 'Chittagong Area', 'Feni', 'Noakhali',
        'Bandarban District', "Cox's Bazar", 'Khagrachari',
      ],
    },
    {
      stateName: 'Dhaka Division',
      cities: [
        'Dhaka City', 'Savar (Dhaka Sub Area)', 'Narayanganj (Dhaka Sub Area)',
        'Tongi', 'Gazipur', 'Faridpur', 'Madaripur', 'Kishoreganj',
        'Manikganj', 'Munshiganj', 'Gopalganj', 'Rajbari', 'Narsingdi',
        'Tangail', 'Shariatpur', 'Dhamrai', 'Dohar Upazila',
      ],
    },
    {
      stateName: 'Khulna Division',
      cities: [
        'Magura', 'Jashore', 'Jhenaidah', 'Kushtia', 'Khulna',
        'Meherpur', 'Satkhira', 'Narail', 'Chuadanga', 'Bagerhat District',
      ],
    },
    {
      stateName: 'Mymensingh Division',
      cities: ['Sherpur', 'Jamalpur', 'Netrokona', 'Mymensingh'],
    },
    {
      stateName: 'Rajshahi Division',
      cities: [
        'Natore', 'Chapainawabganj', 'Pabna', 'Joypurhat',
        'Naogaon', 'Bogura', 'Rajshahi', 'Sirajganj',
      ],
    },
    {
      stateName: 'Sylhet Division',
      cities: ['Habiganj', 'Sunamganj', 'Moulvibazar', 'Sylhet'],
    },
    {
      stateName: 'Rangpur Division',
      cities: [
        'Dinajpur', 'Rangpur', 'Gaibandha', 'Kurigram',
        'Thakurgaon', 'Panchagarh', 'Nilphamari', 'Lalmonirhat',
      ],
    },
  ];

  for (const group of cityData) {
    const state = await prisma.state.findFirst({ where: { name: group.stateName } });
    if (!state) { console.warn(`⚠️  State not found: ${group.stateName}`); continue; }

    for (const cityName of group.cities) {
      const existing = await prisma.city.findFirst({ where: { name: cityName, stateId: state.id } });
      if (!existing) {
        await prisma.city.create({ data: { name: cityName, stateId: state.id, status: 'active' } });
      }
    }
    console.log(`✅ ${group.cities.length} cities seeded for ${group.stateName}`);
  }

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
