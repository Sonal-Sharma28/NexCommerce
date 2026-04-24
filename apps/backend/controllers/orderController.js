const { db } = require("../config/firebase");

const getMyOrders = async (req, res) => {
  try {
    const buyerId = req.auth?.uid;
    const snap = await db
      .collection("orders")
      .where("buyerId", "==", buyerId)
      .get();

    const orders = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return res.status(200).json(orders || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.auth?.uid;
    const snap = await db
      .collection("sellerOrders")
      .doc(sellerId)
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json(orders || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSellerOrderStatus = async (req, res) => {
  try {
    const sellerId = req.auth?.uid;
    const { id } = req.params;
    const { status } = req.body || {};

    const allowed = ["processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const sellerRef = db.collection("sellerOrders").doc(sellerId).collection("orders").doc(id);
    const sellerDoc = await sellerRef.get();
    if (!sellerDoc.exists) return res.status(404).json({ message: "Order not found" });

    const orderId = sellerDoc.data().orderId || id;

    await sellerRef.update({ status, updatedAt: new Date().toISOString() });
    await db.collection("orders").doc(orderId).update({ status, updatedAt: new Date().toISOString() });

    const io = req.app?.locals?.io;
    if (io) {
      const buyerId = sellerDoc.data().buyerId;
      if (buyerId) {
        io.to(`user_${buyerId}`).emit("order_update", { message: `Your order is now ${status}` });
      }
    }

    return res.status(200).json({ message: "Updated", status });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyOrders, getSellerOrders, updateSellerOrderStatus };

