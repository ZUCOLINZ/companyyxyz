const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      unique: true,
      type: String,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    tankSize: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
