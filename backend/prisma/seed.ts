import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  createDefaultHomeDocument,
  createMinimalHomeDocument,
  createDiscountHomeDocument,
  createWellnessHomeDocument,
} from '../src/modules/builder/schema';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Clean up existing data ---
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.product.deleteMany();
  await prisma.builderComponent.deleteMany();

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

  const shantoAdmin = await prisma.user.create({
    data: {
      email: 'shanto@freshcart.com',
      password: adminPassword,
      name: 'shanto',
      phone: '01763788733',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin created: shanto@freshcart.com / 1234 (Phone: 01763788733)');

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
  }
  console.log('✅ Cities seeded');

  // --- Seed Categories ---
  const catSkincare = await prisma.category.create({
    data: { name: 'Organic Skincare', slug: 'organic-skincare', content: 'Natural skin health products' },
  });
  const catFruits = await prisma.category.create({
    data: { name: 'Fresh Fruits', slug: 'fresh-fruits', content: 'Healthy delicious fresh fruits' },
  });
  const catVegetables = await prisma.category.create({
    data: { name: 'Green Vegetables', slug: 'green-vegetables', content: 'Organic locally grown greens' },
  });
  const catDairy = await prisma.category.create({
    data: { name: 'Dairy & Eggs', slug: 'dairy-eggs', content: 'Fresh farm milk, cheese, and eggs' },
  });
  console.log('✅ Categories seeded');

  // --- Seed Products ---
  const productsToSeed = [
    {
      name: 'Aloe Vera Soothing Gel',
      slug: 'aloe-vera-soothing-gel',
      description: 'Pure cooling organic aloe vera gel for body and face hydration.',
      price: 450,
      specialPrice: 390,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
      images: '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"]',
      unit: 'tube',
      weight: '150ml',
      featured: true,
      categoryId: catSkincare.id,
    },
    {
      name: 'Vitamin C Glow Serum',
      slug: 'vitamin-c-glow-serum',
      description: 'Highly effective daily vitamin C serum for brighter, radiant skin.',
      price: 1200,
      specialPrice: 990,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      images: '["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"]',
      unit: 'bottle',
      weight: '30ml',
      featured: true,
      categoryId: catSkincare.id,
    },
    {
      name: 'Tea Tree Cleansing Foam',
      slug: 'tea-tree-cleansing-foam',
      description: 'Refreshing foam wash with natural tea tree extract for acne control.',
      price: 650,
      stock: 75,
      image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=800&q=80',
      images: '["https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=800&q=80"]',
      unit: 'bottle',
      weight: '120ml',
      featured: true,
      categoryId: catSkincare.id,
    },
    {
      name: 'Organic Red Apples',
      slug: 'organic-red-apples',
      description: 'Sweet, crisp and juicy red apples sourced from local orchards.',
      price: 280,
      stock: 200,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      images: '["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80"]',
      unit: 'kg',
      weight: '1kg',
      featured: true,
      categoryId: catFruits.id,
    },
    {
      name: 'Fresh Organic Bananas',
      slug: 'fresh-organic-bananas',
      description: 'Sweet organic yellow bananas rich in potassium and energy.',
      price: 120,
      specialPrice: 100,
      stock: 150,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
      images: '["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80"]',
      unit: 'dozen',
      weight: '12pcs',
      featured: true,
      categoryId: catFruits.id,
    },
    {
      name: 'Fresh Milk 1L',
      slug: 'fresh-milk-1l',
      description: 'Pasteurized pure dairy milk from organic country farms.',
      price: 95,
      specialPrice: 80,
      stock: 80,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80',
      images: '["https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80"]',
      unit: 'bottle',
      weight: '1L',
      featured: true,
      categoryId: catDairy.id,
    },
    {
      name: 'Brown Farm Eggs 12pcs',
      slug: 'brown-farm-eggs-12pcs',
      description: 'Farm-fresh healthy brown eggs packed with proteins.',
      price: 150,
      stock: 120,
      image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=800&q=80',
      images: '["https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=800&q=80"]',
      unit: 'box',
      weight: '12pcs',
      featured: true,
      categoryId: catDairy.id,
    },
  ];

  for (const prod of productsToSeed) {
    const { categoryId, ...rest } = prod;
    await prisma.product.create({
      data: {
        ...rest,
        categories: { connect: [{ id: categoryId }] },
      },
    });
  }
  console.log('✅ Products seeded');

  // --- Seed Builder Components & Contents ---
  const components = [
    {
      name: "HeroBanner",
      label: "Hero Banner",
      category: "Hero",
      contents: {
        title: "Discover Natural Beauty",
        subtitle: "Premium skincare for your daily routine",
        ctaText: "Shop Now",
        ctaHref: "/products",
        imageSrc: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
        textAlign: "left",
      },
    },
    {
      name: "SpecialOffersBanner",
      label: "Special Offers",
      category: "Marketing",
      contents: {
        title: "Special Offers",
        subtitle: "Get the best deals",
        ctaText: "Shop Now",
        ctaHref: "/products?sort=discount",
        bgColor: "from-blue-600 via-blue-700 to-indigo-800",
        leftImageSrc: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
        rightImageSrc: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80",
        textAlign: "left",
      },
    },
    {
      name: "ProductShowcase",
      label: "Product Grid",
      category: "Commerce",
      contents: {
        title: "Shop by Category",
        subtitle: "Browse our curated collection of premium products",
        showcaseCategoryId: "all",
        textAlign: "left",
      },
    },
    {
      name: "PromoBadgeGrid",
      label: "Promo Features",
      category: "Marketing",
      contents: {
        badges: [
          {
            title: "Buy 1 Get 1",
            subtitle: "Free",
            iconName: "Gift",
            bgColor: "from-blue-500 to-blue-700",
            href: "/products?offer=bogo",
          },
          {
            title: "Stock",
            subtitle: "Clearance",
            iconName: "Package",
            bgColor: "from-emerald-500 to-teal-700",
            href: "/products?offer=clearance",
          },
          {
            title: "Combo",
            subtitle: "Sale",
            iconName: "Boxes",
            bgColor: "from-purple-500 to-indigo-700",
            href: "/products?offer=combo",
          },
          {
            title: "Makeup",
            subtitle: "Sale",
            iconName: "Sparkles",
            bgColor: "from-rose-500 to-pink-700",
            href: "/products?offer=makeup",
          },
        ],
      },
    },
    {
      name: "TestimonialSection",
      label: "Testimonials",
      category: "Content",
      contents: {
        title: "Real Results, Real Beauty",
        subtitle: "See what our customers are saying",
        textAlign: "center",
        testimonials: [
          {
            name: "Sarah Johnson",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
            rating: 5,
            review: "Absolutely love the glow serum! My skin has never looked better. Saw visible results within just 2 weeks of daily use.",
            product: "Radiance Glow Serum",
          },
          {
            name: "Emily Chen",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
            rating: 5,
            review: "The moisturizer is so hydrating without being heavy. Perfect for my combination skin type. Highly recommend!",
            product: "Hydra Boost Moisturizer",
          },
          {
            name: "Aisha Rahman",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            rating: 4,
            review: "Great value for money. The vitamin C serum helped fade my dark spots significantly. Will repurchase for sure.",
            product: "Vitamin C Brightening Serum",
          },
          {
            name: "Lisa Park",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
            rating: 5,
            review: "The sunscreen is lightweight and doesn't leave a white cast. Finally found my HG sunscreen! Perfect under makeup.",
            product: "Invisible Shield SPF 50",
          },
        ],
      },
    },
    {
      name: "HotDealsSection",
      label: "Hot Deals",
      category: "Commerce",
      contents: {
        title: "Hot Deals",
        subtitle: "Grab them before they're gone!",
        deals: [
          {
            name: "Premium Face Wash Bundle",
            originalPrice: "৳1,800",
            salePrice: "৳999",
            discount: "45% OFF",
            image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
            endsIn: "2d 14h",
          },
          {
            name: "Korean Skincare Set",
            originalPrice: "৳3,500",
            salePrice: "৳2,100",
            discount: "40% OFF",
            image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80",
            endsIn: "1d 8h",
          },
          {
            name: "Anti-Aging Combo Pack",
            originalPrice: "৳4,200",
            salePrice: "৳2,520",
            discount: "40% OFF",
            image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=400&q=80",
            endsIn: "3d 5h",
          },
          {
            name: "SPF Protection Kit",
            originalPrice: "৳2,000",
            salePrice: "৳1,200",
            discount: "40% OFF",
            image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=400&q=80",
            endsIn: "5h 30m",
          },
        ],
      },
    },
    {
      name: "ConsultationBanner",
      label: "Consultation",
      category: "Marketing",
      contents: {
        title: "Doctor's Skincare Consultation",
        subtitle: "Get free personalized consultation from top skin specialists.",
        ctaText: "Book Free Session",
        ctaHref: "/consultation",
        imageSrc: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",
        imageAlign: "right",
      },
    },
    {
      name: "RoutineBanner",
      label: "Routine",
      category: "Marketing",
      contents: {
        title: "Daily Skincare Routine Guide",
        subtitle: "Simple steps for glowing health",
        description: "Consistency is key to skin health. Follow our morning and night skincare routine guides tailored specifically for your skin profile to achieve natural, glowing beauty.",
        ctaText: "Read Routine Guide",
        ctaHref: "/guides/routine",
        imageSrc: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
        imageAlign: "left",
      },
    },
    {
      name: "NewArrivalsSection",
      label: "New Arrivals",
      category: "Commerce",
      contents: {
        title: "New Arrivals",
        subtitle: "Be the first to try our latest organic additions",
        ctaHref: "/products?sort=newest",
      },
    },
  ];

  for (const comp of components) {
    const createdComp = await prisma.builderComponent.create({
      data: {
        name: comp.name,
        label: comp.label,
        category: comp.category,
      },
    });

    for (const [key, value] of Object.entries(comp.contents)) {
      await prisma.builderComponentContent.create({
        data: {
          componentId: createdComp.id,
          key,
          value: JSON.parse(JSON.stringify(value)),
        },
      });
    }
  }
  console.log('✅ Builder components and contents seeded');

  // --- Seed Builder Templates ---
  const defaultHomeDoc = createDefaultHomeDocument();
  await prisma.builderTemplate.upsert({
    where: { key: 'default-home' },
    update: {
      name: 'Default Home Layout',
      scope: 'page',
      pageType: 'home',
      isSystem: true,
      document: JSON.parse(JSON.stringify(defaultHomeDoc)),
    },
    create: {
      key: 'default-home',
      name: 'Default Home Layout',
      scope: 'page',
      pageType: 'home',
      isSystem: true,
      document: JSON.parse(JSON.stringify(defaultHomeDoc)),
    },
  });

  const minimalHomeDoc = createMinimalHomeDocument();
  await prisma.builderTemplate.upsert({
    where: { key: 'minimal-home' },
    update: {
      name: 'Minimal Storefront Layout',
      scope: 'page',
      pageType: 'home',
      isSystem: true,
      document: JSON.parse(JSON.stringify(minimalHomeDoc)),
    },
    create: {
      key: 'minimal-home',
      name: 'Minimal Storefront Layout',
      scope: 'page',
      pageType: 'home',
      isSystem: true,
      document: JSON.parse(JSON.stringify(minimalHomeDoc)),
    },
  });

  const discountHomeDoc = createDiscountHomeDocument();
  await prisma.builderTemplate.upsert({
    where: { key: 'discount-home' },
    update: {
      name: 'Mega Discount Storefront Layout',
      scope: 'page',
      pageType: 'home',
      isSystem: true,
      document: JSON.parse(JSON.stringify(discountHomeDoc)),
    },
    create: {
      key: 'discount-home',
      name: 'Mega Discount Storefront Layout',
      scope: 'page',
      pageType: 'home',
      isSystem: true,
      document: JSON.parse(JSON.stringify(discountHomeDoc)),
    },
  });

  const wellnessHomeDoc = createWellnessHomeDocument();
  await prisma.builderTemplate.upsert({
    where: { key: 'wellness-home' },
    update: {
      name: 'Organic & Wellness Storefront Layout',
      scope: 'page',
      pageType: 'home',
      isSystem: true,
      document: JSON.parse(JSON.stringify(wellnessHomeDoc)),
    },
    create: {
      key: 'wellness-home',
      name: 'Organic & Wellness Storefront Layout',
      scope: 'page',
      pageType: 'home',
      isSystem: true,
      document: JSON.parse(JSON.stringify(wellnessHomeDoc)),
    },
  });

  function createFestivalHomeDocument(festival: string) {
    const nameMap: Record<string, string> = {
      ramadan: "Ramadan Special",
      eid: "Eid Celebration",
      puja: "Durga Puja Festive",
      boishakh: "Pohela Boishakh",
      blackfriday: "Black Friday Mega Deals",
      christmas: "Merry Christmas Holiday",
    };
    const title = nameMap[festival] || festival;

    return {
      schemaVersion: 1,
      page: { key: 'home', slug: '/', title: `Home - ${title}` },
      sections: [
        {
          id: `hero_${festival}`,
          type: 'HeroBanner',
          variant: festival,
          props: {},
        },
        {
          id: `promo_badges_${festival}`,
          type: 'PromoBadgeGrid',
          variant: festival,
          props: {},
        },
        {
          id: `special_offers_${festival}`,
          type: 'SpecialOffersBanner',
          variant: festival,
          props: {},
        },
        {
          id: `product_showcase_${festival}`,
          type: 'ProductShowcase',
          variant: 'default',
          props: {
            title: `${title} Showcase`,
            subtitle: 'Our recommended organic essentials for this festive season',
            showcaseCategoryId: 'all',
            textAlign: 'center',
            cardVariant: 'festive',
          },
          styles: {
            spacingTop: "xl",
            spacingBottom: "lg",
          }
        },
        {
          id: `hot_deals_${festival}`,
          type: 'HotDealsSection',
          variant: 'default',
          props: {
            title: `Festive Hot Deals`,
            subtitle: 'Limited time offers for the celebration',
            cardVariant: 'festive',
            cols: 4,
            layoutType: 'grid',
          },
          styles: {
            spacingTop: "lg",
            spacingBottom: "lg",
            background: "brand",
          }
        },
        {
          id: `new_arrivals_${festival}`,
          type: 'NewArrivalsSection',
          variant: 'default',
          props: {
            title: `New Arrivals`,
            subtitle: `Fresh items for ${title}`,
            cardVariant: 'festive',
            cols: 4,
            layoutType: 'carousel',
          },
          styles: {
            spacingTop: "lg",
            spacingBottom: "lg",
            background: "gray",
          }
        },
        {
          id: `consultation_${festival}`,
          type: 'ConsultationBanner',
          variant: festival,
          props: {},
        },
        {
          id: `routine_${festival}`,
          type: 'RoutineBanner',
          variant: festival,
          props: {},
        },
        {
          id: `testimonials_${festival}`,
          type: 'TestimonialSection',
          variant: festival,
          props: {},
        },
      ],
    };
  }

  const festivals = ['ramadan', 'eid', 'puja', 'boishakh', 'blackfriday', 'christmas'];
  for (const festival of festivals) {
    const festivalDoc = createFestivalHomeDocument(festival);
    await prisma.builderTemplate.upsert({
      where: { key: `${festival}-home` },
      update: {
        name: `${festival.charAt(0).toUpperCase() + festival.slice(1)} Special Home`,
        scope: 'theme',
        pageType: 'home',
        themeKey: festival,
        isSystem: true,
        document: JSON.parse(JSON.stringify(festivalDoc)),
      },
      create: {
        key: `${festival}-home`,
        name: `${festival.charAt(0).toUpperCase() + festival.slice(1)} Special Home`,
        scope: 'theme',
        pageType: 'home',
        themeKey: festival,
        isSystem: true,
        document: JSON.parse(JSON.stringify(festivalDoc)),
      },
    });
  }
  console.log('✅ Builder templates seeded');

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
