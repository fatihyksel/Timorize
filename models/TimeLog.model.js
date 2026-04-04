const mongoose = require('mongoose');

/**
 * TimeLog: _id, taskName, durationSpent, completedAt (date-time)
 * TimerInput (taskName, durationInMinutes) oturum girdisi; kalıcı kayıt bu modelde tutulur.
 */
const timeLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    durationSpent: {
      type: Number,
      required: true,
      min: 0,
    },
    completedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret._id = ret._id.toString();
        if (ret.completedAt) {
          ret.completedAt = ret.completedAt.toISOString();
        }
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

timeLogSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('TimeLog', timeLogSchema);
