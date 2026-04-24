const { db } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function normalizeRole(role) {
  // Back-compat: previous UI used "admin" for sellers.
  if (role === 'admin') return 'seller';
  return role;
}

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function setAuthCookie(res, token) {
  res.cookie('nex_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie('nex_token', { path: '/' });
}

const signup = async (req, res) => {
  try {
    const { username, password, name, role } = req.body;

    if (!username || !password || !name || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    }

    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();

    if (doc.exists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const normalizedRole = normalizeRole(role);
    if (!['customer', 'seller'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await userRef.set({
      username,
      passwordHash,
      name,
      role: normalizedRole,
      phone: "",
      address: "",
      createdAt: new Date().toISOString()
    });

    const safeUser = {
      uid: username,
      username,
      name,
      role: normalizedRole,
    };

    const token = signToken(safeUser);
    setAuthCookie(res, token);

    res.status(201).json({
      message: 'User created successfully',
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    }

    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = doc.data();

    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const safeUser = {
      uid: username,
      username: user.username,
      name: user.name,
      role: normalizeRole(user.role),
    };

    const token = signToken(safeUser);
    setAuthCookie(res, token);

    res.status(200).json({ 
      message: 'Login successful', 
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const me = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    }

    const token = req.cookies?.nex_token;
    if (!token) return res.status(200).json({ user: null });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ user: payload });
  } catch {
    return res.status(200).json({ user: null });
  }
};

const logout = async (_req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: 'Logged out' });
};

module.exports = { signup, login, me, logout };
