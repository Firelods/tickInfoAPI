const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Event = sequelize.define("events", {
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
    prix: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    heure: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lieu: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bde: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Event;
