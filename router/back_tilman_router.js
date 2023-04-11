// const { Router } = require('express');
const multer = require('multer');    
const path = require('path');
const schemaClient = require('../model/client');
const schemaCandidat = require('../model/candidat');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const controlUser = require('../controller/controlUser');
const uploadController = require('../controller/updateUser');
const recupereDonnees = require('../controller/recuperationDonnees')

//Route d'inscription
router.post('/inscrireClientEntreprise',controlUser.inscrireClientEntreprise);
router.post('/inscrireClient',controlUser.inscrireClient);
router.post('/inscrireCandidatEntreprise',controlUser.inscrireCandidatEntreprise);
router.post('/inscrireCandidat',controlUser.inscrireCandidat);
router.post('/connexionCient',controlUser.connexionClient);
router.get('/deconnexionCient',controlUser.deconnexionCandidat);
router.post('/connexionCandidats',controlUser.connexionCandidat);
    
//Route de update


router.post('/profilClient/:id', uploadController.uploadProfilClient);
router.post('/profilCandidat/:id', uploadController.uploadProfilCandidat);

router.post('/autre/:id',uploadController.acheInscr1);
router.post('/metier/:id',uploadController.acheInscrMetier);
router.post('/service/:id',uploadController.acheInscrService);
router.post('/langue/:id',uploadController.acheInscrLangue);
router.post('/etude/:id',uploadController.acheInscrEtude);
router.post('/competence/:id',uploadController.acheInscreCompetence);
router.post('/historiqueTravaux/:id',uploadController.uploadHistorique);
router.post('/modification2/:id',uploadController.modification2);
router.post('/modification/:id',uploadController.modification);
router.post('/cv/:id',uploadController.uploadCV_);
router.post('/certificat/:id',uploadController.uploadCertif_);
router.get('/licenceC/:id',uploadController.licenceC);
router.get('/licence/:id',uploadController.licence);
router.get('/disponible/:id',uploadController.disponible);

//Apdate Client
router.post('/rep_quest_secur/:id',uploadController.rep_quest_secur);
router.post('/projet/:id',uploadController.projet);

//Recupération des données
router.get('/identiteCandid/:id',recupereDonnees.candidParId);
router.get('/identiteClient/:id',recupereDonnees.clientParId);
router.get('/toutesDatas',recupereDonnees.tousLesDoc);
router.get('/toutesDatasClient',recupereDonnees.tousLesDocClient);
//Routes liées aux modes de recherches
router.post('/parmetier',recupereDonnees.parmetier); 
router.post('/parcommune',recupereDonnees.parcommune);
router.post('/parmetieretcommune',recupereDonnees.parmetieretcommune);
router.post('/parmetieretnomouprenom',recupereDonnees.parmetieretnomouprenom);
router.post('/nomouprenom',recupereDonnees.nomouprenom);

//Suggestion 
router.post('/suggestion',controlUser.ajouterSuggestion);


module.exports = router;       