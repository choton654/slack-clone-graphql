const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema(
  {
    text: String,
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
    },
  },
  { timestamps: true }
);

const Directmessage = mongoose.model("direct-message", directMessageSchema);

module.exports = Directmessage;
