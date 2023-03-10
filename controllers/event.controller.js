var jwt = require("jsonwebtoken");
const Event = require("../models/Event");
const Participation = require("../models/Participation");
const User = require("../models/User");
const Student = require("../models/Student");
const QRCode = require('qrcode');
const fs = require('fs');
const opts = {
    errorCorrectionLevel: 'H',
    type: 'terminal',
    quality: 0.95,
    margin: 1,
    color: {
        dark: '#208698',
        light: '#FFF',
    },
}
const mailgunapi = require('../config/mail.config')
const mailgun = require('mailgun-js');
const mg = mailgun({ apiKey: mailgunapi.mailgunapi, domain: 'seinksansdoozebank.engineer', host: 'api.eu.mailgun.net' });

exports.createEvent = (req, res) => {
    // insert user
    Event.create({
        nom: req.body.nom,
        description: req.body.description,
        date: req.body.date,
        heure: req.body.heure,
        lieu: req.body.lieu,
        bde: req.body.bde,
        prix: req.body.prix,
    }) // if no error then send user
        .then((event) => {
            res.send(event);
        }) // if error log it

        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};


exports.getEvents = (req, res) => {
    Event.findAll().then((events) => {
        res.send(events);
    });
}

exports.makeUserParticipate = (req, res) => {
    console.log(req.body);
    var email = req.body.email;
    var idEvent = req.body.idEvent;
    var surname = req.body.surname;
    var name = req.body.name;
    var bde = req.body.bde;
    // create Student if not exist and create participation
    Student.findOrCreate({
        where: {
            email: email,
            nom: surname,
            prenom: name,
            bde: bde,
        },
    }).then((student) => {
        Participation.findOrCreate({
            where: {
                id_event: idEvent,
                id_user: student[0].id
            }
        }).then(async (participation) => {
            //make a jwt token to make it a QR code

            const token = jwt.sign({ idParticipation: participation[0].id }, "BDEINFONICE2023", {
                expiresIn: 1209600, // 24 hours
            });
            // make a qrcode to send it by mail
            const qrImage = QRCode.toFile('qrCode.png', token, opts).then(() => {
                console.log('done');
                var file = fs.readFileSync('qrCode.png');
                var attch = new mg.Attachment({ data: file, filename: "QrCodeSoir??e.png", contentType: 'image/png' });
                const data = {
                    from: 'BDE bde@seinksansdoozebank.engineer',
                    to: email,
                    subject: 'Ta place pour la soir??e',
                    text: 'Bonjour ! Tu as ??t?? inscrit ?? la soir??e ! Voici ton QR code pour y acc??der (en pi??ce jointe) !',
                    attachment: attch,

                };
                mg.messages().send(data, function (error, body) {
                    console.log(body);
                    console.log(error);
                });
                res.send(participation);
            });
            // get the qrcode created and send it by mail

        });
    });



}

exports.useInvite = (req, res) => {
    var token = req.body.token;
    jwt.verify(token, "BDEINFONICE2023", function (err, decoded) {
        console.log(decoded);
        if (err) {
            res.status(200).send({ message: err.message });
        }
        else {
            // first check if the participation is not already used
            var idUserFromParticipation = 0;
            Participation.findOne({
                where: {
                    id: decoded.idParticipation,
                },
            }).then((participation) => {
                idUserFromParticipation = participation.id_user;
                if (participation.used) {
                    res.status(200).send({ message: "Participation d??j?? utilis??e !" });
                    return;
                }
                else {
                    Participation.update({
                        used: true,
                    }, {
                        where: {
                            id: decoded.idParticipation,
                        },
                    }).then((participation) => {
                        //search for the user through the participation id  (inner join)
                        console.log(idUserFromParticipation);
                        User.findOne({
                            where: {
                                id: idUserFromParticipation,
                            },
                        }).then((user) => {
                            console.log(participation);
                            res.send({ message: "Etudiant " + user.nom + " " + user.prenom + " entr?? " });
                        });
                    }).catch((err) => {
                        res.status(200).send({ message: err.message });
                    });;// if error log it

                }
            });

        }
    });

}