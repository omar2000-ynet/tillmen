// Fonction de gestion des erreur lors de l'inscription
module.exports.ControlErr = (err) => {
    let errors = {
        nom:"",
        postnom:"", 
        prenom:"",
        genre:"",                  
        lieu_naiss:"",
        date_naiss:"",
        telephone:"",  
        email:"",
        password:""
      };
  
    if (err.message.includes("`nom`")) 
       errors.nom = "Le nom doit avoir au moins 3 caractères";
   
    if (err.message.includes("`postnom`")) 
       errors.postnom = "Le postnom doit avoir au moins 3 caractères";
    
    if (err.message.includes("`prenom`")) 
       errors.prenom = "Le prénom doit avoir au moins 3 caractères";
    
    if (err.message.includes("genre")) 
       errors.genre = "Le genre doit avoir seulement 1 caractère: M ou F";
    
    if (err.message.includes("lieu_naiss")) 
      errors.lieu_naiss = "Le lieu de naissance doit avoir au moins 3 caractères";
    
    if (err.message.includes("date_naiss")) 
      errors.date_naiss = "Ajouter votre date de naissance!";

    if (err.message.includes("lieu_naiss")) 
      errors.lieu_naiss = "Le lieu de naissance doit avoir au moins 3 caractères";
      
    if (err.message.includes("telephone")) 
      errors.telephone = "Numéro de téléphone incorecte";

    if (err.message.includes("password"))
        errors.password = "Le mot de passe doit faire 8 caractères minimum";
    
    if (err.message.includes("email"))
        errors.email = "L'adresse email incorrect!";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("telephone"))
        errors.telephone = "Le numéro de téléphone est déjà pris";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = " L'adresse email que vous avez tappé est déjà prise";

    return errors;
}