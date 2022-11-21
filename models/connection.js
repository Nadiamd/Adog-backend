const mongoose = require('mongoose');


const connectionString = process.env.CONNECTION_STRING; // utilisation de la varibale d'environnement contenant notre lien de connction vers la BDD

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('🐶 Database connected'))
  .catch(error => console.error(error));

