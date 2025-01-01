const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the name"],
      index: true, // Optional: Index for faster search by name if needed
    },
    email: {
      type: String,
      required: [true, "Please add the email address"],
      unique: true,
      index: true, // Index for quick lookup by email
    },
    password: {
      type: String,
      required: [true, "Please add the Password"],
      select: false, // Exclude password from query results by default for security
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
