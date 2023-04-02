const multer = require('multer');    
const path = require('path');
const schemaClient = require('../model/client');
const schemaCandidat = require('../model/candidat');
const fs = require('fs');
//Ajout des images de profiles pour le client et le candidat

const storage2 = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, `${__dirname}/../uploads/imageProfil/`);  
    },
    filename:(req,file, cb)=>{
        const id = req.params.id;
        const fileName = id +".jpg";
        cb(null, fileName);
       
    }
})
const maxsize = 1024 * 1024 * 5;
var uploadc = multer(
     {
       storage:storage2,
       fileFilter:(req, file,cb)=>{
         if(file.mimetype == "image/jpg" ||
             file.mimetype == "image/png" ||
             file.mimetype == "image/jpeg"){
             cb(null, true)
         }else{
             cb(null, false);
             cb(new Error("Format invalid"));
         }
       },
       limits:{fileSize:maxsize}
         }).single('image');
const storage = multer.diskStorage({
        destination:(req, file, cb)=>{
            cb(null, `${__dirname}/../uploads/imageProfilCadidat`);  
        },
        filename:(req,file, cb)=>{
            const id = req.params.id;
            const fileName = id +".jpg";
            cb(null, fileName);
        }
    })
const upload = multer(
     {
       fileFilter:(req, file,cb)=>{
         if(file.mimetype == "image/jpg" ||
             file.mimetype == "image/png" ||
             file.mimetype == "image/jpeg"){
             cb(null, true)
         }else{
             cb(null, false);
             cb(new Error("Format invalid"));
         }
       },
       storage:storage,
       limits:{fileSize:maxsize}
}).single('image');
module.exports.uploadProfilClient = async(req, res)=>{
      uploadc(req, res, async(err)=>{
        if(err instanceof multer.MulterError){
            res.send(err);
        }else if(err){
            res.send(err)
        }else{
            const id = req.params.id;
            const fileName = id +".jpg";
            try {
                await schemaClient.findByIdAndUpdate(
                    id,
                    {
                        $set:{picture:"uploads/imageProfil/"+fileName}
                    },
                    {
                        new:true, upset:true 
                    }
                )
                .then((data)=>res.send(data))
                .catch((err)=>res.status(500).send(err))
            } catch (err) {
                res.status(500).send({message: err})
            }
            
        }
      })
}
module.exports.uploadProfilCandidat = async(req, res)=>{
      upload(req, res, async(err)=>{
        if(err instanceof multer.MulterError){
            res.send(err);
        }else if(err){ 
            res.send(err)
        }
        else{
            const id = req.params.id;
            console.log(id);
            const fileName = id +".jpg";
             const nom = req.body.nom;
             console.log(nom)  
            try {            
                schemaCandidat.findByIdAndUpdate(  
                    id, 
                    {  
                        $set:{picture:"uploads/imageProfilCadidat/"+fileName}
                    },
                    { 
                        new:true, upset:true 
                    }
                )
                .then((data)=>res.send(data))
                .catch((err)=>res.send(err))
            } catch (err) {
                res.status(200).send({message: err})
            }  
        }
      })
}
//Achevement de l'inscription du candidat
module.exports.acheInscrMetier= async(req, res)=>{
    const {metier,experience} = req.body;
    const id = req.params.id;

    schemaCandidat.findById(
        id 
    )
    .then(data=>{
        let k = 1;
        for (let i = 0; i < data?.metiers?.length; i++) {
            if(data?.metiers[i].metier==metier){
                k = k *0
            }
        }
        if(k !=0){
            schemaCandidat.findByIdAndUpdate(
                id, 
                {
                    $addToSet:{ 
                        metiers:{
                            metier:metier,
                            experience:experience
                        }
                    }
                },
                {new:true, upsert:true} 
            )
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }))
        }else{
            res.send("err")
        }
    })
    .catch(err=>res.send(err))
}
module.exports.historiqueTravaux= async(req, res)=>{
    const historiqueTravaux = req.body.historiqueTravaux;
    const id = req.params.id;
   await schemaCandidat.findByIdAndUpdate(
        id, 
        {
            $addToSet:{ 
                historiqueTravaux:historiqueTravaux
            }
        },
        {new:true, upsert:true} 
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))

}
module.exports.acheInscr1= async(req, res)=>{
    const {description, disponibilite} = req.body;
    const id = req.params.id;
   await schemaCandidat.findByIdAndUpdate(
        id,
        {
            $set:{
                description: description,
                disponibilite:disponibilite
            }
        },
        {new:true, upsert:true} 
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
}
module.exports.acheInscrService= (req, res)=>{
    const {service} = req.body;
    const id = req.params.id;
    schemaCandidat.findByIdAndUpdate(
        id,
        {
            $addToSet:{
                service:service
            }
        },
        {new:true, upsert:true}
    ).then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))

}
module.exports.acheInscrLangue= (req, res)=>{
    const {langue,niveau} = req.body;
    const id = req.params.id;
    schemaCandidat.findById(
        id 
    )
    .then(data=>{
        let k = 1;
        for (let i = 0; i < data?.langues?.length; i++) {
            if(data?.langues[i].langue==langue){
                k = k *0
            }
        }
        if(k !=0){
            schemaCandidat.findByIdAndUpdate(
                id,
                {
                    $addToSet:{
                        langues:{
                            langue:langue,
                            niveau:niveau
                        }
                    }
                },
                {new:true, upsert:true}
            ).then((data) => res.send(data))
            .catch((err) => res.status(500).send({ message: err }))
        }else{
            res.send("err")
        }
    })
    .catch(err=>res.send(err))
   
}
module.exports.acheInscrEtude= (req, res)=>{
    const {etablissement,AnneeEntree,anneeSortie,titreObtenu} = req.body;
    const id = req.params.id;
    schemaCandidat.findByIdAndUpdate(
        id,
        {
            $addToSet:{
                etude:{
                    etablissement: etablissement,
                    AnneeEntree:AnneeEntree,
                    anneeSortie: anneeSortie,
                    titreObtenu: titreObtenu
                }
            }
        },
        {new:true, upsert:true}
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))

}
module.exports.acheInscreCompetence= (req, res)=>{
    const {competence} = req.body;
    const id = req.params.id;
    schemaCandidat.findByIdAndUpdate(
        id,
        {
            $addToSet:{
                competences:competence
            }
        },
        {new:true, upsert:true}
    ).then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
}
//Acceptation de la licence par le candidat
module.exports.licence= async(req, res)=>{
    const id = req.params.id;
    await schemaCandidat.findByIdAndUpdate(
        id,
        {
            $set:{
                licence:true
            }
        },
        {new:true, upsert:true} 
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
}
//Acceptation de la licence par le client
module.exports.licenceC= async(req, res)=>{
    const id = req.params.id;
    await schemaClient.findByIdAndUpdate(
        id,
        {
            $set:{
                licence:true
            }
        },
        {new:true, upsert:true} 
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
}

module.exports.disponible= async(req, res)=>{
    const id = req.params.id;
    const disponible = req.body.disponible;
    await schemaCandidat.findByIdAndUpdate(
        id,
        {
            $set:{
                disponible:disponible
            }
        },
        {new:true, upsert:true} 
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
}
//Chargement du CV et Certivicat
const storage3 = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, `${__dirname}/../../client/public/imageCV/`);  
    },
    filename:(req,file, cb)=>{
        const id = req.params.id;
        const fileName = id +".jpg";
        cb(null, fileName);
       
    }
})
const storage4 = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, `${__dirname}/../../client/public/imageCertif/`);  
    },
    filename:(req,file, cb)=>{
        const id = req.params.id;
        const fileName = id +".jpg";
        cb(null, fileName);
       
    }
});
var uploadCV = multer(
    {
      storage:storage3,
      fileFilter:(req, file,cb)=>{
        if(file.mimetype == "image/jpg" ||
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpeg"){
            cb(null, true)
        }else{
            cb(null, false);
            cb(new Error("Format invalid"));
        }
      },
      limits:{fileSize:maxsize}
}).single('image');

