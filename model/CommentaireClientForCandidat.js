const mongoose = require('mongoose');

const schemaComment = mongoose.Schema({
      commentaire:{
        type:String,
        lowercase: true,
      },
      emailCandit: String,
      client:{
          picture : String,
          nom: String,
          prenom: String
      },
      idProjet:String,
      dateComment: String,
      score:Number
});

const comment = mongoose.model('commentaires', schemaComment);
module.exports = comment;