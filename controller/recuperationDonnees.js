const schemaClient = require('../model/client');
const schemaCandidat = require('../model/candidat');
const schemaComment = require('../model/CommentaireClientForCandidat');

//  Création d'une expression regulière générale de nos requettes
const exp = (exp) => {
    // const valeur = new RegExp(`^${exp}$`,"i")
    const valeur = new RegExp(`${exp}`, "i")// toute expression contenant le mot exp (insensible à la casse)
    return valeur
}
//Recupération de l'ID d'un candidat pas son Id
module.exports.candidParId = (req, res) => {
    try {
        const id = req.params.id;
        schemaCandidat.findById(
            id
        )
            .then(data => {
                res.send(data)
            })
            .catch(err => res.send(err))

    } catch (error) {
        res.send(error);
    }
}

//Recupération de l'ID d'un client pas son Id
module.exports.clientParId = (req, res) => {
    try {
        const id = req.params.id;
        schemaClient.findById(
            id
        )
            .then(data => {
                res.send(data)
            })
            .catch(err => res.send(err))

    } catch (error) {
        res.send(error)
    }
}

//Recupération de tous les documents de la collection des candidats
module.exports.tousLesDoc = async (req, res) => {
    try {
        const data = await schemaCandidat.find();
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if (data[j]?.description) {
                All.push(data[j])
            }
        }
        res.send(All)
    } catch (error) {
        res.send(error);
    }
}
const tousLesCandidat = async () => {
    try {
        const data = await schemaCandidat.find();
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if (data[j]?.description) {
                All.push(data[j])
            }
        }
        return All;
    } catch (error) {
        return false;
    }
}
//Recupération de tous les documents de la collection des clients
module.exports.tousLesDocClient = (req, res) => {
    try {
        schemaClient.find()
            .then(data => {
                res.send(data)
            })
            .catch(err => res.send(err))
    } catch (error) {
        res.send(error)
    }
}
module.exports.parmetier = async (req, res) => {
    try {
        const met = req.body.metier;
        const data = await schemaCandidat.find({ metiers: { $all: [{ $elemMatch: { 'metier': exp(met) } }] } })
        const All = [];
        if (data) {
            for (let j = 0; j < data.length; j++) {
                if (data[j]?.description) {
                    All.push(data[j])
                }
            }
            res.send(All);
        }
    } catch (error) {
        res.send(error);
    }
}
module.exports.parcommune = async (req, res) => {
    try {
        const commune = req.body.commune;
        const data = await schemaCandidat.find({ "adresse.commune_secteur": exp(commune) })
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if (data[j]?.description) {
                All.push(data[j])
            }
        }
        res.send(All);

    } catch (error) {
        res.send(error);
    }
}
module.exports.parmetieretcommune = async (req, res) => {
    try {

        const { metier, commune } = req.body;
        const data = await schemaCandidat.find({ $and: [{ metiers: { $all: [{ $elemMatch: { 'metier': exp(metier) } }] } }, { "adresse.commune_secteur": exp(commune) }] })
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if (data[j]?.description) {
                All.push(data[j])
            }
        }
        res.send(All);

    } catch (error) {

    }
}
module.exports.parmetieretnomouprenom = async (req, res) => {
    try {
        const { metier, nom } = req.body;
        const data = await schemaCandidat.find({ $and: [{ metiers: { $all: [{ $elemMatch: { 'metier': exp(metier) } }] } }, { $or: [{ 'nom': exp(nom) }, { 'prenom': exp(nom) }] }] })
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if (data[j]?.description) {
                All.push(data[j])
            }
        }
        res.send(All);
    } catch (error) {
        res.send(error)
    }
}
module.exports.nomouprenom = async (req, res) => {
    try {

        const { nom } = req.body;
        const data = await schemaCandidat.find({ $or: [{ 'nom': exp(nom) }, { 'prenom': exp(nom) }] })
        const All = [];
        for (let j = 0; j < data.length; j++) {
            if (data[j]?.description) {
                All.push(data[j])
            }
        }
        res.send(All);

    } catch (error) {
        res.send(error);
    }
}
module.exports.listMetierEtCommune = async (req, res) => {
    try {
        const TBmetier = async () => {
            const t = await tousLesCandidat();
            if (t) {
                const met = [];
                const com = [];//Récupère toutes les commune
                for (let i = 0; i < t.length; i++) {
                    // Début script  data commune
                    if (com.length == 0) {
                        if (t[i].adresse.commune_secteur) {
                            com.push(t[i].adresse.commune_secteur)
                        }
                    } else {
                        let k2 = 1;
                        for (let s = 0; s < com.length; s++) {
                            if (com[s] != exp(t[i]?.adresse.commune_secteur)) {
                                k2 = k2 * 1
                            } else {
                                k2 = k2 * 0
                            }
                        }
                        if (k2 == 1) {
                            if (t[i]?.adresse.commune_secteur) {
                                com.push(t[i]?.adresse.commune_secteur)
                            }
                        }
                    }
                    //Fin script data commune
                    for (let k = 0; k < t[i]?.metiers?.length; k++) {
                        if (met?.length == 0) {
                            if (t[i]?.metiers[k].metier) {
                                met.push(t[i]?.metiers[k].metier)
                            }
                        } else {
                            let k1 = 1;
                            for (let s = 0; s < met.length; s++) {
                                if (met[s] != exp(t[i]?.metiers[k].metier)) {
                                    k1 = k1 * 1
                                } else {
                                    k1 = k1 * 0
                                }
                            }
                            if (k1 == 1) {
                                if (t[i]?.metiers[k].metier) {
                                    met.push(t[i]?.metiers[k].metier)
                                }
                            }
                        }
                    }
                }
                const res = {
                    metier: met,
                    commune: com
                }
                return res;
            }
        }
        const result = await TBmetier();
        res.send(result);
    } catch (error) {
        res.send(error);
    }
}
module.exports.recupereCommentParEmail = async (req, res) => {
    try {
        var dt = new Date();
        const y = dt.getFullYear();
        const d = dt.getDate();
        const m = dt.getMonth();
        const mi = dt.getMinutes();
        const s = dt.getSeconds();
        const dts = y + "" + d + "" + m + "" + mi + "" + s;
        console.log(dts);
        const email = req.params.email;
        const data = await schemaComment.find({ 'emailCandit': exp(email) });
        var o = data?.length - 1;
        const dataSend = [];
        for (let i = o; i >= 0; i--) {
            dataSend.push(data[i]);
        }
        return res.send(dataSend);
    } catch (error) {
        return res.send(error)
    }

}