const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth");
const { createCheckoutSession } = require("../controllers/checkoutController");

router.post("/session", requireAuth, createCheckoutSession);

module.exports = router;

