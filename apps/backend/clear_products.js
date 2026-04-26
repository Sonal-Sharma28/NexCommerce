const { db } = require('./config/firebase');

/**
 * Clear script: Delete all products from database
 */

async function clearProducts() {
  try {
    console.log('🗑️  Clearing all products...');
    
    const snapshot = await db.collection('products').get();
    
    if (snapshot.empty) {
      console.log('Database is already empty!');
      return;
    }

    console.log(`Found ${snapshot.size} products. Deleting...`);
    
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
      console.log(`✓ Deleted: ${doc.data().name}`);
    }

    console.log('');
    console.log('═'.repeat(50));
    console.log('✓ All products deleted!');
    console.log('═'.repeat(50));
  } catch (error) {
    console.error('❌ Error clearing products:', error);
    process.exit(1);
  }
}

// Run clearing
clearProducts().then(() => {
  console.log('\n✓ Done. Now run: node seed_products.js');
  process.exit(0);
});
