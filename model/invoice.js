const Sequelize = require('sequelize');
const sequelize = require('../util/databases');

const Invoice = sequelize.define('invoice', {
    appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    paymentId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    tableName: 'invoice',
    timestamps: true
});

module.exports = Invoice;