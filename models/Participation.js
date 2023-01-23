const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const participation = sequelize.define("participation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        // auto increment
        autoIncrement: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_event: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

module.exports = participation;
