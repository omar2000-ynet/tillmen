const mongoose = require('mongoose');
const problemeAide = new mongoose.Schema({
    email:{
        type:String,
        lowercase:true,
        trim:true
    },
    probleme: String,
    dateAide: String
},
{
    timestamps: true,
})

const probleme = mongoose.model('problemeAides', problemeAide);
module.exports= probleme;