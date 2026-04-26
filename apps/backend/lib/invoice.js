const fs = require("node:fs");
const path = require("node:path");
const PDFDocument = require("pdfkit");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function formatMoney(amount, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);
  } catch {
    return `₹${Number(amount).toFixed(2)}`;
  }
}

async function generateInvoicePdf({ orderId, order, buyerName }) {
  const outDir = path.join(process.cwd(), "invoices");
  ensureDir(outDir);

  const fileName = `invoice-${orderId}.pdf`;
  const filePath = path.join(outDir, fileName);

  const doc = new PDFDocument({ size: "A4", margin: 48 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(22).font("Helvetica-Bold").text("NexCommerce Invoice", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(10).font("Helvetica").fillColor("#555").text(`Invoice for Order: ${orderId}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);
  doc.moveDown(1);

  doc.fillColor("#000");
  doc.fontSize(12).font("Helvetica-Bold").text("Bill to");
  doc.fontSize(11).font("Helvetica").text(buyerName || "Customer");
  doc.moveDown(1);

  doc.fontSize(12).font("Helvetica-Bold").text("Items");
  doc.moveDown(0.5);

  const items = Array.isArray(order.items) ? order.items : [];
  for (const it of items) {
    const title = it.title || it.name || "Item";
    const qty = Number(it.qty || 0);
    const price = Number(it.price || 0);
    const lineTotal = qty * price;

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(title, { continued: false });
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#555")
      .text(`Qty: ${qty}  •  Unit: ${formatMoney(price)}  •  Total: ${formatMoney(lineTotal)}`);
    doc.fillColor("#000").moveDown(0.6);
  }

  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(12).text("Totals");
  doc.font("Helvetica").fontSize(11);
  const subtotal = Number(order.totals?.subtotal || 0);
  doc.text(`Total Amount: ${formatMoney(subtotal)}`);
  doc.moveDown(1);

  doc.font("Helvetica-Bold").text("Thank you for your purchase.");
  doc.end();

  await new Promise((resolve, reject) => {
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return { filePath, fileName };
}

module.exports = { generateInvoicePdf };

