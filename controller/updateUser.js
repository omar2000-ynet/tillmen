const multer = require('multer');    
const path = require('path');
const schemaClient = require('../model/client');
const schemaCandidat = require('../model/candidat');
const schemaSuggest = require('../model/suggest');
const fs = require('fs');
//Ajout des images de profiles pour le client et le candidat

const storage2 = multer.diskStorage({
    // destination:(req, file, cb)=>{
        // cb(null, `${__dirname}/../uploads/imageProfil/`);  
        // cb(null, `./uploads/imageProfil/`);  
        // cb(null, `https://tillmenbackend.onrender.com/uploads/imageProfil/`);  
    // },
    destination:path.join(__dirname,'..','uploads','imageProfil'),
    filename:(req,file, cb)=>{
        const id = req.params.id;
        // const fileName = id+".jpg";
        const fileName = `${id}${path.extname(file.originalname)}`
        cb(null, fileName);
       
    }
})
const maxsize = 1024 * 1024 * 5;
const maxsize1 = 1024 * 1024 * 10;
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

module.exports.uploadProfilClient = async(req, res)=>{
  
    try {
    
      uploadc(req, res, async(err)=>{
        if(err instanceof multer.MulterError){
            res.send(err);
        }else if(err){
            res.send(err)
        }else{
            const id = req.params.id;
            // const fileName = id +".jpg";
            const fileName = `${id}${path.extname(req.file.originalname)}`
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
  } catch (error) {
      console.log(error)
  }
}
const storage = multer.diskStorage({
    // destination:(req, file, cb)=>{
        // cb(null, `https://tillmenbackend.onrender.com/uploads/imageProfilCadidat/`);  
        // cb(null, `./uploads/imageProfilCadidat/`);
    // },
    destination:path.join(__dirname,'..','uploads','imageProfilCadidat'),
    filename:(req,file, cb)=>{
        const id = req.params.id; 
        // const fileName = id+".jpg";
        const fileName = `${id}${path.extname(file.originalname)}`
        console.log(fileName)
        cb(null, fileName);
    }
});
const upload = multer(
 {
   storage:storage,
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
             const fileName = `${id}${path.extname(req.file.originalname)}`
            //  console.log(fileName)
            // const fileName = id+".jpg";
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
  } catch (error) {
      console.log(error)
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
      console.log(error)
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
      console.log(error)
  }
}
module.exports.acheInscrService= (req, res)=>{
    try {
  
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
  } catch (error) {
      console.log(error)
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
      console.log(error)
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
      console.log(error)
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
      console.log(error)
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
      console.log(error)
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
      console.log(error)
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
      console.log(error)
  }
}

//Chargement du CV et Certivicat
const storageCV = multer.diskStorage({
    // destination:(req, file, cb)=>{
        // cb(null, `https://tillmenbackend.onrender.com/uploads/imageCV/`);    
        // cb(null, `${__dirname}/../uploads/imageCV/`);    
        // cb(null, `./uploads/imageCV/`);    
    // },
    destination:path.join(__dirname,'..','uploads','imageCV'),
    filename:(req,file, cb)=>{
        
        const id = req.params.id;
        const fileName = `${id}${path.extname(file.originalname)}`
        // const fileName = id+".pdf";
        cb(null, fileName);
       
    }
})
var uploadCV = multer(
    {
      storage:storageCV,
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
            const fileName = `${id}${path.extname(req.file.originalname)}`
            // const fileName = id +".pdf";
        //    console.log(id)
          try {
              await schemaCandidat.findByIdAndUpdate(
                  id,
                  {
                      $set:{cv:"uploads/imageCV/"+fileName}
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
  } catch (error) {
      console.log(error)
  }
}

// D'autres document/Certification 
const storage4 = multer.diskStorage({
    // destination:(req, file, cb)=>{
        // cb(null, `ageCertif/`);  
        // cb(null, `./uploads/imageCertif/`);  
        // cb(null, `${__dirname}/../uploads/imageCertif/`);  
        // cb(null, `$https://tillmenbackend.onrender.com/uploads/imageCertif/`);  
    // },
    destination:path.join(__dirname,'..','uploads','imageCertif'),

    filename:(req,file, cb)=>{
        const id = req.params.id;
        var dt =new Date();
        const y = dt.getFullYear();
        const d = dt.getDate();
        const  m = dt.getMonth();
        const mi = dt.getMinutes();
        const dts = y+d+m+mi;
        const fileName = `${id+dts}${path.extname(file.originalname)}`
        // const fileName = id+dts+".pdf";
        cb(null, fileName);
    }
});
var uploadCertif = multer(
    {
      storage:storage4,
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
          const dts = y+d+m+mi;
          const titreDoc = req.body.titreDoc;
          const fileName = `${id+dts}${path.extname(req.file.originalname)}`
        // const fileName = id+dts +".pdf";
          
          try {
              await schemaCandidat.findByIdAndUpdate(
                  id,
                  {
                      $addToSet:{
                        docCertification:{
                            titreDoc : titreDoc,
                            pathdoc: "uploads/imageCertif/"+fileName
                        }
                     }
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
  } catch (error) {
      console.log(error)
  }
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
    try {
  
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
  } catch (error) {
      console.log(error)
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
      console.log(error)
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
      console.log(error)
  }
}


const storage5 = multer.diskStorage({
    // destination:(req, file, cb)=>{
        // cb(null, `${__dirname}/../uploads/imageHisto`);  
        // cb(null, `./uploads/imageHisto/`);  
        // cb(null, `https://tillmenbackend.onrender.com/uploads/imageHisto`);  
        // cb(null, `ageHisto`);  
    // },
    destination:path.join(__dirname,'..','uploads','imageHisto'),
    filename:(req,file, cb)=>{
        const id = req.params.id;
        var dt =new Date();
        const y = dt.getFullYear();
        const d = dt.getDate();
        const  m = dt.getMonth();
        const mi = dt.getMinutes();
        const dts = y+d+m+mi;
        const fileName = `${id+dts}${path.extname(file.originalname)}`;
        // const fileName = id+dts +".jpg";
        cb(null, fileName);
    }
}) 
const upload5 = multer(
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
   storage:storage5,
   limits:{fileSize:maxsize}
}).single('image');

//Historique
module.exports.uploadHistorique = async(req, res)=>{
    try {
  
    upload5(req, res, async(err)=>{
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
          const dts = y+d+m+mi;
          const description = req.body.description;
        //   const fileName = id+dts +".jpg";
          const fileName = `${id+dts}${path.extname(req.file.originalname)}`
          try {            
              schemaCandidat.findByIdAndUpdate(  
                  id, 
                  {  
                      $addToSet:{
                        historiqueTravaux:{
                            picture:"uploads/imageHisto/"+fileName,
                            date : dt,
                            description: description
                         }
                       }
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
  } catch (error) {
      console.log(error)
  }
}


