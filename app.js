const Sequelize = require('sequelize');
const express = require('express');
const sequelize = require('./util/databases');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());
const cron = require('node-cron');
require('dotenv').config();

const { sendAppointmentReminder } = require('./controllers/emailservice');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const User = require('./model/user');
const Staff = require('./model/staff');
const Service = require('./model/service');
const StaffService = require('./model/staffService');
const Appointment = require('./model/appointment');
const Payment = require('./model/invoice');
const Review = require('./model/review');

Staff.hasMany(Appointment, { foreignKey: 'staffId' });
Service.hasMany(Appointment, { foreignKey: 'serviceId' });

Appointment.belongsTo(Staff, { foreignKey: 'staffId' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });

Staff.belongsToMany(Service, { through: StaffService, foreignKey: 'staffId' });
Service.belongsToMany(Staff, { through: StaffService, foreignKey: 'serviceId' });

Review.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Review.belongsTo(Staff, { foreignKey: 'staffId' });

const GeneralRoutes = require('./route/user');
const serviceRoutes = require('./route/service');
const staffRoutes = require('./route/staff');
const appointmentRoutes = require('./route/appointment');
const reviewRoutes = require('./route/review');

app.use('/api', GeneralRoutes);
app.use('/api' , serviceRoutes);
app.use('/api', staffRoutes);
app.use('/api', appointmentRoutes );
app.use('/api', reviewRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

cron.schedule('0 9 * * *', async () => { // Runs every day at 9 AM
    const appointments = await Appointment.findAll({
        where: {
            date: new Date().toISOString().split('T')[0] // Today's date
        }
    });
    appointments.forEach(appointment => {
        sendAppointmentReminder(appointment.customerEmail, appointment);
    });
});

sequelize.sync({ force: false })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });