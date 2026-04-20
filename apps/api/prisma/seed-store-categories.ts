import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const categories = [
  {
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    iconEmoji: '🥦',
    sortOrder: 1,
    children: [
      { name: 'Fresh Fruits', slug: 'fresh-fruits', iconEmoji: '🍎', sortOrder: 1 },
      { name: 'Fresh Vegetables', slug: 'fresh-vegetables', iconEmoji: '🥕', sortOrder: 2 },
      { name: 'Herbs & Seasonings', slug: 'herbs-seasonings', iconEmoji: '🌿', sortOrder: 3 },
      { name: 'Exotic Fruits & Veggies', slug: 'exotic-fruits-veggies', iconEmoji: '🥝', sortOrder: 4 },
    ],
  },
  {
    name: 'Dairy, Bread & Eggs',
    slug: 'dairy-bread-eggs',
    iconEmoji: '🥛',
    sortOrder: 2,
    children: [
      { name: 'Milk', slug: 'milk', iconEmoji: '🥛', sortOrder: 1 },
      { name: 'Curd & Yoghurt', slug: 'curd-yoghurt', iconEmoji: '🫙', sortOrder: 2 },
      { name: 'Cheese', slug: 'cheese', iconEmoji: '🧀', sortOrder: 3 },
      { name: 'Butter & Ghee', slug: 'butter-ghee', iconEmoji: '🧈', sortOrder: 4 },
      { name: 'Eggs', slug: 'eggs', iconEmoji: '🥚', sortOrder: 5 },
      { name: 'Bread & Bakery', slug: 'bread-bakery', iconEmoji: '🍞', sortOrder: 6 },
      { name: 'Paneer & Tofu', slug: 'paneer-tofu', iconEmoji: '🟨', sortOrder: 7 },
    ],
  },
  {
    name: 'Atta, Rice & Dal',
    slug: 'atta-rice-dal',
    iconEmoji: '🌾',
    sortOrder: 3,
    children: [
      { name: 'Flour & Atta', slug: 'flour-atta', iconEmoji: '🌾', sortOrder: 1 },
      { name: 'Rice', slug: 'rice', iconEmoji: '🍚', sortOrder: 2 },
      { name: 'Dals & Pulses', slug: 'dals-pulses', iconEmoji: '🫘', sortOrder: 3 },
      { name: 'Poha & Suji', slug: 'poha-suji', iconEmoji: '🥣', sortOrder: 4 },
    ],
  },
  {
    name: 'Snacks & Branded Food',
    slug: 'snacks-branded-food',
    iconEmoji: '🍟',
    sortOrder: 4,
    children: [
      { name: 'Chips & Crisps', slug: 'chips-crisps', iconEmoji: '🥔', sortOrder: 1 },
      { name: 'Biscuits & Cookies', slug: 'biscuits-cookies', iconEmoji: '🍪', sortOrder: 2 },
      { name: 'Namkeen', slug: 'namkeen', iconEmoji: '🥜', sortOrder: 3 },
      { name: 'Ready to Eat', slug: 'ready-to-eat', iconEmoji: '🍱', sortOrder: 4 },
      { name: 'Noodles & Pasta', slug: 'noodles-pasta', iconEmoji: '🍜', sortOrder: 5 },
      { name: 'Chocolates & Candy', slug: 'chocolates-candy', iconEmoji: '🍫', sortOrder: 6 },
    ],
  },
  {
    name: 'Cold Drinks & Juices',
    slug: 'cold-drinks-juices',
    iconEmoji: '🥤',
    sortOrder: 5,
    children: [
      { name: 'Soft Drinks', slug: 'soft-drinks', iconEmoji: '🥤', sortOrder: 1 },
      { name: 'Juices & Drinks', slug: 'juices-drinks', iconEmoji: '🧃', sortOrder: 2 },
      { name: 'Energy Drinks', slug: 'energy-drinks', iconEmoji: '⚡', sortOrder: 3 },
      { name: 'Water & Soda', slug: 'water-soda', iconEmoji: '💧', sortOrder: 4 },
    ],
  },
  {
    name: 'Tea, Coffee & Health',
    slug: 'tea-coffee-health',
    iconEmoji: '☕',
    sortOrder: 6,
    children: [
      { name: 'Tea', slug: 'tea', iconEmoji: '🍵', sortOrder: 1 },
      { name: 'Coffee', slug: 'coffee', iconEmoji: '☕', sortOrder: 2 },
      { name: 'Health Drinks', slug: 'health-drinks', iconEmoji: '💪', sortOrder: 3 },
      { name: 'Green Tea & Herbal', slug: 'green-tea-herbal', iconEmoji: '🌱', sortOrder: 4 },
    ],
  },
  {
    name: 'Breakfast & Cereals',
    slug: 'breakfast-cereals',
    iconEmoji: '🥣',
    sortOrder: 7,
    children: [
      { name: 'Cereals', slug: 'cereals', iconEmoji: '🥣', sortOrder: 1 },
      { name: 'Oats', slug: 'oats', iconEmoji: '🌾', sortOrder: 2 },
      { name: 'Cornflakes & Muesli', slug: 'cornflakes-muesli', iconEmoji: '🌽', sortOrder: 3 },
    ],
  },
  {
    name: 'Masala, Oil & More',
    slug: 'masala-oil-more',
    iconEmoji: '🫙',
    sortOrder: 8,
    children: [
      { name: 'Cooking Oil', slug: 'cooking-oil', iconEmoji: '🛢️', sortOrder: 1 },
      { name: 'Spices & Masala', slug: 'spices-masala', iconEmoji: '🌶️', sortOrder: 2 },
      { name: 'Salt & Sugar', slug: 'salt-sugar', iconEmoji: '🧂', sortOrder: 3 },
      { name: 'Sauces & Condiments', slug: 'sauces-condiments', iconEmoji: '🫙', sortOrder: 4 },
      { name: 'Vinegar & Dressings', slug: 'vinegar-dressings', iconEmoji: '🍶', sortOrder: 5 },
    ],
  },
  {
    name: 'Cleaning Essentials',
    slug: 'cleaning-essentials',
    iconEmoji: '🧹',
    sortOrder: 9,
    children: [
      { name: 'Dishwash', slug: 'dishwash', iconEmoji: '🫧', sortOrder: 1 },
      { name: 'Floor Cleaner', slug: 'floor-cleaner', iconEmoji: '🧹', sortOrder: 2 },
      { name: 'Fresheners & Repellents', slug: 'fresheners-repellents', iconEmoji: '💨', sortOrder: 3 },
      { name: 'Laundry', slug: 'laundry', iconEmoji: '🧺', sortOrder: 4 },
      { name: 'Bathroom Cleaners', slug: 'bathroom-cleaners', iconEmoji: '🚿', sortOrder: 5 },
    ],
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    iconEmoji: '🧴',
    sortOrder: 10,
    children: [
      { name: 'Skincare', slug: 'skincare', iconEmoji: '✨', sortOrder: 1 },
      { name: 'Haircare', slug: 'haircare', iconEmoji: '💆', sortOrder: 2 },
      { name: 'Oral Care', slug: 'oral-care', iconEmoji: '🦷', sortOrder: 3 },
      { name: 'Feminine Care', slug: 'feminine-care', iconEmoji: '🌸', sortOrder: 4 },
      { name: 'Deodorants', slug: 'deodorants', iconEmoji: '🌬️', sortOrder: 5 },
    ],
  },
  {
    name: 'Baby Care',
    slug: 'baby-care',
    iconEmoji: '👶',
    sortOrder: 11,
    children: [
      { name: 'Diapers & Wipes', slug: 'diapers-wipes', iconEmoji: '🍼', sortOrder: 1 },
      { name: 'Baby Food', slug: 'baby-food', iconEmoji: '🥣', sortOrder: 2 },
      { name: 'Baby Skincare', slug: 'baby-skincare', iconEmoji: '🧴', sortOrder: 3 },
    ],
  },
  {
    name: 'Pet Care',
    slug: 'pet-care',
    iconEmoji: '🐾',
    sortOrder: 12,
    children: [
      { name: 'Dog Food', slug: 'dog-food', iconEmoji: '🐕', sortOrder: 1 },
      { name: 'Cat Food', slug: 'cat-food', iconEmoji: '🐈', sortOrder: 2 },
      { name: 'Pet Accessories', slug: 'pet-accessories', iconEmoji: '🦮', sortOrder: 3 },
    ],
  },
  {
    name: 'Frozen Foods',
    slug: 'frozen-foods',
    iconEmoji: '🧊',
    sortOrder: 13,
    children: [
      { name: 'Frozen Vegetables', slug: 'frozen-vegetables', iconEmoji: '🥦', sortOrder: 1 },
      { name: 'Frozen Snacks', slug: 'frozen-snacks', iconEmoji: '🍟', sortOrder: 2 },
      { name: 'Frozen Meat & Seafood', slug: 'frozen-meat-seafood', iconEmoji: '🐟', sortOrder: 3 },
    ],
  },
  {
    name: 'Ice Creams & Desserts',
    slug: 'ice-creams-desserts',
    iconEmoji: '🍦',
    sortOrder: 14,
    children: [
      { name: 'Ice Creams', slug: 'ice-creams', iconEmoji: '🍦', sortOrder: 1 },
      { name: 'Kulfi & Frozen Desserts', slug: 'kulfi-frozen-desserts', iconEmoji: '🍧', sortOrder: 2 },
    ],
  },
  {
    name: 'Medicines & Health',
    slug: 'medicines-health',
    iconEmoji: '💊',
    sortOrder: 15,
    children: [
      { name: 'OTC Medicines', slug: 'otc-medicines', iconEmoji: '💊', sortOrder: 1 },
      { name: 'Vitamins & Supplements', slug: 'vitamins-supplements', iconEmoji: '🧬', sortOrder: 2 },
    ],
  },
];

