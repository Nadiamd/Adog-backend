const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({ 
  name: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // clé étrangère fait réference à la collection users
  content: String, 
  date: {
    type: Date,
    default: Date.now(),
  },
  received: Boolean,
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, // clé étrangère fait réference à la collection room
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
