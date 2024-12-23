const Razorpay = require('razorpay');
const Appointment = require('../model/appointment'); 
const Invoice = require('../model/invoice');
const Staff = require('../model/staff');
const Service = require('../model/service');
const { sendBookingConfirmation, sendAppointmentReminder } = require('./emailservice');

const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;
        const appointments = await Appointment.findAll({ where: { date } });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve available slots' });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const { date, time, customerName, customerEmail, customerPhone, staffId, serviceId } = req.body;

        if (!date || !time || !customerName || !customerEmail || !customerPhone || !staffId || !serviceId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const appointment = await Appointment.create({
            date,
            time,
            customerName,
            customerEmail,
            customerPhone,
            staffId,
            serviceId
        });

        try {
            await sendBookingConfirmation(customerEmail, {id: appointment.id,   date, time, customerName, staffId, serviceId });
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
        }

        res.status(201).json(appointment);
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
};

const rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.date = date;
        appointment.time = time;
        await appointment.save();

        res.json({ success: true, message: 'Appointment rescheduled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reschedule appointment' });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        await appointment.destroy();
        res.json({ success: true, message: 'Appointment canceled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
};

const getAppointmentDetails = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [Staff, Service]
        });

        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found' });
        }

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve appointments' });
    }
};

module.exports = { getAvailableSlots, bookAppointment, getAppointmentDetails, rescheduleAppointment, cancelAppointment };