var uploadCertif = multer(
     {
       storage:storage4,
       fileFilter:(req, file,cb)=>{
         if(file.mimetype == "image/jpg" ||
             file.mimetype == "image/png" ||
             file.mimetype == "image/jpeg"){
             cb(null, true)
         }else{
             cb(null, false);
             cb(new Error("Format invalid"));
         }
       },
       limits:{fileSize:maxsize}
}).single('image');

module.exports.uploadCV_ = async(req, res)=>{
    uploadCV(req, res, async(err)=>{
      if(err instanceof multer.MulterError){
          res.send(err);
      }else if(err){
          res.send(err)
      }else{
          const id = req.params.id;
          const fileName = id +".jpg";
           console.log(id)
          try {
              await schemaCandidat.findByIdAndUpdate(
                  id,
                  {
                      $set:{cv:"./imageCV/"+fileName}
                  },
                  {
                      new:true, upset:true
                  }
              )
              .then((data)=>res.send(data))
              .catch((err)=>res.status(500).send(err))
          } catch (err) {
              res.status(500).send({message: err})
          }
          
      }
    })
}
module.exports.uploadCertif_ = async(req, res)=>{
      uploadCertif(req, res, async(err)=>{
      if(err instanceof multer.MulterError){
          res.send(err);
      }else if(err){
          res.send(err)
      }else{
          const id = req.params.id;
          const fileName = id +".jpg";
          try {
              await schemaCandidat.findByIdAndUpdate(
                  id,
                  {
                      $set:{certification:"./imageDiplome/"+fileName}
                  },
                  {
                      new:true, upset:true,  setDefaultsOnInsert: true 
                  }
              )
              .then((data)=>res.send(data))
              .catch((err)=>res.status(500).send(err))
          } catch (err) {
              res.status(500).send({message: err})
          }
          
      }
    })
}

