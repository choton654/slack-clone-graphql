const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "team",
    required: true,
  },
});

const Member = mongoose.model("member", memberSchema);

module.exports = Member;
