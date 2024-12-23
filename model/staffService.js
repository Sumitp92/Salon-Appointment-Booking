const Sequelize = require('sequelize');
const sequelize = require('../util/databases');
const Staff = require('./staff');
const Service = require('./service');

const StaffService = sequelize.define('staffService', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
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
    }
}, {
    tableName: 'staffService',
    timestamps: true
});

module.exports = StaffService;