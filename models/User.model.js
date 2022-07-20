const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      // unique: true -> Ideally, should be unique, but its up to you
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
    // this second object adds extra properties: `createdAt` and `updatedAt`
    {
      timestamps: true,
    }
);

const User = model("User", userSchema);

module.exports = User;
