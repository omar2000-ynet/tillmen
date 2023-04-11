const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');
const schemaCandidat = mongoose.Schema({
    nom:{   
        type:String,
        maxlength: 25,
        lowercase: true,
        trim: true
    },
    prenom:{
        type:String,
        maxlength: 25,
        lowercase: true,
        trim: true
    },
    genre:{
        type:String,
        lowercase: true,
        maxlength:1,
    },
    lieu_naiss:{
        type: String,
        lowercase: true
    },
    date_naiss:{
        type:String
    },
    email:{
        type: String,
        validate: [isEmail],
        lowercase: true,
        unique: true,
        trim: true,
        required:true
    },
    telephone:{
        type: String,
        unique: true,
        trim: true,
        required:true
    },
    adresse:{ 
         type:{ 
            pays:{
                type: String,
                lowercase: true,
                trim: true
            },
            province:{
                type: String,
                lowercase: true,
                trim: true
            },
            ville_territoire:{
                type: String,
                lowercase: true,
                trim: true
            },
            commune_secteur:{
                type: String,
                lowercase: true,
                trim: true
            },
            quartier_groupement:{
                type: String,
                lowercase: true,
                trim: true
            },
            avenue_vilage:{
                type: String,
                lowercase: true,
                trim: true
            },
            num_parc:{
                type: String,
                lowercase: true,
                trim: true 
            }
         }
    },
    password: {
        type: String,
        required: true,
        minlength:8
    },
    picture: {
        type: String,
        default: "./tillmenImg/logoTill.png"
    },
    metiers:{
        type:[
            {
                metier:{
                    type:String,
                    unique:true
                },
                experience:Number 
            }
        ]        
    },
    nbrEtoile :{
        type:Number,
        default:1
    },
    description: {
        type: String,
        trim: true
    },
    service:[String],
    disponibilite:{
        type: Number,
        trim: true
    },
    langues:{
        type:[
              {
                 langue:{
                    type:String
                 },
                 niveau:String
              }
        ]
    },
    competences:[String], 
    etude:{
        type:[
            {
                etablissement: String,
                AnneeEntree:Number,
                anneeSortie: Number,
                titreObtenu: String
            }
        ]
    },
    historiqueTravaux:{
        type:[
            {
                description:String,
                picture: {
                    type: String,
                    default: "./tillmenImg/logoTill.png"
                },
                date:Date
            }
        ]
    }, 
    cv:{
        type:String
    },
    docCertification:{
        type:[
           { 
              titreDoc:String,
              pathdoc:String
           }
        ]
    },
    post:{
        type:[ 
            {
                link_img:String,
                description:String
            }
        ]
    },
    licence:{
        type:Boolean,
        default:false
    },
    disponible:{
        type:Boolean,
        default:true
    },
    //pour une entreprise
    nom_entreprise:{ 
        type:String,
        maxlength: 25,
        lowercase: true,
        trim: true
    },
    date_creation: Date
},
{
    timestamps: true,
})
schemaCandidat.pre("save", async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt); 
    next();
} );

// On gère la connexion de chaque utilisateur par  mot de passe, adresse ynet ou number phone.
schemaCandidat.statics.login = async function(email, password){ 
    const user =  await this.findOne({$or:[{"email":email},{"telephone":email}]})
    if(user){
        var auth = await bcrypt.compare(password, user.password); 
        if(auth){
            return user; 
        }else{
             auth = password==" ";
             if(auth){
                 return user; 
             }else{
                 return 'password';
             }
        }
    }else{
       return "phone"
    }
 }; 
const candidat = mongoose.model("candidats", schemaCandidat);
module.exports = candidat;
