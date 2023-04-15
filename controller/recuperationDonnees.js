const schemaClient = require('../model/client');
const schemaCandidat = require('../model/candidat');

//  Création d'une expression regulière générale de nos requettes
const exp =(exp)=>{
    // const valeur = new RegExp(`^${exp}$`,"i")
    const valeur = new RegExp(`${exp}`,"i")// toute expression contenant le mot exp (insensible à la casse)
    return valeur
}

//Recupération de l'ID d'un candidat pas son Id
module.exports.candidParId=(req, res)=>{
    try {
        const id = req.params.id;
        schemaCandidat.findById(
            id 
        )
        .then(data=>{
            res.send(data)
        })
        .catch(err=>res.send(err))
       
    } catch (error) {
        res.send(error);
    }
}

//Recupération de l'ID d'un client pas son Id
module.exports.clientParId=(req, res)=>{
    try {   
        const id = req.params.id;
        schemaClient.findById(
            id 
        )
        .then(data=>{
            res.send(data)
        })
        .catch(err=>res.send(err))
         
    } catch (error) {
        res.send(error)
    }
}

//Recupération de tous les documents de la collection des candidats
module.exports.tousLesDoc= async(req, res)=>{
    try {
        const data=await schemaCandidat.find();
        const All = [];
        for (let j = 0; j < data.length; j++) {
                if(data[j]?.description){
                All.push(data[j])
                }
        }
         res.send(All)
    } catch (error) {
        res.send(error);
    }
}
//Recupération de tous les documents de la collection des clients
module.exports.tousLesDocClient=(req, res)=>{
    try {
        schemaClient.find()
        .then(data=>{
            res.send(data)
        })
        .catch(err=>res.send(err))    
    } catch (error) {
            res.send(error)
    }
}
module.exports.parmetier= async(req, res)=>{
    try {
        const met = req.body.metier; 
        const data = await schemaCandidat.find({metiers:{$all:[{$elemMatch:{'metier':met}}]}})
        const All = []; 
        if(data){
            for (let j = 0; j < data.length; j++) {
                    if(data[j]?.description){
                    All.push(data[j]) 
                    }
            }
            res.send(All);
        } 
    } catch (error) {
          res.send(error);
    }
} 
module.exports.parcommune=async(req, res)=>{
    try {
        const commune = req.body.commune;
        const data = await schemaCandidat.find({"adresse.commune_secteur":commune})
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if(data[j]?.description){
            All.push(data[j])
            }
        }
        res.send(All);
         
    } catch (error) {
           res.send(error);  
    }
}
module.exports.parmetieretcommune=async(req, res)=>{
    try {
   
        const {metier,commune} = req.body;
        const data = await schemaCandidat.find({$and:[{metiers:{$all:[{$elemMatch:{'metier':metier}}]}}, {"adresse.commune_secteur":commune}]})
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if(data[j]?.description){
            All.push(data[j])
            }
        }
        res.send(All);
         
    } catch (error) {
            
    }
}
module.exports.parmetieretnomouprenom=async(req, res)=>{
    try {
        const {metier,nom} = req.body;
        const data = await schemaCandidat.find({$and:[{metiers:{$all:[{$elemMatch:{'metier':metier}}]}}, {$or:[{'nom':exp(nom)},{'prenom':exp(nom)}]}]})
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if(data[j]?.description){
            All.push(data[j])
            }
        }
        res.send(All);
    } catch (error) {
           res.send(error)  
    }
}
module.exports.nomouprenom=async(req, res)=>{
  try {
     
        const {nom} = req.body;
        const data = await schemaCandidat.find({$or:[{'nom':exp(nom)},{'prenom':exp(nom)}]})
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if(data[j]?.description){
            All.push(data[j])
            }
        }
        res.send(All);
  
    } catch (error) {
        res.send(error);
    }
}