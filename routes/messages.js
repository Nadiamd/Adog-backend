var express = require("express");
var router = express.Router();

const User = require("../models/users.js");
const Message = require("../models/messages");
const Room = require("../models/room");
const mongoose = require("mongoose");

const db = mongoose.connection;

//----------------------------------------------------------------------------------
//
router.get("/sync/:idRoom", (req, res) => {
  Room.findById(req.params.idRoom) // on fait une recherche par l'id dans la collection Room
    .populate({
      // L'instruction .populate  sert à cibler un élèment de la collection
      path: "messages", // Ici nous ciblons précisement les messages
      populate: {
        //
        path: "name", // cible name
        select: "name", // selectionne name
      },
    })
    .then((dataRoom) => {
      res.json(dataRoom); // infos de la room : id des 2 users, date, message etc.
    });
});

//----------------------------------------------------------------------------------

router.get("/mesconversations/:token", (req, res) => {
  // FindOne avec le token de l'utilisateur qui est connecté.
  // Le premier populate récupère les infos contenu dans la collection room
  User.findOne({ token: req.params.token })
    .populate({
      //il nous sert à cibler un élèment de la collection
      path: "rooms", //Ici nous ciblons précisement les rooms
      // Le deuxieme populate récupère les informations de chaque utilisateur présent dans une room (on a séléctionné uniqumement token, name)

      populate: [
        //
        {
          path: "userOne", //  avec le populate on cible userOne
          select: ["token", "name"], // et on selectionne le token et le name
        },
        {
          path: "userTwo", // on cible userTwo
          select: ["token", "name"], // et on selectionne le token et le name
        },
      ],
    })
    .then((data) => {
      res.json(data);
    });
});
//----------------------------------------------------------------------------------

router.post("/new", (req, res) => {
  // Création d'un nouveau message
  User.findOne({ token: req.body.token }).then((user) => {
    // par le token de l'utilisateur qui est connecté

    const newMessage = new Message({
      // on prépare le new Message sur la base du schéma message
      content: req.body.content, // contenu du message
      name: user._id, // on enregistre sur la key name l'id du user connecté (celui qui envoie le message) (name est une clé etrangère qui fait reference à la collection users)
      received: false, //est ce que le message est reçu? à false par défaut
      roomId: req.body.idRoom, // id de la room créée
    });

    newMessage.save().then((newdoc) => {
      // on save ce new message dans la collection message (nouveau message = newdoc = data sauvegardée)
      res.json(newdoc); //on renvoie new doc en json pour que le front puisse travailler dessus

      Room.updateOne(
        // on utilise la methode updateOne sur la collection room
        // ce nouveau message envoyé va intégrer la room
        { _id: req.body.idRoom }, // ce premier paramètre _id = c'est ce qu'on cible
        { $push: { messages: newdoc } } // en deuxième paramètre, c'est ce qu'on modifie : le message. On utilise la methode push  de mongoose car dans le schéma room, messages est un tableau de clés étrangères
      ).then();
    });
  });
});

//----------------------------------------------------------------------------------

module.exports = router;
