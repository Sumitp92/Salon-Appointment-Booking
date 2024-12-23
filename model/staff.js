const Sequelize = require('sequelize');
const sequelize = require('../util/databases');

const Staff = sequelize.define('staff', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    specialization: {
        type: Sequelize.STRING,
        allowNull: false
    },
    availability: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'staff',
    timestamps: true
});

module.exports = Staff;