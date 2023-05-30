const multer = require('multer');  
const bcrypt = require('bcrypt');  
const path = require('path');
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require("firebase/storage");
const {initializeApp} = require('firebase/app')
const config = require('../config/firebase.config');
const schemaClient = require('../model/client');
const schemaCandidat = require('../model/candidat');
const schemaComment = require('../model/CommentaireClientForCandidat');
//Ajout des images de profiles pour le client et le candidat

//Initialisation de l'application firebase
initializeApp(config);
// initialize Cloud Storage and get a reference to the service
const storage = getStorage();

const maxsize = 1024 * 1024 * 5;
const maxsize1 = 1024 * 1024 * 10;
var upload = multer( 
     {
       storage:multer.memoryStorage(),
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

module.exports.uploadProfilClient = async(req, res)=>{
    try {
      upload(req, res, async(err)=>{
        if(err instanceof multer.MulterError){
            res.send(err);
        }else if(err){
            res.send(err)
        }else{
            const id = req.params.id;
            const fileName = `${id}${path.extname(req.file.originalname)}`;
            const storageRef = ref(storage, `imageProfil/${id}`);
            //Create file metadata including the content type
            const metadata = {
                contentType : req.file.mimetype,
            }
            //Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef,req.file.buffer,metadata);
            //Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
            try {
                await schemaClient.findByIdAndUpdate(
                    id,
                    {
                        $set:{picture:downloadURL}
                    },
                    {
                        new:true, upset:true 
                    }
                )
                .then((data)=>{
                    console.log(downloadURL);
                    res.send(data)
                })
                .catch((err)=>res.status(500).send(err))
            } catch (err) {
                res.status(500).send({message: err})
            }
            
        }
      })
  } catch (error) {
    return res.status(402).send({error})
  }
}

module.exports.uploadProfilCandidat = async(req, res)=>{
    try {
      upload(req, res, async(err)=>{
        if(err instanceof multer.MulterError){
            res.status(352).send(err);
        }else if(err){ 
            res.status(350).send(err)
        }
        else{
            const id = req.params.id;
            const fileName = `${id}${path.extname(req.file.originalname)}`;
            const storageRef = ref(storage, `imageProfilCadidat/${id}`);
            //Create file metadata including the content type
            const metadata = {
                contentType : req.file.mimetype,
            }
            //Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef,req.file.buffer,metadata);
            //Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
            try {            
                schemaCandidat.findByIdAndUpdate(  
                    id, 
                    {  
                        $set:{picture:downloadURL}
                    },
                    { 
                        new:true, upset:true 
                    }
                )
                .then((data)=>{
                    console.log(downloadURL);
                    res.send(data);})
                .catch((err)=>res.status(500).send(err))
            } catch (err) {
                res.status(500).send({message: err})
            }
        }
      })
  } catch (error) {
    return res.status(402).send({error});
  }
}
//Achevement de l'inscription du candidat
module.exports.acheInscrMetier= async(req, res)=>{
    try {
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
  } catch (error) {
    return res.status(402).send({error});
  }
}

module.exports.acheInscr1= async(req, res)=>{
    try {
  
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
  } catch (error) {
      return res.status(402).send({error});
  }
}
module.exports.acheInscrService= (req, res)=>{
    try {
  
    const {service,prix_service} = req.body;
    const id = req.params.id;
    schemaCandidat.findByIdAndUpdate(
        id,
        {
            $addToSet:{
                services:{
                   service : service,
                   prix_service:prix_service
                }
                
            }
        },
        {new:true, upsert:true}
    ).then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
  } catch (error) {
      return res.status(402).send({error});
  }

}
module.exports.acheInscrLangue= (req, res)=>{
    try {
  
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
   
  } catch (error) {
      return res.status(402).send({error});
  }
}
module.exports.acheInscrEtude= (req, res)=>{
    try {
  
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

  } catch (error) {
       return res.status(402).send({error});
  }
}
module.exports.acheInscreCompetence= (req, res)=>{
    try {
  
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
  } catch (error) {
       return res.status(402).send({error});
  }
}
//Acceptation de la licence par le candidat
module.exports.licence= async(req, res)=>{
    try {
  
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
  } catch (error) {
       return res.status(402).send({error});
  }
}
//Modification du mot de passe
module.exports.password= async(req, res)=>{
    try {
       const id = req.params.id;
       const password = req.body.password;
       const salt = await bcrypt.genSalt();
       var passwords = await bcrypt.hash(password, salt); 
    await schemaCandidat.findByIdAndUpdate(
        id,
        {
            $set:{
                password:passwords
            }
        },
        {new:true, upsert:true} 
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
  } catch (error) {
       return res.status(402).send({error});
  }
}
//Modification du mot de passe
module.exports.passwordClient= async(req, res)=>{
    try {
       const id = req.params.id;
       const password = req.body.password;
       const salt = await bcrypt.genSalt();
       var passwords = await bcrypt.hash(password, salt); 
    await schemaClient.findByIdAndUpdate(
        id,
        {
            $set:{
                password:passwords
            }
        },
        {new:true, upsert:true} 
    )
    .then((data) => res.send(data))
    .catch((err) => res.status(500).send({ message: err }))
  } catch (error) {
       return res.status(402).send({error});
  }
}
//Acceptation de la licence par le client
module.exports.licenceC= async(req, res)=>{
    try {
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
  } catch (error) {
       return res.status(402).send({error});
  }
}

module.exports.disponible= async(req, res)=>{
    try {
  
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
  } catch (error) {
       return res.status(402).send({error});
  }
}


var uploadCV = multer(
    {
      storage:multer.memoryStorage(),
      fileFilter:(req, file,cb)=>{
        console.log(file)
        if(
            // file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.mimetype == "application/pdf"){
            cb(null, true)
        }else{
            cb(null, false);
            cb(new Error("Format invalid"));
        }
      },
      limits:{fileSize:maxsize1}
}).single('image');

module.exports.uploadCV_ = async(req, res)=>{
    try {
  
    uploadCV(req, res, async(err)=>{
      if(err instanceof multer.MulterError){
          res.send(err);
      }else if(err){
          res.send(err)
      }else{
            const id = req.params.id;
            const fileName = `${id}${path.extname(req.file.originalname)}`;
            const storageRef = ref(storage, `imageCV/${id}`);
            //Create file metadata including the content type
            const metadata = {
                contentType : req.file.mimetype,
            }
            //Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef,req.file.buffer,metadata);
            //Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
          try {
              await schemaCandidat.findByIdAndUpdate(
                  id,
                  {
                      $set:{cv:downloadURL}
                  },
                  {
                      new:true, upset:true
                  }
              )
              .then((data)=>{
                console.log(downloadURL);
                res.send(data);
               })
              .catch((err)=>res.status(500).send(err))
          } catch (err) {
              res.status(500).send({message: err})
          }
          
      }
    })
  } catch (error) {
    return res.status(402).send({error})
  }
}


var uploadCertif = multer(
    {
        storage:multer.memoryStorage(),
      fileFilter:(req, file,cb)=>{
        if(file.mimetype == "application/pdf"){
            cb(null, true)
        }else{
            cb(null, false);
            cb(new Error("Format invalid"));
        }
      },
      limits:{fileSize:maxsize1}
}).single('image');


module.exports.uploadCertif_ = async(req, res)=>{
    try {
  
      uploadCertif(req, res, async(err)=>{
      if(err instanceof multer.MulterError){
          res.send(err);
      }else if(err){
          res.send(err);
      }else{
          const id = req.params.id;
          var dt =new Date();
          const y = dt.getFullYear();
          const d = dt.getDate();
          const  m = dt.getMonth();
          const mi = dt.getMinutes();
          const s = dt.getSeconds();
          const dts = y+""+d+""+m+""+mi+""+s;
          const titreDoc = req.body.titreDoc;
          const fileName = `${id+dts}${path.extname(req.file.originalname)}`
        
            const storageRef = ref(storage, `imageCertif/${id+dts}`);
            //Create file metadata including the content type
            const metadata = {
                contentType : req.file.mimetype,
            }
            //Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef,req.file.buffer,metadata);
            //Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
          try {
              await schemaCandidat.findByIdAndUpdate(
                  id,
                  {
                      $addToSet:{
                        docCertification:{
                            titreDoc : titreDoc,
                            pathdoc:downloadURL
                            // pathdoc: "imageCertif/"+fileName
                        }
                     }
                  },
                  {
                      new:true, upset:true,  setDefaultsOnInsert: true 
                  }
              )
              .then((data)=>{
                console.log(downloadURL);
                res.send(data);})
              .catch((err)=>res.status(500).send(err))
          } catch (err) {
              res.status(500).send({message: err})
          }
          
      }
    })
  } catch (error) {
    return res.status(402).send({error})
  }
}

//Mise à jour du document du candidat

 
module.exports.rep_quest_secur = async(req, res)=>{
    try {
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
    } catch (error) {
        return res.status(402).send({error})
    }
}

module.exports.projet = async(req, res)=>{
    try {
        const id = req.params.id;
        console.log(req.body)
        const {type_contrat,taches,candidat, duree_projet, 
            mode_paiement,dateCreation,
            periode_essai, temps_service, lieu_travail,
            salaire_periode_essai,paiement,devise,totalapayer 
            } = req.body;
     await schemaClient.findByIdAndUpdate(
        id,
        {
            $addToSet:{
                projet:{
                    type_contrat: type_contrat, 
                    taches: taches,
                    duree_projet:duree_projet,
                    mode_paiement:mode_paiement,
                    candidat: candidat,
                    periode_essai:periode_essai,
                    temps_service:temps_service,
                    lieu_travail:lieu_travail,
                    salaire_periode_essai:salaire_periode_essai,
                    dateCreation:dateCreation,
                    paiement:paiement,//montant à payer au candidat
                    devise:devise,
                    totalapayer:totalapayer 
                }
            }
        },
        {new:true, upsert:true}
     )
     .then(data=>res.status(200).send(data))
     .catch(err=>res.send(err))
  } catch (error) {
       return res.status(402).send({error})
  }
}

//Update des modification du candidat
module.exports.modification= async(req, res)=>{
    try {
  
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
  } catch (error) {
    return res.status(402).send({error})
  }
}
//Update des modification du candidat
module.exports.modification2= async(req, res)=>{
    try {
  
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
  } catch (error) {
     return res.status(402).send({error})
  }
}



//Historique
module.exports.uploadHistorique = async(req, res)=>{
    try {
    upload(req, res, async(err)=>{
      if(err instanceof multer.MulterError){
          res.status(352).send(err);
      }else if(err){ 
          res.status(350).send(err)
      }
      else{
          const id = req.params.id;
          var dt =new Date();
          const y = dt.getFullYear();
          const d = dt.getDate();
          const  m = dt.getMonth();
          const mi = dt.getMinutes();
          const s = dt.getSeconds();
          const dts = y+""+d+""+m+""+mi+""+s;
          const description = req.body.description;
        //   const fileName = id+dts +".jpg";
          const fileName = `${id+dts}${path.extname(req.file.originalname)}`;

          const storageRef = ref(storage, `imageHisto/${id+dts}`);
          //Create file metadata including the content type
          const metadata = {
              contentType : req.file.mimetype,
          }
          //Upload the file in the bucket storage
          const snapshot = await uploadBytesResumable(storageRef,req.file.buffer,metadata);
          //Grab the public url
          const downloadURL = await getDownloadURL(snapshot.ref);
          try {            
              schemaCandidat.findByIdAndUpdate(  
                  id, 
                  {  
                      $addToSet:{
                        historiqueTravaux:{
                            picture:downloadURL,
                            date : dt,
                            description: description
                         }
                       }
                  },
                  { 
                      new:true, upset:true 
                  }
              )
              .then((data)=>{
                 console.log(downloadURL);
                res.send(data);})
              .catch((err)=>res.send(err))
          } catch (err) {
              res.status(200).send({message: err})
          }  
      }
    })
  } catch (error) {
      return res.status(402).send({error})
  }
}
module.exports.commentaire = async(req, res)=>{ 
    try {
        const dateActuelle = new Date()
          const {idProjet ,emailCandit,picture, nom, prenom, commentaire, dateComment, score} = req.body;
          const comment = await new schemaComment({
                commentaire: commentaire,
                emailCandit:emailCandit,
                client: {
                    picture : picture,
                    nom:nom,
                    prenom:prenom
                },
                idProjet:idProjet,
                dateComment: dateComment,
                score: score
          })
          try {
               const comm = await comment.save();
               return res.send(comm);
          } catch (error) {
              return res.send(error)
          }
    } catch (error) {
         return res.send(error)
    }
}
module.exports.validerProjet = async(req, res)=>{
      try {
          const {idclient, idprojet} = req.body;
          console.log(req.body);
          schemaClient.update(
            {
                _id:idclient,
                "projet._id":idprojet
            },
            {
                $set:{
                  "projet.$.valider":true
               } 
            },
            {
                new:true,upsert:true
            }
          ).then((data)=>{
            return res.send(data)
          }).catch((err)=>{
            return res.send(err)
          })
      } catch (error) {
          return res.send(error);
      }

}
