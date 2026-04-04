const mongoose = require('mongoose');

/**
 * Plan: _id, title, date (api.yaml — format: date)
 * PlanInput: title, date, tasks (görev dizisi)
 */
const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    tasks: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret._id = ret._id.toString();
        if (ret.date) {
          ret.date = ret.date.toISOString().slice(0, 10);
        }
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

planSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Plan', planSchema);
