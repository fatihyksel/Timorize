const { User, TECHNIQUE_NAMES } = require('../models');

function isValidTechniqueName(name) {
  return typeof name === 'string' && TECHNIQUE_NAMES.includes(name);
}

async function selectTechnique(req, res) {
  try {
    const { techniqueName } = req.body ?? {};
    if (!isValidTechniqueName(techniqueName)) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { activeTechniqueName: techniqueName },
      { new: true }
    );

    if (!user) {
      return res.status(401).json({ message: 'Kimlik doğrulama başarısız' });
    }

    return res.status(200).json({
      message: 'Teknik başarıyla seçildi ve aktif edildi',
      activeTechniqueName: user.activeTechniqueName,
    });
  } catch {
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

async function addFavoriteTechnique(req, res) {
  try {
    const { techniqueName } = req.body ?? {};
    if (!isValidTechniqueName(techniqueName)) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'Kimlik doğrulama başarısız' });
    }

    if (!user.favoriteTechniqueNames.includes(techniqueName)) {
      user.favoriteTechniqueNames.push(techniqueName);
      await user.save();
    }

    return res.status(201).json({
      message: 'Teknik başarıyla favorilere eklendi',
      favoriteTechniqueNames: user.favoriteTechniqueNames,
    });
  } catch {
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

module.exports = {
  selectTechnique,
  addFavoriteTechnique,
};
