const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.'],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    }
  },
    {
      timestamps: true,
    }
);

const User = model("User", userSchema);

module.exports = User;
