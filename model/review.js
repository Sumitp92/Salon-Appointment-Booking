const Sequelize = require('sequelize');
const sequelize = require('../util/databases');
const Appointment = require('./appointment');
const Staff = require('./staff');

const Review = sequelize.define('review', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Appointment,
            key: 'id'
        }
    },
    staffId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Staff,
            key: 'id'
        }
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    comment: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    response: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    tableName: 'reviews',
    timestamps: true
});

Review.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Review.belongsTo(Staff, { foreignKey: 'staffId' });

module.exports = Review;