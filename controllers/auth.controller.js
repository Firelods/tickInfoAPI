var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const User = require("../models/User");
exports.signup = (req, res) => {
    // insert user
    User.create({
        nom: req.body.nom,
        prenom: req.body.prenom,
        groupe: req.body.groupe,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        bde: req.body.bde,
    }) // if no error then send user
        .then((user) => {
            res.send(user);
        }) // if error log it

        .catch((err) => {
            res.status(500).send({ message: err.message });
        });
};

exports.signin = (req, res) => {
    console.log(req.body);
    User.findOne({
        where: {
            email: req.body.email,
        },
    }).then((user) => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!",
            });
        }
        console.log("test");

        var token = jwt.sign({ id: user.id, bde: user.bde }, "BDEINFONICE2023", {
            expiresIn: 86400, // 24 hours
        });

        res.status(200).send({
            accessToken: token,
        });

    });
};
