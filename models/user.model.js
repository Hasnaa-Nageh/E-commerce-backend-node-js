const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  passwordChangeAt: {
    type: Date,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  wishlist: [
    {
      type: mongoose.Types.ObjectId,
      ref: "products",
    },
  ],
  addresses: [
    {
      city: {
        type: String,
      },
      phone: {
        type: String,
      },
      street: {
        type: String,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