async function seedStoreCategories() {
  console.log('🌱 Seeding HZLR.store product categories...');

  let parentCount = 0;
  let childCount = 0;

  for (const parent of categories) {
    const { children, ...parentData } = parent;

    const parentRecord = await prisma.productCategory.upsert({
      where: { slug: parentData.slug },
      update: { name: parentData.name, iconEmoji: parentData.iconEmoji, sortOrder: parentData.sortOrder },
      create: { name: parentData.name, slug: parentData.slug, iconEmoji: parentData.iconEmoji, sortOrder: parentData.sortOrder },
    });
    parentCount++;

    for (const child of children) {
      await prisma.productCategory.upsert({
        where: { slug: child.slug },
        update: { name: child.name, iconEmoji: child.iconEmoji, sortOrder: child.sortOrder, parentId: parentRecord.id },
        create: {
          name: child.name,
          slug: child.slug,
          iconEmoji: child.iconEmoji,
          sortOrder: child.sortOrder,
          parentId: parentRecord.id,
        },
      });
      childCount++;
    }
  }

  console.log(`✅ Seeded ${parentCount} parent categories, ${childCount} subcategories.`);

  // Seed default DeliveryFeeConfig
  const existingConfig = await prisma.deliveryFeeConfig.findFirst({ where: { isActive: true } });
  if (!existingConfig) {
    await prisma.deliveryFeeConfig.create({
      data: {
        baseFee: 20,
        ratePerKm: 6,
        sizeBrackets: [
          { min_order: 0,   max_order: 300,  bonus: 0  },
          { min_order: 300, max_order: 600,  bonus: 10 },
          { min_order: 600, max_order: 9999, bonus: 20 },
        ],
        isActive: true,
      },
    });
    console.log('✅ Seeded default DeliveryFeeConfig (base ₹20 + ₹6/km + size bonus).');
  } else {
    console.log('ℹ️  DeliveryFeeConfig already exists, skipping.');
  }
}

seedStoreCategories()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
