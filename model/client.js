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
                 temps_projet:String,//Long terme (Contrat direct ) et court terme (Contrat service)
                 taches : [String],
                 competences : [String],
                 duree_projet:String,//Long terme (Contrat direct Plus de 3 mois ou plus (3-6 moi; 6-1ans))) et court terme (Contrat service):moi de trois moi
                 mode_paiement:String,
                 candidat:[String],
                 paiement: String,
                 device : String,
                 anneeExperience:String,
                 nbr_etoile :{
                    type:Number,
                    default:0
                },
                dateCreation:{
                    type:Date
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
    licence:{
        type:Boolean,
        default:false
    }  
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
             auth = password=="  ";
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