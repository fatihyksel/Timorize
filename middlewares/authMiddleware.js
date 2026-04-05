const jwt = require('jsonwebtoken');

/**
 * Authorization: Bearer <JWT> başlığını doğrular; payload'ı req.user'a yazar.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Kimlik doğrulama başarısız' });
  }

  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ message: 'Kimlik doğrulama başarısız' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Sunucu yapılandırması eksik.' });
  }

  try {
    const payload = jwt.verify(token, secret);
    const userId = payload.userId ?? payload.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Kimlik doğrulama başarısız' });
    }
    req.user = { id: String(userId) };
    next();
  } catch {
    return res.status(401).json({ message: 'Kimlik doğrulama başarısız' });
  }
}

module.exports = { authMiddleware };
