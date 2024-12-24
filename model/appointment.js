const Sequelize = require('sequelize');
const sequelize = require('../util/databases');
const Staff = require('./staff');
const Service = require('./service');
const User = require('./user');

const Appointment = sequelize.define('appointment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    time: {
        type: Sequelize.STRING,
        allowNull: false
    },
    customerName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    customerEmail: {
        type: Sequelize.STRING,
        allowNull: false
    },
    customerPhone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    staffId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Staff,
            key: 'id'
        }
    },
    serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Service,
            key: 'id'
        }
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'appointments',
    timestamps: true
});

module.exports = Appointment;