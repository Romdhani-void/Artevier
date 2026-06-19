require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan_sink_studio';

const sampleProducts = [
  {
    name: 'Artisan Copper Farmhouse Sink',
    slug: 'artisan-copper-farmhouse-sink',
    description: 'Hand-hammered copper farmhouse sink with a living finish that develops a unique patina over time. Deep basin perfect for large pots and pans.',
    price: 1299.99,
    material: 'Copper',
    color: 'Copper',
    shape: 'Farmhouse',
    stock: 15,
    dimensions: '33" L x 22" W x 10" D',
    weight: '28 lbs',
    featured: true,
    images: ['/uploads/sample-copper-farmhouse.jpg'],
    salesCount: 42,
  },
  {
    name: 'Elegance Fireclay Vessel Sink',
    slug: 'elegance-fireclay-vessel-sink',
    description: 'Premium fireclay vessel sink with a smooth glazed finish. Resistant to scratches, stains, and thermal shock.',
    price: 449.99,
    material: 'Fireclay',
    color: 'White',
    shape: 'Vessel',
    stock: 30,
    dimensions: '16" Diameter x 6" H',
    weight: '18 lbs',
    featured: true,
    images: ['/uploads/sample-fireclay-vessel.jpg'],
    salesCount: 38,
  },
  {
    name: 'Granite Composite Double Bowl',
    slug: 'granite-composite-double-bowl',
    description: 'Modern granite composite double bowl sink with sound-dampening technology. Heat resistant up to 536°F.',
    price: 599.99,
    material: 'Granite Composite',
    color: 'Matte Black',
    shape: 'Rectangular',
    stock: 22,
    dimensions: '33" L x 22" W x 9.5" D',
    weight: '32 lbs',
    featured: true,
    images: ['/uploads/sample-granite-double.jpg'],
    salesCount: 55,
  },
  {
    name: 'Natural Stone Vessel Basin',
    slug: 'natural-stone-vessel-basin',
    description: 'Carved from a single block of natural stone. Each piece is unique with natural veining and color variations.',
    price: 899.99,
    material: 'Stone',
    color: 'Beige',
    shape: 'Vessel',
    stock: 8,
    dimensions: '17" Diameter x 5.5" H',
    weight: '35 lbs',
    featured: false,
    images: ['/uploads/sample-stone-vessel.jpg'],
    salesCount: 21,
  },
  {
    name: 'Classic Ceramic Undermount',
    slug: 'classic-ceramic-undermount',
    description: 'Timeless ceramic undermount sink with a glossy white finish. Easy to clean and maintain.',
    price: 279.99,
    material: 'Ceramic',
    color: 'White',
    shape: 'Rectangular',
    stock: 45,
    dimensions: '30" L x 18" W x 9" D',
    weight: '22 lbs',
    featured: false,
    images: ['/uploads/sample-ceramic-undermount.jpg'],
    salesCount: 67,
  },
  {
    name: 'Stainless Steel Workstation',
    slug: 'stainless-steel-workstation',
    description: 'Professional-grade stainless steel workstation sink with built-in cutting board and colander accessories.',
    price: 749.99,
    material: 'Stainless Steel',
    color: 'Gray',
    shape: 'Rectangular',
    stock: 18,
    dimensions: '32" L x 19" W x 10" D',
    weight: '25 lbs',
    featured: true,
    images: ['/uploads/sample-steel-workstation.jpg'],
    salesCount: 33,
  },
  {
    name: 'Round Copper Bar Sink',
    slug: 'round-copper-bar-sink',
    description: 'Compact round copper bar sink ideal for wet bars and prep areas. Hand-hammered texture adds artisan charm.',
    price: 349.99,
    material: 'Copper',
    color: 'Copper',
    shape: 'Round',
    stock: 25,
    dimensions: '15" Diameter x 6" D',
    weight: '8 lbs',
    featured: false,
    images: ['/uploads/sample-copper-bar.jpg'],
    salesCount: 19,
  },
  {
    name: 'Oval Fireclay Apron Front',
    slug: 'oval-fireclay-apron-front',
    description: 'Elegant oval fireclay apron front sink with a smooth curved interior. Perfect for traditional kitchen designs.',
    price: 799.99,
    material: 'Fireclay',
    color: 'White',
    shape: 'Oval',
    stock: 12,
    dimensions: '30" L x 20" W x 10" D',
    weight: '30 lbs',
    featured: true,
    images: ['/uploads/sample-fireclay-apron.jpg'],
    salesCount: 28,
  },
  {
    name: 'Square Granite Composite',
    slug: 'square-granite-composite',
    description: 'Contemporary square granite composite sink with a sleek minimalist design. Non-porous and hygienic surface.',
    price: 529.99,
    material: 'Granite Composite',
    color: 'Gray',
    shape: 'Square',
    stock: 20,
    dimensions: '20" L x 20" W x 9" D',
    weight: '24 lbs',
    featured: false,
    images: ['/uploads/sample-granite-square.jpg'],
    salesCount: 15,
  },
  {
    name: 'Navy Ceramic Vessel Sink',
    slug: 'navy-ceramic-vessel-sink',
    description: 'Bold navy blue ceramic vessel sink that makes a statement. High-gloss finish resists fading and chipping.',
    price: 329.99,
    material: 'Ceramic',
    color: 'Navy',
    shape: 'Vessel',
    stock: 35,
    dimensions: '16" Diameter x 5" H',
    weight: '12 lbs',
    featured: false,
    images: ['/uploads/sample-navy-vessel.jpg'],
    salesCount: 24,
  },
  {
    name: 'Black Stone Farmhouse',
    slug: 'black-stone-farmhouse',
    description: 'Dramatic black stone farmhouse sink with a matte finish. Heat and scratch resistant for daily use.',
    price: 1499.99,
    material: 'Stone',
    color: 'Black',
    shape: 'Farmhouse',
    stock: 5,
    dimensions: '36" L x 20" W x 10" D',
    weight: '45 lbs',
    featured: true,
    images: ['/uploads/sample-black-stone.jpg'],
    salesCount: 12,
  },
  {
    name: 'Compact Stainless Round',
    slug: 'compact-stainless-round',
    description: 'Space-saving round stainless steel sink perfect for small kitchens and laundry rooms.',
    price: 189.99,
    material: 'Stainless Steel',
    color: 'Gray',
    shape: 'Round',
    stock: 50,
    dimensions: '14" Diameter x 7" D',
    weight: '6 lbs',
    featured: false,
    images: ['/uploads/sample-stainless-round.jpg'],
    salesCount: 41,
  },
];

async function seedUsers() {
  const User = mongoose.connection.collection('users');
  const existingAdmin = await User.findOne({ email: 'admin@artisansinkstudio.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    await User.insertOne({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@artisansinkstudio.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+1-555-0100',
      address: '123 Studio Lane, Portland, OR 97201',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Admin user created: admin@artisansinkstudio.com / Admin123!');
  }

  const existingCustomer = await User.findOne({ email: 'customer@example.com' });
  if (!existingCustomer) {
    const hashedPassword = await bcrypt.hash('Customer123!', 12);
    await User.insertOne({
      firstName: 'Jane',
      lastName: 'Customer',
      email: 'customer@example.com',
      password: hashedPassword,
      role: 'customer',
      phone: '+1-555-0200',
      address: '456 Oak Street, Seattle, WA 98101',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Customer user created: customer@example.com / Customer123!');
  }
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await seedUsers();

    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log(`Seeded ${sampleProducts.length} products`);
    } else {
      console.log(`Products already exist (${count}), skipping product seed`);
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
