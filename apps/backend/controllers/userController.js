const { db } = require("../config/firebase");

const getMe = async (req, res) => {
  try {
    const uid = req.auth?.uid;
    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) return res.status(404).json({ message: "User not found" });

    const u = doc.data();
    return res.status(200).json({
      uid,
      username: u.username,
      name: u.name,
      role: u.role,
      phone: u.phone || "",
      address: u.address || "",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const uid = req.auth?.uid;
    const { name, phone, address } = req.body || {};

    const patch = {
      ...(name !== undefined ? { name: String(name) } : {}),
      ...(phone !== undefined ? { phone: String(phone) } : {}),
      ...(address !== undefined ? { address: String(address) } : {}),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("users").doc(uid).set(patch, { merge: true });
    return res.status(200).json({ message: "Updated", ...patch });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getMe, updateMe };

