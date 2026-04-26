const { db } = require("../config/firebase");
const { generateInvoicePdf } = require("../lib/invoice");

async function indexSellerOrders({ orderId, order, buyerName }) {
  const sellerIds = new Set(order.items.map((i) => i.sellerId).filter(Boolean));
  const batch = db.batch();

  for (const sellerId of sellerIds) {
    const ref = db.collection("sellerOrders").doc(sellerId).collection("orders").doc(orderId);
    batch.set(
      ref,
      {
        orderId,
        buyerId: order.buyerId,
        buyerName,
        status: order.status,
        totals: order.totals,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt || order.createdAt,
      },
      { merge: true },
    );
  }

  await batch.commit();
}

const createCheckoutSession = async (req, res) => {
  try {
    const items = req.body?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items required" });
    }

    const normalized = items
      .map((i) => ({ productId: String(i.productId || ""), qty: Number(i.qty || 0) }))
      .filter((i) => i.productId && Number.isFinite(i.qty) && i.qty > 0)
      .slice(0, 50);

    if (normalized.length === 0) return res.status(400).json({ message: "Invalid cart items" });

    const refs = normalized.map((i) => db.collection("products").doc(i.productId));
    const docs = await db.getAll(...refs);

    const productsById = new Map();
    for (const doc of docs) {
      if (doc.exists) productsById.set(doc.id, doc.data());
    }

    const orderItems = normalized
      .map((i) => {
        const p = productsById.get(i.productId);
        if (!p) return null;
        return {
          productId: i.productId,
          sellerId: p.sellerId || "",
          title: p.name || "Product",
          image: p.image || "",
          price: Number(p.price || 0),
          qty: i.qty,
        };
      })
      .filter(Boolean);

    if (orderItems.length === 0) return res.status(400).json({ message: "No purchasable items" });

    const totals = {
      currency: "inr",
      subtotal: orderItems.reduce((a, b) => a + b.price * b.qty, 0),
    };

    const now = new Date().toISOString();
    const orderData = {
      buyerId: req.auth?.uid || "",
      items: orderItems,
      totals,
      status: "confirmed",
      payment: { provider: "cod", status: "pending_on_delivery" },
      createdAt: now,
      updatedAt: now,
    };

    const orderRef = await db.collection("orders").add(orderData);
    const orderId = orderRef.id;

    const buyerDoc = await db.collection("users").doc(orderData.buyerId).get();
    const buyerName = buyerDoc.exists ? buyerDoc.data().name : "Customer";

    // 1. Index for sellers
    await indexSellerOrders({ orderId, order: orderData, buyerName });

    // 2. Generate Invoice
    const invoiceNumber = `NC-${new Date().getFullYear()}-${orderId.slice(0, 8).toUpperCase()}`;
    const pdf = await generateInvoicePdf({ orderId, order: orderData, buyerName });
    await db.collection("invoices").doc(orderId).set({
      orderId,
      invoiceNumber,
      fileName: pdf.fileName,
      filePath: pdf.filePath,
      createdAt: now,
    });

    // 3. Socket notifications
    const io = req.app?.locals?.io;
    if (io) {
      io.to(`user_${orderData.buyerId}`).emit("order_update", { 
        message: "Order placed successfully! Cash on Delivery confirmed.",
        orderId 
      });
      for (const item of orderItems) {
        if (item.sellerId) {
          io.to(`user_${item.sellerId}`).emit("notification", {
            message: `New COD order received for ${item.title}`,
          });
        }
      }
    }

    return res.status(200).json({ 
      id: orderId, 
      message: "Order placed successfully",
      orderId 
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createCheckoutSession };


