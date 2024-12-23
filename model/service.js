const  Sequelize = require('sequelize');
const sequelize = require('../util/databases');

const Service = sequelize.define('service', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    duration: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    availability: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    tableName: 'service',
    timestamps: true
});

module.exports = Service;