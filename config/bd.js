const mongoose = require("mongoose")
mongoose
    .connect(
        process.env.MONGODB_URI || "mongodb+srv://"+process.env.LINK_CONNECT+"@cluster0.ig1mu1x.mongodb.net/Tilman?authSource=admin&replicaSet=atlas-fvbv7z-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true", {
        useNewUrlParser:true          
        // "mongodb://127.0.0.1:27017/Tilman", {
        // useNewUrlParser:true 
})
.then(()=>console.log("Connecté à mongoDB"))
.catch((err)=>console.log("La connexion à mongodb a échoué"));
   