const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Board", boardSchema);