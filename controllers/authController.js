const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Plan, TimeLog } = require('../models');

const BCRYPT_ROUNDS = 12;

function signToken(userId) {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const passwordHash = await bcrypt.hash(String(password), BCRYPT_ROUNDS);

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      passwordHash,
    });

    return res.status(201).json(user.toJSON());
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const user = await User.findOne({
      email: String(email).trim().toLowerCase(),
    }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Hatalı e-posta veya şifre' });
    }

    const match = await bcrypt.compare(String(password), user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Hatalı e-posta veya şifre' });
    }

    const token = signToken(user._id);
    return res.status(200).json({
      token,
      user: user.toJSON(),
    });
  } catch {
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

function logoutUser(_req, res) {
  return res.status(200).json({ message: 'Başarıyla çıkış yapıldı' });
}

async function deleteAccount(req, res) {
  try {
    const { userid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmuyor' });
    }

    if (req.user.id !== userid) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmuyor' });
    }

    await Promise.all([
      Plan.deleteMany({ userId: userid }),
      TimeLog.deleteMany({ userId: userid }),
    ]);

    const deleted = await User.findByIdAndDelete(userid);
    if (!deleted) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz bulunmuyor' });
    }

    return res.sendStatus(204);
  } catch {
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  deleteAccount,
};
