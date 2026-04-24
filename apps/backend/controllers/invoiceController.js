const fs = require("node:fs");
const path = require("node:path");
const { db } = require("../config/firebase");

const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDoc = await db.collection("orders").doc(id).get();
    if (!orderDoc.exists) return res.status(404).json({ message: "Order not found" });

    const order = orderDoc.data();
    const uid = req.auth?.uid;

    const isBuyer = order.buyerId === uid;
    const isSeller = Array.isArray(order.items) && order.items.some((it) => it.sellerId === uid);
    if (!isBuyer && !isSeller) return res.status(403).json({ message: "Forbidden" });

    const invDoc = await db.collection("invoices").doc(id).get();
    if (!invDoc.exists) return res.status(404).json({ message: "Invoice not ready yet" });

    const inv = invDoc.data();
    const filePath = inv.filePath;
    if (!filePath || !fs.existsSync(filePath)) return res.status(404).json({ message: "Invoice file missing" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${inv.fileName || `invoice-${id}.pdf`}"`,
    );

    return fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { downloadInvoice };

