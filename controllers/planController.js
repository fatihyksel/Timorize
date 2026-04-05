const mongoose = require('mongoose');
const { Plan } = require('../models');

function parsePlanDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function createDailyPlan(req, res) {
  try {
    const { title, date, tasks } = req.body ?? {};
    if (!title || !date) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const planDate = parsePlanDate(String(date));
    if (!planDate) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const taskList = Array.isArray(tasks)
      ? tasks.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const plan = await Plan.create({
      userId: req.user.id,
      title: String(title).trim(),
      date: planDate,
      tasks: taskList,
    });

    return res.status(201).json(plan.toJSON());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

async function updateDailyPlan(req, res) {
  try {
    const { planid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(planid)) {
      return res.status(404).json({ message: 'Plan bulunamadı' });
    }

    const { title, date, tasks } = req.body ?? {};
    if (!title || !date) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const planDate = parsePlanDate(String(date));
    if (!planDate) {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }

    const taskList = Array.isArray(tasks)
      ? tasks.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const plan = await Plan.findOneAndUpdate(
      { _id: planid, userId: req.user.id },
      {
        title: String(title).trim(),
        date: planDate,
        tasks: taskList,
      },
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ message: 'Plan bulunamadı' });
    }

    return res.status(200).json(plan.toJSON());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Geçersiz istek verisi' });
    }
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

async function getDailyPlans(req, res) {
  try {
    const { date } = req.query ?? {};
    const filter = { userId: req.user.id };

    if (date != null && String(date).trim() !== '') {
      const planDate = parsePlanDate(String(date));
      if (!planDate) {
        return res.status(400).json({ message: 'Geçersiz istek verisi' });
      }
      const start = new Date(planDate);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const plans = await Plan.find(filter).sort({ date: 1 });
    return res.status(200).json(plans.map((p) => p.toJSON()));
  } catch (_err) {
    return res.status(500).json({ message: 'İşlem başarısız oldu veya yetkisiz erişim.' });
  }
}

module.exports = {
  createDailyPlan,
  updateDailyPlan,
  getDailyPlans,
};
