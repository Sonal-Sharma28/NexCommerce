const { db } = require('./config/firebase');

/**
 * Seed script: Add sample electronics products to Firebase
 * Products are in Indian Rupees (₹)
 */

const sampleProducts = [
  {
    name: "Premium Wireless Bluetooth Headphones",
    price: 3499,
    description: "Active noise cancellation, 40-hour battery, premium sound quality with deep bass",
    category: "Electronics",
    stock: 15,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
  },
  {
    name: "Bluetooth Over-Ear Headphones",
    price: 2299,
    description: "Comfortable cushioned ear cups, 30-hour battery, wireless connectivity up to 10m",
    category: "Electronics",
    stock: 20,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop"
  },
  {
    name: "Wireless Earbuds with Charging Case",
    price: 1899,
    description: "True wireless earbuds with active noise cancellation and 24-hour battery life",
    category: "Electronics",
    stock: 25,
    image: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop"
  },
  {
    name: "Portable Bluetooth Speaker",
    price: 2199,
    description: "360-degree sound, waterproof, 12-hour battery, perfect for outdoor adventures",
    category: "Electronics",
    stock: 18,
    image: "https://images.unsplash.com/photo-1589003077984-894e133814c9?w=400&h=400&fit=crop"
  },
  {
    name: "Home Bluetooth Speaker System",
    price: 5499,
    description: "Premium sound system with deep bass, WiFi + Bluetooth connectivity, smart controls",
    category: "Electronics",
    stock: 10,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
  },
  {
    name: "Gaming Bluetooth Headset",
    price: 4299,
    description: "7.1 surround sound, noise-cancelling mic, 20-hour battery, RGB lighting",
    category: "Electronics",
    stock: 12,
    image: "https://images.unsplash.com/photo-1599669157840-a841a2b3b7ce?w=400&h=400&fit=crop"
  },
  {
    name: "Sports Wireless Earbuds",
    price: 1599,
    description: "IPX7 waterproof, secure fit design, 6-hour battery, touch controls",
    category: "Electronics",
    stock: 22,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop"
  },
  {
    name: "Bluetooth Speaker Stand with Microphone",
    price: 2899,
    description: "Universal speaker stand with built-in Bluetooth mic, adjustable height",
    category: "Electronics",
    stock: 14,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop"
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Starting to seed electronics products...');
    console.log('');

    let added = 0;

    for (const product of sampleProducts) {
      const docRef = await db.collection('products').add({
        ...product,
        sellerId: "admin",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(`✓ Added: "${product.name}"`);
      console.log(`  Price: ₹${product.price.toFixed(2)} | Stock: ${product.stock}`);
      console.log('');
      added++;
    }

    console.log('═'.repeat(50));
    console.log('✓ Successfully added ' + added + ' products!');
    console.log('═'.repeat(50));
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Run seeding
seedProducts().then(() => {
  console.log('\n✓ Database seeding complete. Exiting...');
  process.exit(0);
});
