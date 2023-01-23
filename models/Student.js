const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Student = sequelize.define("students", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        // auto increment
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING,
        // NOT NULL
        allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bde: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Student;
