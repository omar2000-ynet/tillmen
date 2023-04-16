const express = require('express');
require('dotenv').config({path:"./config/.env"});
const back_tilman_router = require('./router/back_tilman_router');
const PORT = process.env.PORT||8080;
const { json, urlencoded } = require('body-parser');   
const UserCs = require('./middleware/authConnectUser');
const cors = require("cors"); // Permet au server de recevoir des requêttes multiorigine
var cookieParser = require('cookie-parser');
const path = require('path');
// https://meet.google.com/tmv-hhko-uce?pli=1
const app = express();              
app.use(cookieParser());         
const corsOptions = {                                        
    origin: ['https://till-2f088.web.app','http://localhost:3000'],   
    credentials: true,   
    // 'allowedHeaders': ['sessionId', 'Content-Type'],
    // 'exposedHeaders': ['sessionId'],
    // 'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // 'preflightContinue': false 
}
app.use(cors(corsOptions)); 
app.use(json()) 
app.use(urlencoded({extended:true}))
  
  
app.get('*',UserCs.checkUser)// Donc,  sur n'importe quel route où sera le user, il y aura un tcheking
app.get('*',UserCs.checkUser2)// Donc,  sur n'importe quel route où sera le user Client, il y aura un tcheking

app.post('/jwtid2',UserCs.requireAuth2,(req, res)=>{ 
    // res.status(200).send(res.locals.user._id)
});   
app.post('/jwtid',UserCs.requireAuth,(req, res)=>{ 
    // res.status(200).send(res.locals.user._id)
});   

require('./config/bd');
//On inclut le fichier des routes nommé : back_tilma,_router
app.use('/api/tilman/', back_tilman_router);
// 
app.use('/uploads', express.static(path.join(__dirname,"uploads")));

app.get('/', (req, res)=>{
    res.send("Home page");
})   

// if(process.env.NODE_ENV === 'production'){
//       app.use(express.static('client/build'));

//       app.get('*',(req,res)=>{
//            res.sendFile(path.join(__dirname,'client', 'build','index.html'))
//       })
// } 
app.listen(PORT, ()=>{   
    console.log(`localhost:${PORT}`);
})
