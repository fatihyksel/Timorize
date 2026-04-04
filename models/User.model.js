const mongoose = require('mongoose');
const { TECHNIQUE_NAMES } = require('./constants/techniqueNames');

/**
 * API yanıt şeması: User (_id, name, email)
 * Kimlik: UserInput (name, email, password) — parola veritabanında hash olarak saklanır.
 * Zaman teknikleri: TechniqueInput enum değerleri kullanıcıya özel tutulur.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    activeTechniqueName: {
      type: String,
      enum: [...TECHNIQUE_NAMES, null],
      default: null,
    },
    favoriteTechniqueNames: [
      {
        type: String,
        enum: TECHNIQUE_NAMES,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret._id = ret._id.toString();
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
