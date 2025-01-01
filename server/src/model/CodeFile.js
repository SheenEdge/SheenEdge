const mongoose = require("mongoose");

const CodeFileSchema = new mongoose.Schema(
  {
    FileName: {
      type: String,
      required: [true, "Please provide the File Name"],
      index: true, // Index for faster search by FileName
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true, // Index for quick searches by UserId
    },
    Access: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true, // Index for faster access-based search
      },
    ],
    content: {
      type: String,
    },
    language: {
      type: String,
      required: [true, "Please add the language"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for combined searches by UserId and Access
CodeFileSchema.index({ UserId: 1, Access: 1 });

module.exports = mongoose.model("CodeFile", CodeFileSchema);
