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
      enum: TECHNIQUE_NAMES,
    },
    favoriteTechniqueNames: {
      type: [
        {
          type: String,
          enum: TECHNIQUE_NAMES,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        return {
          _id: ret._id.toString(),
          name: ret.name,
          email: ret.email,
        };
      },
    },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('User', userSchema);
