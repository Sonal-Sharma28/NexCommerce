const express = require("express");
const router = express.Router();

const { requireAuth, requireRole } = require("../middleware/auth");
const { getMyOrders, getSellerOrders, updateSellerOrderStatus } = require("../controllers/orderController");
const { downloadInvoice } = require("../controllers/invoiceController");

router.get("/me", requireAuth, getMyOrders);
router.get("/seller", requireAuth, requireRole("seller"), getSellerOrders);
router.patch("/seller/:id", requireAuth, requireRole("seller"), updateSellerOrderStatus);
router.get("/:id/invoice", requireAuth, downloadInvoice);

module.exports = router;

