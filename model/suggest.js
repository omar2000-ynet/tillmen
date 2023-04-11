const mongoose = require('mongoose');

const schemaSuggest = mongoose.Schema(
    {
        message:{   
            type:String,
            lowercase: true,
        }, 
        date:Date   
    },
    {
        timestamps: true,
    }
)

const suggest = mongoose.model("suggestions",schemaSuggest);
module.exports = suggest;