//Mise à jour du document du candidat

module.exports.rep_quest_secur = async(req, res)=>{
    const id = req.params.id;
    const {question, reponse} = req.body;
    await schemaClient.findByIdAndUpdate(
        id,
        {
            $addToSet:{
                rep_question_Secur:{
                    question:question,
                    reponse:reponse
                }
            }
        },
        {new: true, upsert: true}
    )
    .then(data=>res.status(200).send(data))
    .catch(err=>res.send(err))
}

module.exports.projet = async(req, res)=>{
    const id = req.params.id;
    const {temps_projet,competences,taches, duree_projet, mode_paiement,candidat,dateCreation} = req.body;
     await schemaClient.findByIdAndUpdate(
        id,
        {
            $addToSet:{
                projet:{
                    temps_projet: temps_projet,
                    competences: competences,
                    taches: taches,
                    candidat: candidat,
                    duree_projet:duree_projet,
                    mode_paiement:mode_paiement,
                    dateCreation:dateCreation
                    // paiement:paiement,
                    // device:device
                }
            }
        },
        {new:true, upsert:true}
     )
     .then(data=>res.status(200).send(data))
     .catch(err=>res.send(err))
}

//Update des modification du candidat
module.exports.modification= async(req, res)=>{
    const {nom,prenom, genre,lieu_naiss,date_naiss,disponible,disponibilite, pays,province,ville_territoire,commune_secteur,quartier_groupement, avenue_village,num_parc} = req.body;
    const id = req.params.id;
    await schemaCandidat.findByIdAndUpdate(
        id,
        {
            $set:{
                nom:nom,
                prenom:prenom,
                genre:genre,
                lieu_naiss:lieu_naiss,
                date_naiss:date_naiss,
                disponibilite:disponibilite,
                disponible:disponible,
                adresse:{
                    pays:pays,
                    province:province, 
                    ville_territoire:ville_territoire,
                    commune_secteur:commune_secteur,
                    quartier_groupement:quartier_groupement,
                    avenue_vilage:avenue_village,
                    num_parc:num_parc
                }
            }
        },
        {new:true, upsert:true} 
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
}
//Update des modification du candidat
module.exports.modification2= async(req, res)=>{
    const {nom,prenom, genre,disponible,disponibilite, pays,province,ville_territoire,commune_secteur,quartier_groupement, avenue_village,num_parc} = req.body;
    const id = req.params.id;
    await schemaCandidat.findByIdAndUpdate(
        id,
        {
            $set:{
                nom:nom,
                prenom:prenom,
                genre:genre,
                disponibilite:disponibilite,
                disponible:disponible,
                adresse:{
                    pays:pays,
                    province:province, 
                    ville_territoire:ville_territoire,
                    commune_secteur:commune_secteur,
                    quartier_groupement:quartier_groupement,
                    avenue_vilage:avenue_village,
                    num_parc:num_parc
                }
            }
        },
        {new:true, upsert:true} 
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
}
 