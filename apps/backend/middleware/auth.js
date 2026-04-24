const jwt = require("jsonwebtoken");

function getToken(req) {
  return req.cookies?.nex_token || null;
}

function requireAuth(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ message: "Unauthorized" });
    if (req.auth.role !== role) return res.status(403).json({ message: "Forbidden" });
    return next();
  };
}

module.exports = { requireAuth, requireRole };

