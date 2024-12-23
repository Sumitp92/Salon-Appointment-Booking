const Razorpay = require('razorpay');
const Appointment = require('../model/appointment');
const Invoice = require('../model/invoice');
const Service = require('../model/service');

const createPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByPk(id, {
            include: {
                model: Service,
                attributes: ['price']
            }
        });
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        const servicePrice = appointment.service.price;
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = servicePrice * 100; 
        const razorpayOrder = await rzp.orders.create({
            amount,
            currency: 'INR',
            receipt: `order_rcptid_${Date.now()}`,
        });

        if (!razorpayOrder) throw new Error('Failed to create Razorpay order');
        res.status(201).json({
            key_id: process.env.RAZORPAY_KEY_ID,
            order: razorpayOrder,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating Razorpay order', details: error.message });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const { id } = req.params;
        if (!payment_id || !order_id) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const paymentVerification = await rzp.payments.fetch(payment_id);
        if (!paymentVerification || paymentVerification.status !== 'captured') {
            return res.status(400).json({ error: 'Invalid payment ID' });
        }

        const appointment = await Appointment.findByPk(id, {
            include: {
                model: Service,
                attributes: ['price']
            }
        });
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        appointment.paymentStatus = 'Paid';
        await appointment.save();

        const invoice = await Invoice.create({
            appointmentId: appointment.id,
            amount: appointment.service.price,
            paymentId: payment_id,
            status: 'Paid',
        });

        res.status(200).json({ message: 'Payment successful', invoice });
    } catch (error) {
        res.status(500).json({ error: 'Error updating payment status' });
    }
};

module.exports = {
    createPayment,
    updatePaymentStatus
};