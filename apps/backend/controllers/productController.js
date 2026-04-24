const { db } = require('../config/firebase');

const getAllProducts = async (req, res) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Array safety: Always guard arrays to prevent crashes
    res.status(200).json(products || []); 
  } catch (error) {
    console.error('CRITICAL: Error fetching products:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.auth?.uid;
    const snapshot = await db.collection('products').where('sellerId', '==', sellerId).get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(products || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('products').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;
    const sellerId = req.auth?.uid;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newProduct = {
      sellerId,
      name,
      price: Number(price),
      description: description || '',
      image: image || '',
      category: category || 'General',
      stock: Number(stock) || 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('products').add(newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.auth?.uid;

    const ref = db.collection('products').doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });

    const current = doc.data();
    if (current.sellerId !== sellerId) return res.status(403).json({ message: 'Forbidden' });

    const { name, price, description, image, category, stock, status } = req.body;
    const patch = {
      ...(name !== undefined ? { name } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(image !== undefined ? { image } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(stock !== undefined ? { stock: Number(stock) } : {}),
      ...(status !== undefined ? { status } : {}),
      updatedAt: new Date().toISOString(),
    };

    await ref.update(patch);
    return res.status(200).json({ id, ...current, ...patch });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.auth?.uid;

    const ref = db.collection('products').doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });
    const current = doc.data();
    if (current.sellerId !== sellerId) return res.status(403).json({ message: 'Forbidden' });

    await ref.delete();
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
