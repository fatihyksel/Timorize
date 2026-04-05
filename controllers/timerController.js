const mongoose = require('mongoose');
const { TimeLog } = require('../models');

async function createTimer(req, res) {
  try {
    const { taskName, durationInMinutes } = req.body ?? {};

    if (
      taskName === undefined ||
      taskName === null ||
      durationInMinutes === undefined ||
      durationInMinutes === null
    ) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const duration = Number(durationInMinutes);
    if (!Number.isFinite(duration) || duration < 0) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const durationSpent = Math.round(duration * 10_000) / 10_000;

    const log = await TimeLog.create({
      userId: req.user.id,
      taskName: String(taskName).trim(),
      durationSpent,
      completedAt: new Date(),
    });

    return res.status(201).json(log.toJSON());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

async function listTimeLogs(req, res) {
  try {
    const logs = await TimeLog.find({ userId: req.user.id }).sort({
      completedAt: -1,
    });
    return res.status(200).json(logs.map((d) => d.toJSON()));
  } catch {
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

async function deleteTimeLog(req, res) {
  try {
    const { logid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(logid)) {
      return res.status(404).json({ message: 'Zaman kaydı bulunamadı' });
    }

    const deleted = await TimeLog.findOneAndDelete({
      _id: logid,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Zaman kaydı bulunamadı' });
    }

    return res.sendStatus(204);
  } catch {
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

module.exports = {
  createTimer,
  listTimeLogs,
  deleteTimeLog,
};
