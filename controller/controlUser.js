const schemaClient = require('../model/client');
const schemaCandidat = require('../model/candidat'); 
const schemaSuggest = require('../model/suggest'); 
const jwt = require('jsonwebtoken');

 const ControlErrs = require('../utile/ControlErreur');

module.exports.inscrireClient = async(req, res)=>{
   try {
  
         const {nom, prenom, genre, lieu_nais, date_nais, email,telephone,adresse, password} = req.body;
         const client = await new schemaClient({
            nom:nom, 
            prenom:prenom, 
            genre:genre, 
            lieu_nais:lieu_nais, 
            date_nais:date_nais, 
            email:email, 
            telephone: telephone,
            adresse: adresse,
            password:password
         })
         try {
            const clients = await client.save();
            return res.status(201).send(clients);
         } catch (err) {
               const errors = ControlErrs.ControlErr(err);
               return res.status(400).send(errors);
         }

     
   } catch (error) {
        res.send(error) 
   }
}
module.exports.inscrireClientEntreprise = async(req, res)=>{

   try {
      
 const {nom, prenom, genre, nom_entreprise, date_creation, email,telephone,adresse, password} = req.body;
 const client = await new schemaClient({
    nom:nom, 
    prenom:prenom, 
    genre:genre, 
    nom_entreprise:nom_entreprise, 
    date_creation:date_creation, 
    email:email, 
    telephone: telephone,
    adresse: adresse,
    password:password
 })
 try {
    const clients = await client.save();
    return res.status(201).send(clients);
 } catch (err) {
      const errors = ControlErrs.ControlErr(err);
      return res.status(400).send(errors);
 }
   } catch (error) {
      res.send(error)  
   }
}
//Inscription Candidat
module.exports.inscrireCandidat = async(req, res)=>{
   try {
      
 const {nom, prenom, genre, lieu_naiss, date_naiss, email,telephone,pays,province,ville_territoire,commune_secteur,quartier_groupement,avenue_vilage,num_parc, password} = req.body;
 const candidat = await new schemaCandidat({
    nom:nom, 
    prenom:prenom, 
    genre:genre,     
    lieu_nais:lieu_naiss, 
    date_naiss:date_naiss, 
    email:email, 
    telephone: telephone,  
    adresse:{ 
         pays:pays,
         province:province, 
         ville_territoire:ville_territoire,
         commune_secteur:commune_secteur,
         quartier_groupement:quartier_groupement,
         avenue_vilage:avenue_vilage,
         num_parc:num_parc
      },
    password:password
 })
 try {
    const candidats = await candidat.save();
    return res.status(201).send(candidats);
 } catch (err) {
   const errors = ControlErrs.ControlErr(err);
   return res.status(400).send(errors); 
 }
   } catch (error) {
      res.send(error)  
   }
}
module.exports.inscrireCandidatEntreprise = async(req, res)=>{
   try {
      
 const {nom, prenom, genre, nom_entreprise, date_creation, email,telephone,pays,province,ville_territoire,commune_secteur,quartier_groupement,avenue_village,num_parc, password} = req.body;
 const candidat = await new schemaCandidat({
    nom_entreprise:nom_entreprise, 
    date_creation:date_creation, 
    nom :nom,
    prenom: prenom,
    telephone:telephone,
    email: email,
    genre:genre,
    adresse:{ 
         pays:pays,
         province:province, 
         ville_territoire:ville_territoire,
         commune_secteur:commune_secteur,
         quartier_groupement:quartier_groupement,
         avenue_vilage:avenue_village,
         num_parc:num_parc
   },
    password:password
 })
 try {
    const candidats = await candidat.save();
    return res.status(201).send(candidats);
 } catch (err) {
   const errors = ControlErrs.ControlErr(err);
   return res.status(400).send(errors); 
 }
   } catch (error) {
      res.send(error)  
   }
}

const maxAge = 365 * 24 * 60 * 60 * 1000; //expire après 3 jours
const createToken = (id) =>{
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
         expiresIn:maxAge
    }) 
}; 

module.exports.connexionClient = async(req, res)=>{
   try {
      
   const {email, password} = req.body;                                                                                                     
   try{ 
      const user = await schemaClient.login(email, password);
      if(user?._id){
            const token = createToken(user._id);
            res.cookie('jwt2', token, { httpOnly: true, maxAge});
            res.status(200).send({user:user, jwt2:token});
            console.log(`Nouvelle connexion: ${user?._id}  pour ${user?.prenom}`);
      }else{
          if(user =="password"){
                res.status(200).send("passe")
          }
          else if(user == "phone"){
             res.status(200).send("phone")
          }
      }           
   } catch(err){
        res.status(400).send(err);
   }
   } catch (error) {
      res.send(error)  
   }
}

module.exports.deconnexionClient = (req, res)=>{
   try {
      
       res.cookie('jwt', '', { maxAge: 1 });
       res.redirect('/');
   } catch (error) {
      res.send(error)  
   }
}
module.exports.connexionCandidat = async(req, res)=>{
   try {
      
   const {email, password} = req.body;                                                                                                     
   try{ 
      const user = await schemaCandidat.login(email, password);
      if(user?._id){
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge});
            res.status(200).send({user:user, jwt:token});
            console.log(`Nouvelle connexion: ${user?._id}  pour ${user?.prenom}`);
      }else{
          if(user =="password"){
                res.status(200).send("passe")
          }
          else if(user == "phone"){
             res.status(200).send("phone")
          } 
      }         
   } catch(err){ 
        res.status(400).send(err);
   } 
   } catch (error) {
      res.send(error)  
   }
}

module.exports.deconnexionCandidat = (req, res)=>{
   try {
      
       res.cookie('jwt', '', { maxAge: 1 });
       res.redirect('/');
   } catch (error) {
      res.send(error)  
   }
}
const dt =new Date();
module.exports.ajouterSuggestion = async(req, res)=>{
   try {
      
   const {message} = req.body;
   const suggest = await new schemaSuggest({
      message:message, 
      date:dt, 
   })
   try {
      const suggests = await suggest.save();
      return res.status(201).send(suggests);
   } catch (err) {
        const errors = ControlErrs.ControlErr(err);
        return res.status(400).send(errors);
   }
   } catch (error) {
      res.send(error)  
   }
  }
