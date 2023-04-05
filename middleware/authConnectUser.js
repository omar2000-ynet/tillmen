//Contrôle du user pendant sa navigation; contrôle de l'authenticité de son token
const jwt = require('jsonwebtoken');
const schemaClient = require('../model/client');
const schemaCandidat = require('../model/candidat');

//Ce middleware verifie si le user user est connecté et génère les informations de ce user.
module.exports.checkUser = (req, res, next) => {
    const token = req?.cookies?.jwt;
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
            res.locals.user = null;
            res.cookie("jwt", "", { maxAge: 1 });
            next(); 
        } else {
          let user = await schemaCandidat.findById(decodedToken.id);
          console.log(user?._id + " connecté!");
          res.locals.user = user;
          // console.log(res.locals.user);
          next();
        }   
      }); 
    } else {   
      res.locals.user = null;
      next();
    }
  };     
 
  // Ce middleware vérifi chaque fois si le user est connecté.
  module.exports.requireAuth = (req, res, next) => {
      const token = req.body.jwt; 
      if(token) {  
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
          if (err) {
            console.log(err);
            res.status(400).json("non Token") 
          } else { 
              res.send(decodedToken.id);
              next();       
          }     
        });
      }else{
        res.send("pas de token");
      }
  };     



//Controle de l'authentification d'un client

//Ce middleware verifie si le user user est connecté et génère les informations de ce user.
module.exports.checkUser2 = (req, res, next) => {
  const token = req?.cookies?.jwt2;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
          res.locals.user = null;
          res.cookie("jwt2", "", { maxAge: 1 });
          next(); 
      } else {
        let user = await schemaClient.findById(decodedToken.id);
        console.log(user?._id + " connecté As Client !");
        res.locals.user = user;
        // console.log(res.locals.user);
        next();
      }   
    }); 
  } else {   
    res.locals.user = null;
    next();
  }
};     

// Ce middleware vérifi chaque fois si le user est connecté.
module.exports.requireAuth2 = (req, res, next) => {
    const token = req.body?.jwt2; 
    // console.log("token =" + token) ;
    if(token) {  
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.status(400).json("non Token") 
        } else { 
            res.send(decodedToken.id);
            next();       
        }     
      });
    }else{
      res.send("pas de token");
    }
};
  