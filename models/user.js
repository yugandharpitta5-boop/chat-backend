const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: "offline" },
});

module.exports = mongoose.model("User", UserSchema);