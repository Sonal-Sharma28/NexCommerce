const { db } = require('./config/firebase');

/**
 * Check script: Display all data in database
 */

async function checkDatabase() {
  try {
    console.log('📊 Checking database contents...\n');

    // Check Products
    const productsSnapshot = await db.collection('products').get();
    console.log('═'.repeat(60));
    console.log('PRODUCTS');
    console.log('═'.repeat(60));
    
    if (productsSnapshot.empty) {
      console.log('❌ No products found');
    } else {
      console.log(`✓ Found ${productsSnapshot.size} products:\n`);
      productsSnapshot.docs.forEach((doc, index) => {
        const product = doc.data();
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: ₹${product.price}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   Stock: ${product.stock}`);
        console.log(`   Status: ${product.status}`);
        console.log(`   Image: ${product.image.substring(0, 50)}...`);
        console.log('');
      });
    }

    // Check Users
    const usersSnapshot = await db.collection('users').get();
    console.log('═'.repeat(60));
    console.log('USERS');
    console.log('═'.repeat(60));
    
    if (usersSnapshot.empty) {
      console.log('❌ No users found');
    } else {
      console.log(`✓ Found ${usersSnapshot.size} users:\n`);
      usersSnapshot.docs.forEach((doc, index) => {
        const user = doc.data();
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log('');
      });
    }

    // Check Orders
    const ordersSnapshot = await db.collection('orders').get();
    console.log('═'.repeat(60));
    console.log('ORDERS');
    console.log('═'.repeat(60));
    
    if (ordersSnapshot.empty) {
      console.log('❌ No orders found');
    } else {
      console.log(`✓ Found ${ordersSnapshot.size} orders:\n`);
      ordersSnapshot.docs.forEach((doc, index) => {
        const order = doc.data();
        console.log(`${index + 1}. Order ID: ${doc.id}`);
        console.log(`   Buyer: ${order.buyerId}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Items: ${order.items.length}`);
        console.log(`   Total: ₹${order.totals.subtotal}`);
        console.log('');
      });
    }

    // Check Invoices
    const invoicesSnapshot = await db.collection('invoices').get();
    console.log('═'.repeat(60));
    console.log('INVOICES');
    console.log('═'.repeat(60));
    
    if (invoicesSnapshot.empty) {
      console.log('❌ No invoices found');
    } else {
      console.log(`✓ Found ${invoicesSnapshot.size} invoices:\n`);
      invoicesSnapshot.docs.forEach((doc, index) => {
        const invoice = doc.data();
        console.log(`${index + 1}. Invoice ID: ${doc.id}`);
        console.log(`   File: ${invoice.fileName}`);
        console.log(`   Path: ${invoice.filePath}`);
        console.log('');
      });
    }

    // Check Seller Orders
    const sellersSnapshot = await db.collection('sellerOrders').get();
    console.log('═'.repeat(60));
    console.log('SELLER ORDERS');
    console.log('═'.repeat(60));
    
    if (sellersSnapshot.empty) {
      console.log('❌ No seller orders found');
    } else {
      console.log(`✓ Found ${sellersSnapshot.size} sellers:\n`);
      for (const sellerDoc of sellersSnapshot.docs) {
        console.log(`Seller ID: ${sellerDoc.id}`);
        const ordersSubCollection = await sellerDoc.ref.collection('orders').get();
        console.log(`  Orders: ${ordersSubCollection.size}`);
        console.log('');
      }
    }

    console.log('═'.repeat(60));
    console.log('✓ Database check complete!');
    console.log('═'.repeat(60));
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

// Run check
checkDatabase().then(() => {
  process.exit(0);
});
