const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], // clé étrangère fait refrence à la collection messages (tableau car plusieurs messages échagés) 
  dateMatch: {
    type: Date,
    default: Date.now(),
  },
  userOne: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Clé étrangère fait reference à la collection users
  userTwo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Clé étrangère fait reference à la collection users
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
